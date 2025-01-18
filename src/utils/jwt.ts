import jwt from "jsonwebtoken";

export const generateToken = (payload: object, expiresIn: string = "1h") => {
    return jwt.sign(payload, process.env.SECRET_JWT_KEY || "", { expiresIn });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.SECRET_JWT_KEY || "");
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};
