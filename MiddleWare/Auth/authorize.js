const jwt = require("jsonwebtoken");

const ADMIN = process.env.ADMIN_KEY;
const USER = process.env.USER_KEY;
const INSTRUCTOR = process.env.INSTRUCTOR_KEY;


const verifyRole = (roles) => (req, res, next) => {
    console.log("verify role")
    console.log(req.headers.authorization.split(' ')[0]);
    const token = req.headers.authorization && req.headers.authorization.split(' ')[0];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    let isValid = false;
    
    for (const role of roles) {
        const key = role == 'admin' ? ADMIN : role == 'student' ? USER : role == "faculty" ? INSTRUCTOR : "";

        try{
            decoded = jwt.verify(token, key);
            
            if (decoded && decoded.role == role) {
                req.user=decoded;
                isValid = true;
                break;
            }
        }
        catch(err){
            console.log(err);
        }
    }

    if (!isValid) {
        return res.status(401).json({ message: "Unauthorized: You are not authorized to access" });
    }

    next();

};


module.exports = verifyRole;