# Notes Application

## Description
This is a simple Notes application built with Node.js, Express, and MongoDB. The application allows users to create, read, update, and delete notes.

## Features
- User authentication using JWT
- Password hashing using bcrypt
- CRUD operations for notes
- Axios for making HTTP requests

## Prerequisites
- Node.js and npm installed
- MongoDB Atlas account

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/notes-app.git
   cd notes-app

   
#Install dependencies:
npm install

#Create a .env file in the root directory and add your environment variables:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ncqp3vb.mongodb.net/UserDb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret


#API Endpoints
POST /register: Register a new user
POST /login: Authenticate a user and get a token
GET /users: Get all notes (authenticated)
GET /user/:id : Get all  notes with id  (authenticated)
GET /users/:userId/notes/:noteId : Get all notes with note id (authenticated)
POST /users/:userId/notes: Create a new note (authenticated)
PUT /users/:userId/notes/:noteId
: Update a note (authenticated)
DELETE /users/:userId/notes/:noteId
: Delete a note (authenticated)


#Technologies Used
Node.js: JavaScript runtime
Express: Web framework for Node.js
MongoDB: NoSQL database
Mongoose: ODM for MongoDB
JWT: JSON Web Tokens for authentication
bcryptjs: Password hashing
Axios: Promise-based HTTP client


##Deployment
#Backend Deployment on Render
Sign up or log in to Render.

Create a new Web Service:

Connect your GitHub repository.
Choose the repository for your notes application.
For the build and start commands, use:
bash
Copy code
Build Command: npm install
Start Command: npm start
Set up environment variables:

Go to the "Environment" tab in your Render service dashboard.
Add the following environment variables:
graphql
Copy code
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ncqp3vb.mongodb.net/UserDb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
Deploy the service and wait for Render to build and deploy your application.



#Frontend Deployment on Firebase
Install the Firebase CLI:

bash
Copy code
npm install -g firebase-tools
Log in to Firebase:

bash
Copy code
firebase login
Initialize Firebase in your project directory:

bash
Copy code
firebase init
Select "Hosting" when prompted.
Choose your existing Firebase project or create a new one.
Specify the build directory (or your frontend directory) as the public directory.
Choose y when asked to configure as a single-page app .
Choose n for setting up automatic builds and deploys with GitHub (if you want to set up continuous deployment, you can choose y).


bash
Copy code
npm run build
Deploy your application to Firebase:

My firebase Deploy link:- https://notes-542ee.web.app
