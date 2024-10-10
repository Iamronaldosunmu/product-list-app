import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import bcrypt from "bcrypt";
import { User, validateUser, validateUserLogin } from "../models/user.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
const localStrategy = passportLocal.Strategy;
const JWTstrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

dotenv.config();

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Use this if you are using Bearer token
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// This middleware saves the information provided by the user to the database,
// and then sends the user information to the next middleware if successful.
// Otherwise, it reports an error.
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
      session: false,
    },
    async (req, email, password, done) => {
      // Validate the data sent by the user
      const { error } = validateUser(req.body);
      if (error)
        return req.res.status(400).json({ message: error.details[0].message });

      // Check if the email exists in the database
      const user = await User.findOne({ email });
      if (user)
        return req.res
          .status(400)
          .json({ message: "This user already exists in the database" });
      else {
        // Extract the first and last name from the body
        const { first_name, last_name } = req.body;

        // Hash the password
        const saltRounds = 10;
        const hashed_password = await bcrypt.hash(password, saltRounds);

        // Store the new user in the database
        try {
          const user = await User.create({
            email,
            password: hashed_password,
            first_name,
            last_name,
          });
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    }
  )
);

// This middleware authenticates the user based on the email and password provided.
// If the user is found, it sends the user information to the next middleware.
// Otherwise, it reports an error.
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
      session: false,
    },
    async (req, email, password, done) => {
      // Validate the data sent by the user
      const { error } = validateUserLogin(req.body);
      if (error)
        return req.res.status(400).json({ message: error.details[0].message });

      try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
          return req.res
            .status(400)
            .json({ message: "Incorrect Username or Password" });
        }

        // Check if the password is correct
        const validate = await user.isValidPassword(password, user.password);
        if (!validate) {
          return req.res
            .status(400)
            .json({ message: "Incorrect Username or Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// This is the controller for signing a user up
export const createNewUser = (req, res) => {
  return res
    .status(201)
    .json({ message: "Sign up Successful!", user: req.user });
};

export const logUserIn = (req, res) => {
  const user = {
    _id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
  };
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.status(200).json({ message: req.message, token });
};