# Entertainment Engine

Eduardo Gonzalez, Leah Levin, Sherie Pan, Jeffrey Xiao

Deployed at: https://entertainment-engine.herokuapp.com/

- Note that long queries which take > 30 seconds to return will timeout on Heroku's free tier. To avoid this, please run the local version.

To run locally, run the following commands (this will start the backend server and the frontend client):

```bash
npm run install-all; # this will install the packages for both the backend (root) and the frontend (client)
npm start; # this will start the backend server

# ON A SEPARATE TERMINAL WINDOW
cd client; # go to the frontend directory
npm start; # start the frontend server
```

**IMPORTANT**: you must have the correct details in the `.env` file in the root directory as well as the `client/.env` file. If you do not have the `.env` files, contact any of us for the details.
