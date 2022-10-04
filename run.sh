#!/bin/sh

echo "starting API"

cd api
npm start  &

echo "starting Angular Client"

cd ../client
ng serve --host 0.0.0.0

echo "done"