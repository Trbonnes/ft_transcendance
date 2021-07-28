#!/bin/bash


if [[ $# != 4 ]]
then
  echo "Usage : ./adduser.sh [email] [password] [name] [true|false]"
  exit 1
fi

body='{"email":"'$1'","password":"'$2'","name":"'$3'","isAdministrator":"'$4'"}'
echo $body

echo "Inserting a new user"
curl localhost:3000/users/create -H "Content-Type: Application/json" --data $body
if [[ $? != 0 ]]
then
  echo "An error has occurred you absolute buffoon"
fi
