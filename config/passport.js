const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt
const Connection = require("../getMysqlConnection")

module.exports = (passport) => {

    let opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.MYTOKENISJWTTOKEN
    }


    passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
        Connection.query(`SELECT * FROM member Where M_id = ${jwt_payload.id}`, (err, data) => {
            if (err) {
                return done(err, false)
            }
            if (data.length == 0) {
                return done(null, false)
            } else {

                return done(null, data)
            }
        })


    }))

}