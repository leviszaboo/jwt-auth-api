#!/usr/bin/env bash
# scripts/push.sh

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region)

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

images=(postgres gator-app-nginx gator-app-node-app)

for image in "${images[@]}" 
do
  docker tag $image $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/gator-app:$image
  docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/gator-app:$image
done