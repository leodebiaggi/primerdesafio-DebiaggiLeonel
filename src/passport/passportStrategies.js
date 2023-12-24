import passport from 'passport'
import userModel from '../data/mongoDB/models/user.model.js'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { compareData } from '../bcrypt-helper.js'


//serializeUser
passport.serializeUser((usuario, done) => {
    done(null, usuario._id)
})

//deserializeUser
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})

//Local Strategy
passport.use('login', new LocalStrategy(
    async function (username, password, done) {
        try {
            const userDB = await userModel.findOne({ username: username });
            if (!userDB) {
                return done(null, false)
            }
            const isPasswordValid = await compareData(password, userDB.password)
            if (!isPasswordValid) {
                return done(null, false)
            }
            // Actualizar lastConnection
            userDB.lastConnection = new Date();
            await userDB.save();

            return done(null, userDB)
        } catch (error) {
            done(error)
        }
    }
))

// GitHub Strategy
passport.use('github', new GithubStrategy({
    clientID: 'Iv1.a5cda1cd82a3cb48',
    clientSecret: '59e4e004575dd49b37a1ab29f1f7bbbf0c7f928b',
    callbackURL: 'http://localhost:8080/api/session/githubcallback',
},
    async function (accesToken, refreshToken, profile, done) {
        try {
            // Validación existencia user en base
            const existingUser = await userModel.findOne({ username: profile.username });

            if (existingUser) {
                return done(null, existingUser);
            }

            // Creación nuevo usuario en base
            const newUser = {
                first_name: profile.displayName,
                last_name: profile.displayName,
                username: profile.username,
                password: ' ',
                fromGithub: true,
            };

            const result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
            done(error);
        }
    }
))

