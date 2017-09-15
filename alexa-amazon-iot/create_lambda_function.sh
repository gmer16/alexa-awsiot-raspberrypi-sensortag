aws lambda create-function \
--region eu-west-1 \
--function-name <lambda function name> \
--zip-file fileb://skill/src/index.zip \
--role <arn of your basic lambda execution role> \
--handler index.handler \
--runtime nodejs6.10 \
--profile default \
--timeout 10 \
--memory-size 1024