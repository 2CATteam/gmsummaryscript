# Welcome to the GroupMe chat summary script!

To start, clone this repo onto your computer. In the root directory of the project, create two files, id.json and token.json. 

For token.json, first find your GroupMe token by going to dev.groupme.com and then clicking "Access Token" at the top right. Fill token.json with the following:

> { "token": "YOUR_TOKEN_HERE" )

DO NOT PUSH THIS FILE. It now contains your private token for accessing GroupMe, and with it, anyone can impersonate you, change your account info, read all your messages, etc.

Once this is done, run secondary.js. It should give you a list of all the groups you're a part of, along with their id. For the group you want to do a summary of, find its id and fill it into id.json so that it reads:

> { "id": "YOUR_ID_HERE" }

Now, you can run main.js - note that this operation will take some time, but you should soon see the number of messages each person has sent, how many likes they've gotten, and how many likes they've given out. Note that a name of "undefined" means the user has left the chat.