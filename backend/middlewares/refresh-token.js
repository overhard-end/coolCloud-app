const jwt = require('jsonwebtoken');
const { createAccessToken } = require('../utils/token');

function refreshToken(req, res, next) {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  if (refreshToken) {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      console.log(user);
      const newAccessToken = createAccessToken({ user: user.email });
      if (newAccessToken) return res.json({ accessToken: newAccessToken });
    });
  }
}
module.exports = refreshToken;
