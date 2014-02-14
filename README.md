MyMmo
=====

Open Source HTML5 MMORPG Editor

Author : Camille Hougron

Installation Notice :
=====================

To try MyMmo, you need the following softwares on your computer :

MongoDB
NodeJS
a Web Server (for example : Apache)

Step 1 :
Place all the files in a folder, respecting the given hierarchy.

Step 2 :
Create a database called 'test' on MongoDB,
with a user called 'root' with password 'root'
(or you can change the previous credentials in the Server/Database.js and 
Server/dbInit.js files)

Step 3 :
Initialize the database. Go to the Server directory, then launch the 
initialization with the command "nodejs dbInit.js"

Step 4 :
Launch the server. Go to the Server directory, then launch it with the 
command "nodejs Server.js"


Step 4 :
Launch the www/test.html file in yout browser. It should Work.
You just have to put a name in the line to select or create a player.


Note that this tool is still in development. I'm currently rebuilding the editor
tools, so they are not available at the moment.
If you want to help, you are more than welcomed.


If you have issues with the nodejs modules, try reinstalling them with :
"npm install mongodb"
"npm install socket.io"

For any question, or suggestion, e-mail me at camille.hougron AT gmail.com
