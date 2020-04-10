const bcrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        global.db.findUserById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(
        (username, password, done) => {
            global.db.findUserByName(username, (err, user) => {
                if (err) { return done(err) }

                // usuário inexistente
                if (!user) { return done(null, false) }

                // comparando as senhas
                bcrypt.compare(password, user.password, (err, isValid) => {
                    if (err) { return done(err) }
                    if (!isValid) { return done(null, false) }
                    return done(null, user)
                })
                return done(null, user);
            })
        }
    ));
}