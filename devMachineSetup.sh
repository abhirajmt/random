#!/bin/sh

yarn

# yarn global add hotel@0.8.6

hotel stop
hotel start

networksetup -setautoproxyurl "Wi-Fi" "http://localhost:2000/proxy.pac"
# Turn Wifi Off and On, if not running this script for the first time

#change this to admin.* for admin side features
hotel add "node start_proxy.js" --name "*.sc.mindtickle" --port 3403 -o proxy.log
hotel add "yarn start" --name "sc-script-ui" --port 3402

hotel stop
hotel start