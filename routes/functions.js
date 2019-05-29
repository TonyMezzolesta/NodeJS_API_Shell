const MongoClient = require('mongodb').MongoClient;

module.exports = {
    FindUser: function(configSettings, req, callback){
        //get info from request body
        const { username, password } = req.body;

        //connect to mongo to find user
        const details = { 'username': username };

        //connect to mongo client
        MongoClient.connect(configSettings.mongoConn, { useNewUrlParser: true }, function(err, db) {
            if (err) {
                callback("Mongo Connect Error: " + err, null);
            } else {
                //retrieve user from collection
                var dbo = db.db("Wellness");
                dbo.collection("User").findOne(details, function(err, result) {
                    if (err) {
                        callback('An error has occurred retrieving user: ' + err, null);
                    } else {
                        callback(null, result);
                    }
                    //close connection
                    db.close();
                });
            }
        });
    },
    RegisterUser: function(configSettings, req, callback){
        //get info from request body
        const { username, password } = req.body;

        //connect to mongo to find user
        const details = { 'username': username };

        //create new user object
        const newUser = {
            username: username,
            password: password
        };

        //find user first
        this.FindUser(configSettings, req, function(err, result){
            if (err) {
                console.log("Find User Error: " + err);
                callback("Find User Error: " + err, null);
            } else if(result) {
                console.log("Results: " + result);
                callback(null, "User Exists ");
            } else {
                //connect to mongo client
                MongoClient.connect(configSettings.mongoConn, { useNewUrlParser: true }, function(err, db) {
                    if (err) {
                        console.log("Mongo Error: " + err);
                        callback("Mongo Connect Error: " + err, null);
                    } else {
                        //retrieve user from collection
                        var dbo = db.db("Wellness");
                        dbo.collection("User").insertOne(newUser, function(err, result) {
                            if (err) {
                                callback('An error has occurred inserting user: ' + err, null);
                            } else {
                                callback(null, result);
                            }
                            //close connection
                            db.close();
                        });
                    }
                });
            }

        });
        
    }
  };