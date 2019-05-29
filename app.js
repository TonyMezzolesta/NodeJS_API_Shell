/**
 * To get started install
 * express bodyparser jsonwebtoken express-jwt
 * via npm
 * command :-
 * npm install express bodyparser jsonwebtoken express-jwt --save
 */

// Bringing all the dependencies in
const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./configSettings');


// Instantiating the express app
const app = express();

// See the react auth blog in which cors is required for access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

// Setting up bodyParser to use json and set it to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Starting the app on PORT 8000
const PORT = 8000;

// Error handling 
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});

require('./routes')(app, dbConfig);

app.listen(PORT, () => {
    // const host = server.address().address;
    // const port = server.address().port;

    // eslint-disable-next-line
    console.log(`Listening on port ${PORT}`);
    console.log('dbConfig: ' + dbConfig.mongoConn);
});             
