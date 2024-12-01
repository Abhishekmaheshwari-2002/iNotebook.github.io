const jwt = require('jsonwebtoken');
const JWT_SEC = "Abhiisagood$boy"

const fetchuser = (req, res, next) => {
    //get the user from the jwt and add id to req object
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ errors: "use valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SEC);
        req.user = data.user;
        next();
    }
    catch (err) {
        res.status(401).send({ errors: "use valid token" });

    }
}


module.exports = fetchuser;