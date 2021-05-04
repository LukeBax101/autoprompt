#!/usr/bin/env bash

npm i
rm dist -rf
npm run buildProd
docker-compose -f auttoprompt-compose.yml down
docker-compose -f autoprompt-compose.yml up --build -d
