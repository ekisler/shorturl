import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Alternativa buscando por Email
    let user = await User.findOne({ email });
    if (user) throw { code: 11000 };

    user = new User({ email, password });
    await user.save();

    //jwt token

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.log(error);
    // Alternativa por defecto Mongoose
    if (error.code === 11000) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }
    return res.status(500).json({ error: "Error en el Servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user)
      return res.status(403).json({ error: "No existe el ese usuario" });

    const respuestaPassword = await user.comparePassword(password);
    if (!respuestaPassword)
      return res.status(403).json({ error: "Contraseña incorrecta" });

    // Generar el token JWT
    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, res);

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en el Servidor" });
  }
};

export const infoUser = async (req, res) => {
  try {
    const user = await User.findById(req.uid).lean();
    return res.json({ email: user.email, uid: user.id });
  } catch (error) {
    return res.status(500).json({ error: "Error de Servidor" });
  }
};

export const refreshToken = (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie) throw new Error("No existe el Token");

    const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
    const { token, expiresIn } = generateToken(uid);

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    const TokenVerificationErrors = {
      "invalid signature": "La firma del JWT no es valida",
      "jwt expired": "JWT expirado",
      "invalid token": "Token invalido",
      "No Bearer": "Utiliza formato Bearer",
      "jwt malformed": "JWT formato no valido",
    };

    return res
      .status(401)
      .send({ error: TokenVerificationErrors[error.message] });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};
