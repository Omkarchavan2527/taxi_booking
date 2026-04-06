import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || 'your_client_id',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your_client_secret',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists based on email
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // If user exists but doesn't have a googleId linked yet, link it now
            if (!user.googleId) {
              user.googleId = profile.id;
              user.avatar = profile.photos[0].value;
              await user.save();
            }
            return done(null, user);
          }

          // If not, create a brand new user (Defaults to 'user' role)
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos[0].value,
            role: 'user', 
            isActive: true
          });

          done(null, user);
        } catch (error) {
          console.error(error);
          done(error, null);
        }
      }
    )
  );
};