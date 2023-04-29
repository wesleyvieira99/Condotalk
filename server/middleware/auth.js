import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {  //verifing that the token does not exist
            return res.status(403).send("Access Denied");
        }

        if (token.startsWith("Bearer ")) { //Getting the code of the token
            token = token.slice(7, token.length).trimLeft()
        }

        //Checking that the token that I get in the req is true using my JWT Secrets
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        //I can use this check at the whatever process that I want, for exemplo, checking the token before upload an image or login
        next()
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}