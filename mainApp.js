let mainApp = function () {
    const express = require('express'),
        app = express(),
        port = process.env.PORT || 5000,
        cookieParser = require('cookie-parser'),
        statusHandler = require('status-codes'),
        session = require('express-session'),
        bodyParser = require('body-parser'),
        passport = require('passport'),
        logger = require('morgan'),
        favicon = require('serve-favicon'),
        mongoose = require('connect-mongo'),
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

    app.get('/pug', (req, resp) => {
        resp.render('index');
    });

    app.listen(port, (err) => {
        if (err) {
            throw err;
        }
        console.log('Running server on ' + port);
    });

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
        console.log(req.session);
        res.render('profile');
    }]);

    app.get('/login', (req, resp, login) => {
        resp.render('login');
    });

    app.get('/pug/login', (req, resp, next) => {
        resp.render('login');
    });

    app.post('/pug/login', passport.authenticate('local',
        {
            successRedirect: '/pug/profile',
            failureRedirect: '/pug/login',
            failureFlash: true
        }
    ));
    /** Will not run
     app.post('/pug/login', (req, resp, next) => {
    console.log(req.body);
    resp.render('login');
});
     **/

    /**
     * Use static files
     * Since the static files are the last piece of the puzzle, we want it to avoid any
     * dynamic middleware.
     */
    app.use(express.static('./public'));

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
