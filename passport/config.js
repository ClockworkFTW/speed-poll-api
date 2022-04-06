const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const AppleStrategy = require("passport-apple");

const jwt = require("jsonwebtoken");
const path = require("path");

const { v5: uuidv5 } = require("uuid");
const { models } = require("../models");

require("dotenv").config();

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        // Generate uuid from username (email)
        const uuid = uuidv5(username, process.env.UUID_NAMESPACE);

        // Check if user exists
        const user = await models.User.findOne({ where: { uuid } });

        if (!user) {
          return done("Incorrect email or password.");
        }

        // TODO: validate password

        // Generate user token and attach to req
        const token = jwt.sign(user.uuid, process.env.JWT_SECRET);
        done(null, token);
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
        // Generate uuid from Google id
        const { sub, name, email } = profile._json;
        const uuid = uuidv5(sub, process.env.UUID_NAMESPACE);

        // Create user if they do not exist
        const user = await models.User.findOne({ where: { uuid } });

        if (!user) {
          await models.User.create({ uuid, email, username: name });
        }

        // Generate user token and attach to req
        const token = jwt.sign(uuid, process.env.JWT_SECRET);
        done(null, token);
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
        // Generate uuid from Facebook id
        const { id, name, email } = profile._json;
        const uuid = uuidv5(id, process.env.UUID_NAMESPACE);

        // Create user if they do not exist
        const user = await models.User.findOne({ where: { uuid } });

        if (!user) {
          await models.User.create({ uuid, email, username: name });
        }

        // Generate user token and attach to req
        const token = jwt.sign(uuid, process.env.JWT_SECRET);
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
        privateKeyLocation: path.join(__dirname, "./AuthKey_Q9XZGWBTAC.p8"),
        callbackURL: `${process.env.API_URL}/auth/apple/callback`,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, idToken, profile, done) => {
        // Decode Apple token
        profile = jwt.decode(idToken);

        // Generate uuid from Apple id
        const { sub, email } = profile;
        const uuid = uuidv5(sub, process.env.UUID_NAMESPACE);

        // Create user if they do not exist
        const user = await models.User.findOne({ where: { uuid } });

        if (!user) {
          await models.User.create({ uuid, email, username: "apple username" });
        }

        // Generate user token and attach to req
        const token = jwt.sign(uuid, process.env.JWT_SECRET);
        done(null, token);
      }
    )
  );
};
