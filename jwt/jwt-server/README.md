# jwt-server

//TODO
expiration of the token
management of the activeness of the user

Mongodb

* open cmd window 
* copy paste the following command line

"c:\program files\MongoDB 2.6 Standard\bin\mongod" --dbpath C:\Dev\pluralsight\jwt\jwt-server\mongodb --repair
"c:\program files\MongoDB 2.6 Standard\bin\mongod" --dbpath C:\Dev\pluralsight\jwt\jwt-server\mongodb

MongoDB commands lines:


"c:\program files\MongoDB 2.6 Standard\bin\mongo"  //Start the mongo console

show dbs   //shows the database avaialable

use psJWT // switch to the good database

db.users.find()  // list documents of the users collection

db.users.remove({}); // remove all the documents in the collection users  



Format email using zurb.inliner