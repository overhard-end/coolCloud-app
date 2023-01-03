const token = require('../utils/token');

function refreshToken(req, res) {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const user = token.checkRefreshToken(refreshToken);

  if (!user) return res.sendStatus(403);

  const newAccessToken = token.createAccessToken(user.email);
  if (newAccessToken) return res.status(201).json({ accessToken: newAccessToken });
}
module.exports = refreshToken;
