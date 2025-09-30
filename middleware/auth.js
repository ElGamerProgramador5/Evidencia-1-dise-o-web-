const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (token == null) return res.sendStatus(401); // si no hay token, no autorizado

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // si el token no es válido, prohibido
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };
