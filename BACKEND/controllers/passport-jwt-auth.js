import express, { Router,Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User, {IUser} from '../../models/user-model';
import { config } from 'dotenv';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';


import { verifyRoot } from './root-auth';

config({ path: '../../.env.local' });

const SECRET  = process.env.SECRET  ;
const router  = express.Router();

const opts = { algorithm: 'HS516', httpOnly: true, secretOrKey: SECRET, jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() };

let secretKey  = SECRET;

function signToken(user ) {
  // Generate JWT tokens with expiration time of 3 hours for access token and 1 week for refresh token (in seconds)
  let accessExpireTime = Math.floor(Date.now() / 1000) + (60 * 60 * 3); // 3 hours in seconds
  let refreshExpireTime = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7); // 1 week in seconds

  try {
    const accessToken = jwt.sign({ id: user._id, Expires: accessExpireTime }, secretKey);
    const refreshToken = jwt.sign({ id: user._id, Expires: refreshExpireTime }, secretKey);

    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
  }
}

/*
function signToken(user) {
  // Generate JWT token with expiration time of 1 month (in seconds)
  let expireTime = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30)
  try {
    const token = jwt.sign({ id user._id, exp expireTime }, SECRET);

    return token;
  }
  catch(err){
    console.log(err);
  }
}
*/
/*
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);

    if (!user) {
      return done(null, false);
    }

    const currentTime = Date.now() / 1000;

    // Check if the JWT token has expired
    if (jwt_payload.exp < currentTime) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    console.log(error);
    return done(error, false);
  }
}));
*/

const passportJwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
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
      if (req.cookies.refreshToken) {
        // @ts-ignore
        const refreshToken = req.cookies.refreshToken;
        try {
          // const userFromRefreshToken = jwt.verify(refreshToken, secretKey);
          // const newAccessToken = jwt.sign({ id userFromRefreshToken.id }, secretKey, { expiresIn '3h' });
          // res.set('Authorization', `Bearer ${newAccessToken}`);
          // @ts-ignore
          const [accessToken, refreshToken] = signToken(user)
          //@ts-ignore
          res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
          //@ts-ignore
          res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });

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

passport.use(passportJwtStrategy);


// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, location, profilePic } = req.body;

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

    res.status(201).json({ message: 'User created successfully' });

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
    const [accessToken, refreshToken] = signToken(user); 

    res.status(201).json({ message: 'User created successfully' });

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Middleware for protected routes
// @ts-ignore
const authenticateJWT = (req , res , next) => {
  // @ts-ignore
  passport.authenticate('jwt', { session: false }, (err, userIUser, info) => {
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

const authenticateRootOrJWT = async (req , res  , next  ) => {
  try {
    await authenticateJWT(req, res, () => {});
  } catch (err) {
    try {
      await verifyRoot(req, res, () => {});
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
  next();
};
export default router;
export {  authenticateJWT, signToken, authenticateRootOrJWT };