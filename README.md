# Full Stack Password Management System
Tech Stacks: React, Node & Express, JavaScript, MongoDB



## 1. Front-end: Create the React App

1.1 Create the repo on Github (without Readme)

1.2 Initilize the React app:

`npm create vite@latest` 

choose the app name; and package name

`npm install`

cd into the package directory

`npm run dev` (vite)  // Render the webpage on localhost

1.3 Link the local repo to the remote origin
`git init`
`git remote add origin https://github.com/yourusername/your-repo-name.git`
`git add .`
`git commit -m "commit message"`
`git push -u origin main`

1.4 Working on the front end logic

## 



## 2. Backend: Create the server logic && Configure the DB on MongoDB Altas
`npm run start` (node server.cjs   node server.js) to render the server locally

#### 2.1 Create a server.cjs file 
Basic get/put/ methods are defined;

Add ` "start": "node server.cjs" ` in package.json to enable the `npm run start` command; 
Modify vite.config.js file to add the server target

Make sure all dependencies are added (express., etc);

Run `npm run start` to render the server locally to check if the server is up and running; 

![Alt text](image-3.png)


### After refactoring:
`npm install` in backend dir and frontend dir
in backend dir: `npm run dev` 
in frontend dir: `npm run dev` 
Alternatively, in root dir, run `npm run dev` to concurrently start the server and render the front end!


Minimic deployment locally:
in root dir: `npm install` `npm run build` `npm run dev`



#### 2.2 Create a DB instance on MongoDB Altas (No need to pre-set the schema when creating the DB & the table will be automatically created once we insert a new record to the DB; If we want to change the schema in the code, then we need to delete the table in db to re-generate a new one)
Create a project in MongoDB Altas firstly (One project can only have one free tier db); 

Create a deployment/cluster/database instance in the project 
![Alt text](image.png)

Create a db user (admin/xianer123)

Connect to the DB
![Alt text](image-1.png)

![Alt text](image-2.png)

connect url = mongodb+srv://admin:xianer123@password-management-sys.cacpwcb.mongodb.net/?retryWrites=true&w=majority&appName=Password-Management-System-DB


Add mongodb and mongorose dependencies in the package.json
`"mongodb": "^6.5.0"`
`"mongoose": "^8.3.1"`

Once the database is created and the connect point is configured; Add the DB connection in the server.cjs



#### 2.4 Develop APIs and test them on Postman/REST
PasswordSchema - Sample Data
![Alt text](image-4.png)

UserSchema - Sample Data
![Alt text](image-5.png)


#### 2.5 Call APIs in Front End


## 3. Deploy the Web Application to make it LIVE!! 
Render
