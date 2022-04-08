const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const AppleStrategy = require("passport-apple");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");

const { v5: uuidv5 } = require("uuid");
const { models } = require("../models");

require("dotenv").config();

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          // Generate uuid from username (email)
          const uuid = uuidv5(username, process.env.UUID_NAMESPACE);

          // Check if user exists
          let user = await models.User.findOne({ where: { uuid }, raw: true });

          if (!user) {
            return done("Incorrect email or password");
          }

          // Validate password
          const passwordValidated = await bcrypt.compare(
            password,
            user.password
          );

          if (!passwordValidated) {
            return done("Incorrect email or password");
          }

          // Return uuid and username
          user = { uuid: user.uuid, username: user.username };
          done(null, user);
        } catch (error) {
          done("Could not sign in with email");
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/auth/google/callback`,
        profileFields: ["displayName", "emails"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Generate uuid from Google id
          const { sub, name, email } = profile._json;
          const uuid = uuidv5(sub, process.env.UUID_NAMESPACE);

          // Create user if they do not exist
          let user = await models.User.findOne({ where: { uuid }, raw: true });

          if (!user) {
            user = await models.User.create({
              uuid,
              email,
              username: name,
              source: "google",
            });
            user = user.get({ plain: true });
          }

          // Return uuid and username
          user = { uuid: user.uuid, username: user.username };
          done(null, user);
        } catch (error) {
          done("Could not sign in with Google");
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/auth/facebook/callback`,
        profileFields: ["displayName", "emails"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Generate uuid from Facebook id
          const { id, name, email } = profile._json;
          const uuid = uuidv5(id, process.env.UUID_NAMESPACE);

          // Create user if they do not exist
          let user = await models.User.findOne({ where: { uuid }, raw: true });

          if (!user) {
            user = await models.User.create({
              uuid,
              email,
              username: name,
              source: "facebook",
            });
            user = user.get({ plain: true });
          }

          // Return uuid and username
          user = { uuid: user.uuid, username: user.username };
          done(null, user);
        } catch (error) {
          done("Could not sign in with Facebook");
        }
      }
    )
  );

  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyLocation: path.join(__dirname, "./AuthKey_Q9XZGWBTAC.p8"),
        callbackURL: `${process.env.API_URL}/auth/apple/callback`,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, idToken, profile, done) => {
        try {
          // Decode Apple token
          profile = jwt.decode(idToken);

          // Generate uuid from Apple id
          const { sub, email } = profile;
          const username = "apple name"; // TODO: get name from Apple
          const uuid = uuidv5(sub, process.env.UUID_NAMESPACE);

          // Create user if they do not exist
          let user = await models.User.findOne({ where: { uuid }, raw: true });

          if (!user) {
            user = await models.User.create({
              uuid,
              email,
              username,
              source: "apple",
            });
            user = user.get({ plain: true });
          }

          // Return uuid and username
          user = { uuid: user.uuid, username: user.username };
          done(null, user);
        } catch (error) {
          done("Could not sign in with Apple");
        }
      }
    )
  );
};
