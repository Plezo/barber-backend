# Barbershop Appointment Backend

This will server as our api for the the website to interact with our database from

## MongoDB

Create an account here and use the free plan to start a database
https://www.mongodb.com/

Make sure to create a .env file and put ```DB_CONNECTION=<URI that MongoDB gave>```

Make sure to npm install as well to download all the packages

## TODO
- Finish GetAllTimes() function and add a formatting of results to get a list of intervals in 1 hour time blocks (will eventually move entire function to frontend)
- Test if the GetAllTimes() function works with 30 min intervals instead of hour
- Output to console every time a post happens
- Generate next ID for every post request (decide whether we wanna do it on front or back end, im skewing towards backend)