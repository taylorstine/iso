#!/usr/bin/env bash
if [ "$NODE_ENV" == "local" ]
then
    echo "Running local post install"
    bower install && bundle install
elif [ "$NODE_ENV" == "staging" ] || [ "$NODE_ENV" == "production" ]
then
    echo "Running $NODE_ENV post install"
    bower install && bundle install && grunt
else
    echo -e "\x1B[0;31mERROR: Invalid NODE_ENV set, must be 'local', 'production', or 'staging\x1B[0m"
fi
