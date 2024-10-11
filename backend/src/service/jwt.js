const jwt = require('jsonwebtoken')

export function getJWT(user, expiryInMinutes) {
  const userForJWT = {
    id: user.db_id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role
  }

  return jwt.sign(userForJWT, process.env.SECRET_KEY, { expiresIn: expiryInMinutes*60 });
}

// returns null if the token is not valid; otherwise, returns the decoded token
export function verifyAndDecodeJWT(req, userId) {
  const token = getTokenFromReq(req);
  const decodedJWT = jwt.verify(token, process.env.SECRET_KEY);
  if (!decodedJWT || decodedJWT.id != userId) {
    return null;
  }
  return decodedJWT;
}

// helper. retrieves token from Authorization header
function getTokenFromReq(req) {
  const authorization = req.headers['authorization'];
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
}
