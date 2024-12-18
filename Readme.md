To run the website:

open a terminal in ./
->php -s localhost:8000

then ctr + click on the output url in the terminal, this will take you to the instance running on the browser connected to php

Also, you will have to login using your mysql credentials and execute the notes.sql mysql script in order to initialize the databse, then make sure to USE those credentials where you need in the php script, just look for the username and password wherever used in the php heads and update them
