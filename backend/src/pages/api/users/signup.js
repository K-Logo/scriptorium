import User from '@/model/user';
import { addUser } from '@/service/usersDb';
const bcrypt = require('bcrypt');

// accepts something@something.com, and in particular, prevents multiple @ signs.
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    );
};

/**
 * Accepts:
 * xxxxxxxxxx
 * xxx-xxx-xxxx
 * (xxx) xxx-xxxx 
 * ... or any 10-digits of any format
 */
const validateAndParsePhoneNumber = (phoneNumber) => {
  var targ = phoneNumber.replace(/[^\d]/g,''); // remove all non-digits
  if (targ && targ.length===10) {           // phone numbers are 10 digits long
    return targ;
  }
  return null;
}

/**
 * Valid passwords have one uppercase, one lowercase, one digit, one special character, and length >= 8
 */
const validatePassword = (password) => {
  return /[A-Z]/       .test(password) &&
          /[a-z]/       .test(password) &&
          /[0-9]/       .test(password) &&
          /[^A-Za-z0-9]/.test(password) &&
          password.length > 7;
}

/*
* Accepts bodies with *mandatory* username, password, firstName, lastName, email and phoneNumber fields.
* The user may upload an avatar after signing up, in the edit profile flow.
*/
export default async function signup(req, res) {
  if (req.method === "POST") {
    const { username, password, firstName, lastName, email, phoneNumber } = req.body;
    console.log(req.body);
    
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Phone Number:', phoneNumber);
    console.log('Password:', password); // Be cautious about logging sensitive data like passwords!
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Please specify a proper email format." });
    }

    const parsedPhoneNumber = validateAndParsePhoneNumber(phoneNumber);  // returns null if validation failed
    if (!parsedPhoneNumber) {
      return res.status(400).json({ error: "Please specify a 10-digit phone number." });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: "Please ensure your password has one uppercase, one lowercase, one digit,"
      +" one special character, and is at least 8 characters long."});
    }

    const passwordHash = await bcrypt.hash(password, parseInt(process.env.SALTROUNDS));
    const user = new User(null, username, passwordHash, firstName, lastName, email, parsedPhoneNumber,
       "localhost:3000/avatars/amongus.jpg", "USER");
    try {
      await addUser(user);
      return res.status(201).json({ message: "Sign up successful. Please log in!" });  // .json() required; else, next will hang. 201 ==> successful creation. info in JWT on login
    } catch (e) {
      return res.status(409).json({ error: "Username, email or phone number already taken." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." })
  }
}
