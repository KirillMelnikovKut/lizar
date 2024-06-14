import jwt from 'jsonwebtoken';
import UserSchema from "../models/user.js";

export default async (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {

            let role = "User"

            if (req.query._id) {
                const user = await UserSchema.findById(req.query._id);

                if (user) {
                    role = user.role;
                }
            }

            const decode = jwt.verify(token, role !== "Admin" ? process.env.JWT_KEY : process.env.JWT_ADMIN_KEY);

            req.userId = decode._id;

            if (req.query._id && req.userId !== req.query._id) {
                return res.status(403).json({
                    message: 'Нет доступа',
                });
            }

            next();
        } catch (err) {
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
    } else {
        return res.status(403).json({
            message: "Нет доступа",
        })
    }

}