#!/bin/bash

npm run watch &
php artisan serve --host=192.168.1.16 &
