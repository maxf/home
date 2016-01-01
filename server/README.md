# server

a [Sails](http://sailsjs.org) application

## Database setup

```
sudo su - postgres
createuser -A -d -P home
createdb -O home home
```
To test:
```
psql home  -h 127.0.0.1 -d home
```