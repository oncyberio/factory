import jwt from "jsonwebtoken";

export function auth(req, res) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.body.token, process.env.SECRET_JWT_KEY, function(err, decoded) {
            if (err) { 
                reject("Failed to authenticate token."); 
            } else {
                return resolve(decoded.user);
            };
        });
    })
}