module.exports = function(app, configSettings) {

    const exjwt = require('express-jwt');
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const Func = require('./functions');

    
    //verify jwt by using express-jwt and unlock with secret
    app.get('/', exjwt({secret: configSettings.info}), (req, res) => {
        //authenticate response
        res.send('Authenticated'); //Sending some response when authenticated
    });


    //login post route
    app.post('/login', (req, res) => {
        //get info from request body
        const { username, password } = req.body;

        //call mongo db function
        Func.FindUser(configSettings, req, function(err, result){
            if(err){
                console.log("error: " + err);
                res.status(501).json({
                    sucess: false,
                    token: null,
                    err: 'An error has occurred connecting: ' + err
                });
            } else {
                console.log("result: " + result);
                if(result){
                    //compare password
                    bcrypt.compare(password, result.password, function(err, resBcrypt){
                        if(resBcrypt) {
                            let token = jwt.sign({ id: result.id, username: result.username }, configSettings.info, { expiresIn: 129600 }); // Sigining the token
                            res.status(200).json({
                                sucess: true,
                                err: null,
                                token
                            });
                        } else {
                            res.status(401).json({
                                sucess: false,
                                token: null,
                                err: 'Password Invalid'
                            });
                        } 
                    });                        
                } else {
                    res.status(401).json({
                        sucess: false,
                        token: null,
                        err: 'User Not Found'
                    });
                }
            }        
        });
    });



    // Registry ROUTE
    app.post('/register', (req, res) => {
        const { username, password } = req.body;

        Func.RegisterUser(configSettings, req, function(err, result){
            if (err) {
                console.log("error: " + err);
                res.status(501).json({
                    sucess: false,
                    token: null,
                    err: 'An error has occurred connecting: ' + err
                });
            } else {
                if(result == "User Exists"){
                    res.status(401).json({
                        sucess: false,
                        token: null,
                        err: 'User Already Exists'
                    });
                } else {
                    let token = jwt.sign({ id: result.id, username: result.username }, configSettings.info, { expiresIn: 129600 }); // Sigining the token
                    res.status(200).json({
                        sucess: true,
                        err: null,
                        token
                    });
                }
            }
        });
    });

};