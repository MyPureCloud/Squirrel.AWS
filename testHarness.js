var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var lambda = require('./index');

app.use(bodyParser.json())

app.route('*').all(function (req, res) {

    var apiRequest = {
        "path": req.path,
        "httpMethod": req.method,
        "queryStringParameters": req.query,
        "body": req.body
    }

    console.log(apiRequest);

    console.log(req.query);

    lambda.handler(apiRequest, null, function(error, success){
        if(error){
            console.log(error);
        }else{
            res.status(success.statusCode);
            res.send(success.body);
        }

    })



});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
