# Squirrel.AWS
Implements the server side of the Squirrel client frameworks using Lambda, API Gateway, and S3

** This operates under the assumption that files are in a S3 bucket in the format of <filename>-x.y.z.zip where x.y.z is a semantic version number.

The code is all contained in index.js without any external dependencies to simplify deployment

# Releasing Service

Update zip files should be in S3 with permissions that everyone can download it.  When using the cli to copy the zip to s3, ```--acl public-read``` flag should be used.

## Manually
1) Manually deploy index.js as a lambda function
2) Set the following environment variables for the lambda function
   S3_BUCKET - The s3 bucket the updates are in
   S3_PREFIX - (optional) the prefix to the update file name
2) Create an s3 bucket, set the following environment variables
3) Setup an API gateway method with a the integration request setup for "Use Lambda Proxy integration"
4) (optional but recommended) Setup a cloudfront distro and route53 to give your update url a 'known' path


# Running Locally
~~~ node testHarness.js ~~~ will start a localhost server to work with
