import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["x-admin-key"];
  const secret = process.env.ADMIN_SECRET_KEY || "admin123";

  if (!key || (key !== secret && key !== process.env.ADMIN_SECRET_KEY)) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  next();
}

