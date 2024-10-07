const jwt = require('jsonwebtoken')

export function getJWT(user, expiryInMinutes) {
  console.log(user.username);
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
export function verifyAndDecodeJWT(token, userId) {
  const decodedJWT = jwt.verify(token, process.env.SECRET_KEY);
  if (!decodedJWT || decodedJWT.id != userId) {
    return null;
  }
  return decodedJWT;
}