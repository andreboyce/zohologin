# zohologin

This script will login to a list of zoho accounts stored in an sqlite .db file inorder to prevent them from becoming inactive.

Use sqlitebrowser to edit .db files
https://download.sqlitebrowser.org/

##########################################################
run these commands
##########################################################

npm install # download libraries

node main.js # run program its set to use test data, live data redacted zohologin\data\accounts.db

npm run m1c # SQLLiteManager test
npm run m2c # ZohoLogin test
npm run testc # should run both m1c and m2c

##########################################################


