let express = require('express'),
    app = express(),
    port = process.env.PORT || 5000;
app.set('views', './public/views');
app.set('view engine', 'pug');

/**
 * Use static files
 */
app.use(express.static('./public'));

app.get('/', function (req, res) {
    res.send("hello World");
});

app.get('/pug', function (req, res) {
    res.render('index');
});

app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log('Running server on ' + port);
});
