const jwt = require('jsonwebtoken');

function accessTokenCheck(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  const tokenSecret = process.env.JWT_ACCESS_TOKEN_KEY;
  jwt.verify(token, tokenSecret, (err, user) => {
    if (err) return res.status(403).json('you must be logged in');
    req.body = user;
    next();
  });
}
module.exports = accessTokenCheck;
