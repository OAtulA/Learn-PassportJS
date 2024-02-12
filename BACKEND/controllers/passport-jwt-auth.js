let express = require("express")
let bcrypt = require("bcrypt")
let jwt = require('jsonwebtoken')
let passport = require('passport')
let User = require('../models/user-model')
let config = require('dotenv').config
let JwtStrategy = require('passport-jwt').Strategy
let ExtractJwt = require('passport-jwt').ExtractJwt

// import { verifyRoot } from './root-auth';

config({ path: '../../.env.local' });

const SECRET = process.env.SECRET || "KaddU";
const router = express.Router();

// const opts = { algorithm: 'HS516', httpOnly: true, secretOrKey: SECRET, jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), passReqToCallback: true };
// As the browser might not save the accessToken as the bearer token
const opts = {
  algorithm: "HS516",
  secretOrKey: SECRET,
  jwtFromRequest: (req) => req.cookies.accessToken,
  passReqToCallback: true,
};

let secretKey = SECRET;

let ResForFreshAccessKeys;
// This will be used to send fresh access tokens if the access tokens expire.

passport.serializeUser((user, done) => {
  console.log('Serialize called')
  done(null, user)
})

passport.deserializeUser((user, done) => {
  console.log('deserialize called')
  done(null, user)
})

function signToken(user) {
  // Generate JWT tokens with expiration time of 3 hours for access token and 1 week for refresh token (in seconds)
  let accessExpireTime = Math.floor(Date.now() / 1000) + (60 * 60 * 3); // 3 hours in seconds
  let refreshExpireTime = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7); // 1 week in seconds

  try {
    const accessToken = jwt.sign({ id: user._id, exp: accessExpireTime }, secretKey);
    const refreshToken = jwt.sign({ id: user._id, exp: refreshExpireTime }, secretKey);

    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
  }
}
/*
const passportJwtStrategy = new JwtStrategy(opts, async (req, jwt_payload, done) => {
  try {

    // DEBUG
    console.log()
    console.log("Here the jwt payload is: ", jwt_payload)
    console.log()

    const user = await User.findById(jwt_payload.id);

    if (!user) {
      return done(null, false);
    }

    const currentTime = Date.now() / 1000;

    // Check if the JWT token has expired
    // so imagine like 2pm less than 3pm
    if (jwt_payload.Expires < currentTime) {
      // Check if the refresh token is present and valid
      // @ts-ignore

      //DEBUG
      console.log()
      console.log( "jwt_payload.Expires < currentTime:", jwt_payload.Expires < currentTime)
      console.log()

      //DEBUG
      console.log()
      console.log("Request is: ", req)      
      // fs.writeFile( path.resolve(__dirname, "../../Thoughts/requestRecieved.txt"),`Request is :\n $(req)`)
      console.log()

      const refreshToken = req.cookies.refreshToken;
      // check refreshToken.
      console.log()
      console.log("RefreshTOken is: ", refreshToken)
      console.log()
      if (refreshToken && refreshToken.Expires < currentTime) {
        // @ts-ignore
        
        try {
          // const userFromRefreshToken = jwt.verify(refreshToken, secretKey);
          // const newAccessToken = jwt.sign({ id userFromRefreshToken.id }, secretKey, { expiresIn '3h' });
          // res.set('Authorization', `Bearer ${newAccessToken}`);
          // @ts-ignore
          const [accessToken, refreshToken] = signToken(user)

          res = ResForFreshAccessKeys;
          //@ts-ignore
          res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
          //@ts-ignore
          res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });

          // Since the value is no longer needed.
          ResForFreshAccessKeys=null;
        } catch (err) {
          return done(null, false);
        }
      } else {
        return done(null, false);
      }
    }

    return done(null, user);
  } catch (error) {
    console.log(error);
    return done(error, false);
  }
})
*/

const checkValidRefreshToken= async (err, decoded) => {
  if (err) {
    // Refresh token verification failed
    return done(null, false);
  } else {
    const refreshToken = decoded;
    // refresh token still valid
    if (refreshToken && refreshToken.exp > currentTime) {            
      try {              
        let user = await User.findById(refreshToken.id);
        if (!user) {
          return (null, false);
        }
        const [accessToken, refreshToken] = signToken(user)

        res = ResForFreshAccessKeys;              
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });              
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });

        res.send("New acess Key and refresh key granted");
        // Since the value is no longer needed.
        ResForFreshAccessKeys = null;
        return done(null, user)
      } catch (err) {
        return done(null, false);
      }
    } else {
      return done(null, false);
    }
  }
}

const passportJwtStrategy = new JwtStrategy(opts, async (req, jwt_payload, done) => {
  try {
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if the  access token has expired
    if (jwt_payload.exp < currentTime) {
      // Access token has expired, check the refresh token
      const refreshTokenCookie = req.cookies.refreshToken;

      if (!refreshTokenCookie) {
        // No refreshToken cookie found in the request
        return done(null, false);
      }
      jwt.verify(refreshTokenCookie, secretKey, checkValidRefreshToken);
    } else {
      // Access token is still valid
      // Find the user based on the decoded payload
      const user = await User.findById(jwt_payload.id);
      if (!user) {
        return done(null, false);
      }

      // JWT token is valid, proceed with user authentication
      return done(null, user);
    }
  } catch (error) {
    console.log(error);
    return done(error, false);
  }
});

passport.use(passportJwtStrategy);
passport.initialize()

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token with expiration time of 1 month (in seconds)
    // const token = jwt.sign({ id newUser._id, Expires Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) }, SECRET);
    const [accessToken, refreshToken] = signToken(newUser);

    res.status(201).json({ success: true, message: 'User created successfully' });

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login Route with JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed, email not found' });
    }

    // Check password
    // @ts-ignore
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      // the user might have sign in with Google initially.
      if (!user.googleId) {
        return res.status(401).json({ message: 'Authentication failed, Try sign in with google' });
      }

      return res.status(401).json({ message: 'Authentication failed, wrong password' });
    }

    // Generate JWT token with expiration time of 1 month (in seconds)
    // jwt.sign({ id user._id, exp Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) }, SECRET);
    //@ts-ignore
    const { accessToken, refreshToken } = signToken(user);

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Middleware for protected routes
// @ts-ignore
const authenticateJWT = (req, res, next) => {
  // @ts-ignore
  ResForFreshAccessKeys = res;
  passport.authenticate('jwt', { session: false, passReqToCallback: true }, (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server Error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
}

const authenticateRootOrJWT = async (req, res, next) => {
  try {
    await authenticateJWT(req, res, () => { });
  } catch (err) {
    try {
      await verifyRoot(req, res, () => { });
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
  next();
};
// export default router;
module.exports = router;
module.exports.authenticateJWT = authenticateJWT;
module.exports.signToken = signToken;
// export {  authenticateJWT, signToken, authenticateRootOrJWT };