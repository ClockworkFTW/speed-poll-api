const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const AppleStrategy = require("passport-apple");

const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config();

module.exports = (passport) => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      const token = jwt.sign({ username, password }, process.env.JWT_SECRET);
      done(null, token);
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        const token = jwt.sign(profile, process.env.JWT_SECRET);
        done(null, token);
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        const token = jwt.sign(profile, process.env.JWT_SECRET);
        done(null, token);
      }
    )
  );

  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID,
        callbackURL: process.env.APPLE_CALLBACK_URL,
        passReqToCallback: true,
        privateKeyLocation: path.join(
          __dirname,
          process.env.APPLE_PRIVATE_KEY_LOCATION
        ),
      },
      (req, accessToken, refreshToken, idToken, profile, done) => {
        profile = jwt.decode(idToken);
        const token = jwt.sign(profile, process.env.JWT_SECRET);
        done(null, token);
      }
    )
  );
};
