## Publish `portfolio-website` to AWS S3
### Pre-requisites
-   Install `aws-cli` - (Installing or updating the latest version of the AWS CLI)[https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html]
    -   RUN `which aws` to check if it's installed
    -   Run `aws --version` to check the version
- Authenticate with AWS
    -   Run `aws configure`
    -   Enter the AWS Access Key ID and Secret Access Key
    -   Enter the region name
    -   Enter the output format
- List all buckets
    -   Run `aws s3 ls`
- More AWS CLI S3 commands
    -   (AWS CLI S3 commands)[https://docs.aws.amazon.com/cli/latest/userguide/cli-services-s3-commands.html]


## IDEAS
-   if aws (prod) - set .env:
    -   DOMAIN=https://paulserban.eu/
-   if aws (stage) - set .env:
    -   DOMAIN=https://stage.paulserban.eu/
-  if aws (test) - set .env:
    -   DOMAIN=https://test.paulserban.eu/
-   id aws (develop) - set .env:
    -   DOMAIN=https://develop.paulserban.eu/

## NOTES
- before running `bash modulize.bash -e dev -p develop` RUN `bash modulize.bash -e dev -p build` sync content accordingly