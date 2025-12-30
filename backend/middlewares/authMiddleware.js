import jwt from "jsonwebtoken";

export const proteger = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Acceso no autorizado" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decodificado;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

export const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== "SuperAdmin") {
    return res.status(403).json({ mensaje: "Acceso restringido al SuperAdmin" });
  }
  next();
};

// Middleware para permitir múltiples roles
export const permitirRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: "Rol no autorizado" });
  }
  next();
};
