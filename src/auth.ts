import { Application } from 'express';
import { Strategy as LocalStrategy } from 'passport-local';

import * as passport from 'passport';
import * as bcrypt from 'bcrypt';

import { UserProfileModel } from './models';

export class Authentication {
  init(express: Application) {
    express.use(passport.initialize());
    express.use(passport.session());

    passport.use(
      new LocalStrategy((username, password, done) => {
        this.authenticate(username, password)
          .then(user => {
            done(null, user);
          })
          .catch(error => {
            done(error, false);
          });
      })
    );

    passport.serializeUser((user, done) => {
      return done(null, user);
    });

    passport.deserializeUser((user, done) => {
      return done(null, user);
    });
  }

  private authenticate(username: string, password: string): Promise<boolean> {
    return UserProfileModel.findOne({ where: { username } }).then(user => {
      return bcrypt.compare(password, user.password);
    });
  }
}

export default new Authentication();
