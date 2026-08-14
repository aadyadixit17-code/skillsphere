const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: '436233883622-b8a32dimhneboo86riienf034jropv0m.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:5000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            done(null, user);
          } else {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(16).toString('hex'),
              role: 'Client',
              isVerified: true,
            });
            done(null, user);
          }
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};