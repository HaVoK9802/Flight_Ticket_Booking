# Flight Ticket Booking


Features:-
Users:
Users can Sign Up, Log In, Search and Book available Flights, View their booking and cancel them

Admin:
Admin Users can Log In, Add or/and Remove flight data, and view all the bookings.

Authentication:
It uses Sessions and Cookies for authentication.

Technology Used:-
HTML,EJS templating engine, VueJS(imported as CDN), NodeJS(ExpressJS), PostgreSQL.

Installation:-
Git clone this repo, and then give the commands "cd server", "npm install". Then create a config folder under /src.
This config file should contain two files, postgre.json(to hold the postgreSQL server credentials) and 
sessionConfig.json(to strore the session and cookie congiguration). NOTE: Your infrastructure requires a postgreSQL database.
Use the "nodemon src/app.js" under the pwd to get going.








