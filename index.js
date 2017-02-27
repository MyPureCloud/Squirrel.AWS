var AWS = require('aws-sdk');
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

function compareSemVar(a,b){

    function cmp(a,b){
       if (parseInt(b) > parseInt(a)) return 1;
       else if (parseInt(b) < parseInt(a)) return -1;
       else return 0;
    }

    var aArr = a.split('.');
    var bArr = b.split('.');

    if(aArr[0] !== bArr[0]){
        return cmp(aArr[0],bArr[0]);
    }

    if(aArr.length > 1 &&  bArr.length > 1){
        if(aArr[1] !== bArr[1]){
            return cmp(aArr[1],bArr[1]);
        }
    }

    if(aArr.length > 2 &&  bArr.length > 2){
        if(aArr[2] !== bArr[2]){
            return cmp(aArr[2],bArr[2]);
        }
    }


    if(aArr.length > 3 &&  bArr.length > 3){
        if(aArr[3] !== bArr[3]){
            return cmp(aArr[3],bArr[3]);
        }
    }

    return 0;

}

exports.handler = function(event, context, callback) {
    console.log("GOOO");

    var params = {
      Bucket: process.env.S3_BUCKET
    };

    if(typeof process.env.S3_PREFIX !== "undefined" && process.env.S3_PREFIX !== null && process.env.S3_PREFIX.length > 0 ){
        params.Prefix = process.env.S3_PREFIX;
    }

    params = {
     Bucket: process.env.S3_BUCKET
   };

    params.Prefix = process.env.S3_PREFIX;

    var latestVersion = '0.0.0';
    var latestKey = '';

    s3.listObjectsV2(params, function(err, data) {
      if (err){
        console.log(err, err.stack); // an error occurred
      }
      else {
          data.Contents.forEach((file)=>{
              console.log("checking file " + file.Key);

                var match = /((\d+\.?)+)\.zip/g.exec(file.Key);

                if(match){
                    var version = match[1];

                    if(compareSemVar(version,latestVersion) < 0){
                        latestVersion = version;
                        latestKey = file.Key;
                    }
                }
          });

          console.log("Latest version " + latestVersion);

          var requestedVersion = event.queryStringParameters.v;
          console.log(`current running version ${requestedVersion}`);
          console.log(compareSemVar(requestedVersion, latestVersion) );
          if(compareSemVar(requestedVersion, latestVersion) > 0){
              var latestUrl = `https://s3.amazonaws.com/${process.env.S3_BUCKET}/${latestKey}`
              console.log(latestUrl);
              callback(null, {
                  "statusCode": 200,
                  "body": JSON.stringify( {
                       "url": latestUrl
                   })
              });
          }else{
              callback(null, {
                  "statusCode": 204, //or 202 with new version,
                  "body": ""
              });

          }
      }
    });

    var response = {
        "statusCode": 204, //or 202 with new version,
        "body": ""
    }


};
