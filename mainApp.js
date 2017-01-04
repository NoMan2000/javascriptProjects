let mainApp = function () {
    const express = require('express'),
        app = express(),
        https = require('https'),
        port = process.env.PORT || 5000,
        securePort = process.env.SECURE_PORT || 4433,
        cookieParser = require('cookie-parser'),
        statusHandler = require('status-codes'),
        session = require('express-session'),
        bodyParser = require('body-parser'),
        passport = require('passport'),
        logger = require('morgan'),
        favicon = require('serve-favicon'),
        mongoose = require('connect-mongo'),
        pem = require('pem'),
        flash = require('connect-flash');

    let LocalStrategy = require('passport-local').Strategy;

    // Extract pug
    app.set('views', './public/views');
    app.set('view engine', 'pug');

    // Extract session
    app.use(cookieParser());

    app.use(session({
        secret: "Some Secret",
        resave: false,
        saveUninitialized: true
    }));

    app.use(bodyParser.urlencoded({extended: false}));

    passport.use(new LocalStrategy(
        (username, password, done) => {
            if (password !== 'password') {
                return done(null, false);
            }
            return done(null, {username: username});
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    let requireAuthentication = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/login');
    };

    app.use(passport.initialize());
    app.use(passport.session());

    /**
     * Create a self-signed key.  Note that this requires some additional setup because browsers block self-signed keys.
     */
    pem.createCertificate({days: 1, selfSigned: true}, (err, keys) => {
        if (err) {
            console.log(err);
            return null;
        }
        https.createServer({key: keys.serviceKey, cert: keys.certificate}, app).listen(securePort);
    });



    app.listen(port, (err) => {
        if (err) {
            throw err;
        }
        console.log('Running server on ' + port);
    });
    // Next is the next matching parameter
    let websessionAuth = (req, resp, next) => {
        if (resp.authenticated && next) {
            return next();
        }
        return resp.redirect('/');
    };

    app.get('/web', [websessionAuth, (req, resp, next) => {
        resp.render('web');
    }]);

    app.get('/pug/profile', [requireAuthentication, (req, res, next) => {
        res.render('profile');
    }]);



    app.post('/pug/login', passport.authenticate('local',
        {
            successRedirect: '/pug/profile',
            failureRedirect: '/pug/login',
            failureFlash: true
        }
    ));
    /**
     * Use static files
     * Since the static files are the last piece of the puzzle, we want it to avoid any
     * dynamic middleware.
     */
    app.use(express.static('./public'));
    app.use(express.static('./public/views'));

    /**
     * This defines an ErrorHandler for the application.
     */
    app.use((err, req, resp, next) => {
        let statusError = statusHandler[500]; // Generic server error
        console.log(err);
        resp.statusCode = statusError.status;
        resp.send(statusError.message);
        resp.end();
    });
};
module.exports = mainApp;
