const Token = require('../utils/token');
const refreshKey = process.env.JWT_RESRESH_TOKEN_KEY;

function refreshToken(req, res) {
  const token = req.body.refreshToken;
  if (!token) return res.sendStatus(400);

  const user = Token.checkToken(token, refreshKey);

  if (!user) return res.sendStatus(403);

  const newAccessToken = Token.createAccessToken(user.email);
  if (newAccessToken) return res.status(201).json({ accessToken: newAccessToken });
}
module.exports = refreshToken;
