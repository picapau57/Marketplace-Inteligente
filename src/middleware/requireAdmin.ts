import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["x-admin-key"];

  if (!process.env.ADMIN_SECRET_KEY) {
    console.error("ADMIN_SECRET_KEY não está configurada no ambiente");
    return res.status(500).json({ error: "Configuração de servidor ausente" });
  }

  if (key !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  next();
}
