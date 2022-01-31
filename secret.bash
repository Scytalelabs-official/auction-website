#!/bin/bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=$1
kubectl create secret generic mysql-root-password-secret --from-literal=MYSQL_ROOT_PASSWORD=$1
kubectl create secret generic email-secret --from-literal=EMAIL=$1
kubectl create secret generic email-password-secret --from-literal=EMAIL_PASSWORD=$1
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=$1
kubectl create secret generic cloudinary-api-key-secret --from-literal=CLOUDINARY_API_KEY='432183885194623'
kubectl create secret generic cloudinary-cloud-name-secret --from-literal=CLOUDINARY_CLOUD_NAME='scytalelabs'
kubectl create secret generic cloudinary-api-secret-secret --from-literal=CLOUDINARY_API_SECRET='mZAxNn0YNm7YxPOMAvrBP0UIUfU'



