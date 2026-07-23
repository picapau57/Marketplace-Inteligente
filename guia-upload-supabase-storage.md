# Guia de Upload e Download Seguro com Supabase Storage

Este guia orienta o processo de integração do **Supabase Storage** no seu backend Node.js / Express para gerenciar o upload e o download seguro dos seus produtos digitais (PDFs, e-books, arquivos ZIP, licenças, etc.).

---

## 1. Configuração no Painel do Supabase

1. Acesse o seu projeto no [Supabase Dashboard](https://supabase.com/dashboard).
2. Vá em **Storage** no menu lateral e clique em **New Bucket**.
3. Defina os seguintes parâmetros:
   - **Bucket Name**: `produtos-digitais`
   - **Public Bucket**: **Desativado (Private)** 🔒 *(Essencial para garantir que ninguém consiga baixar seus arquivos sem ter comprado)*.
   - **Allowed MIME types**: Opcional (ex: `application/pdf`, `application/zip`, etc.).
   - **Max file size**: Defina o limite desejado (ex: `100MB`).
4. Clique em **Save**.

---

## 2. Variáveis de Ambiente (`.env` e Vercel)

Adicione as seguintes chaves de ambiente no seu arquivo `.env` e nas configurações de variáveis da Vercel:

```env
# URL do projeto Supabase (encontrada em Settings -> API)
SUPABASE_URL=https://seu-projeto.supabase.co

# Chave Service Role (encontrada em Settings -> API -> service_role secret)
# ATENÇÃO: Esta chave concede acesso total do lado do servidor. NUNCA a exponha no frontend!
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Nome do Bucket Privado criado no Supabase Storage
SUPABASE_STORAGE_BUCKET=produtos-digitais
```

---

## 3. Instalação das Dependências

No seu projeto Node.js / Express, instale os pacotes necessários:

```bash
npm install @supabase/supabase-js multer
npm install -D @types/multer
```

---

## 4. Inicialização do Cliente Supabase (`src/lib/supabaseAdmin.ts`)

Crie o arquivo de conexão administrativa usando a `SERVICE_ROLE_KEY`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('⚠️ Alerta: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados.');
}

// Cliente com permissões administrativas (Bypassa RLS para uploads e geração de Signed URLs)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'produtos-digitais';
```

---

## 5. Implementação das Rotas no Express (`app.ts`)

### A. Configuração do Multer para armazenamento em memória

```typescript
import multer from 'multer';
import { supabaseAdmin, BUCKET_NAME } from './src/lib/supabaseAdmin.js';
import { requireAdmin } from './src/middleware/requireAdmin.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // Limite de 100MB
});
```

---

### B. Rota de Upload do Arquivo Digital (`POST /api/products/:id/upload`)

```typescript
app.post('/api/products/:id/upload', requireAdmin, upload.single('arquivo'), async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado. Envie o arquivo no campo "arquivo".' });
  }

  try {
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filePath = `produtos/${id}/${Date.now()}_${cleanFileName}`;

    // Upload direto da memória (Buffer) para o Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error('Erro no Supabase Storage:', error);
      return res.status(500).json({ error: 'Erro ao enviar arquivo para o Supabase Storage.', details: error.message });
    }

    // Salve o caminho do arquivo (filePath) no seu Banco de Dados (Firestore / Postgres)
    // Exemplo Firestore:
    // await updateDoc(doc(db, 'products', id), { filePath, fileFormat: file.mimetype });

    return res.json({
      success: true,
      message: 'Arquivo enviado com sucesso para o Supabase Storage!',
      filePath: data.path,
    });
  } catch (err: any) {
    console.error('Erro no servidor durante upload:', err);
    return res.status(500).json({ error: 'Falha interna ao processar o upload.', details: err.message });
  }
});
```

---

### C. Rota de Download com Link Assinado Temporário (`GET /api/orders/:orderId/download`)

```typescript
app.get('/api/orders/:orderId/download', async (req, res) => {
  const { orderId } = req.params;
  const { email } = req.query;

  // 1. Busque o pedido no seu Banco de Dados e valide o e-mail do comprador
  // const orderData = await getOrderById(orderId);
  // if (orderData.customerEmail !== email) return res.status(401).json({ error: 'Não autorizado' });

  try {
    // 2. Para cada produto do pedido, gere uma URL assinada temporária (válida por 24 horas)
    const downloads = await Promise.all(
      orderData.items.map(async (item) => {
        let downloadUrl = item.downloadUrl;
        let isSignedUrl = false;

        if (item.filePath) {
          // Gerar Signed URL com validade de 24 horas (86400 segundos)
          const { data, error } = await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .createSignedUrl(item.filePath, 60 * 60 * 24);

          if (data?.signedUrl) {
            downloadUrl = data.signedUrl;
            isSignedUrl = true;
          }
        }

        return {
          productTitle: item.productTitle,
          downloadUrl,
          isSignedUrl,
          expiresIn: isSignedUrl ? '24 horas' : undefined,
        };
      })
    );

    return res.json({
      success: true,
      orderId,
      downloads,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
```

---

## 6. Vantagens do Supabase Storage

1. **Segurança Privada**: Ao manter o bucket privado, ninguém consegue prever ou acessar a URL direta dos arquivos.
2. **URLs Assinadas (Signed URLs)**: As URLs de download expiram em 24 horas (ou no prazo configurado), prevenindo o compartilhamento desautorizado de links.
3. **Escalabilidade CDN**: Integrado com a infraestrutura do Supabase, garantindo velocidade no download global dos seus clientes.
