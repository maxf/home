# home
Home automation stuff

## Setting up

### Prerequisites

To run the server you need `npm`, `postgres`, `sass`

To run the camera modules, you have a choice: if you want to use PIR motion detection and the Raspi camera,
you can just run `monitor-with-pir.py` and the server will know where to find the files. Alternatively, in particular
if your GPIO is taken by the light switches module, you can
[use `motion` as a replacement](http://www.instructables.com/id/Raspberry-Pi-as-low-cost-HD-surveillance-camera/?ALLSTEPS)
(use the config file in the `misc` directory).

### Setting up the database

```
$ createuser -P --interactive home
Enter password for new role: home
Enter it again: home
Shall the new role be a superuser? (y/n) n
Shall the new role be allowed to create databases? (y/n) y
Shall the new role be allowed to create more new roles? (y/n) n

$ createdb -O home home

```
Edit the file called `server/config/models.js` and change `migrate: 'safe',` to `migrate: 'drop',`.

### Starting the server

```
$ clone git@github.com:maxf/home.git
$ cd server
$ npm install
```
Edit the file called `server/config/models.js` and change `migrate: 'safe',` to `migrate: 'drop',`.
```
$ node_modules/.bin/sails lift
```
After you've run `sails lift` for the first time, revert the file change above.
This is a bit of a hassle, but apparently purposeful so users won't accidentally delete their db.

Then visit [`visit http://localhost:1337`](visit http://localhost:1337)

### Starting motion

### Starting the light switches controller

## Important notes

1. I take no responsibility in the software not behaving as intended.
This is just me playing with my Raspberry Pi and experimenting the Sails framework.

2. There isn't a single test in this repo. That should give you a clue as to how safe it is
to use it to protect your home.


