# Quizzie Rascal Quiz App Backend

This is the backend repository for the Quiz App project. The backend is built using Express.js framework, MongoDB for data storage using Mongoose as the ODM (Object-Document Mapping), and Nodemailer for implementing the reset password functionality.

## Prerequisites

Before running this application, make sure you have the following installed on your system:

- Node.js (v16 or above)
- MongoDB (v5 or above)

## Installation

1. Clone this repository to your local machine using the following command: git clone https://github.com/bobbybish81/quizzieRascal-quizApp-BE
2. Navigate to the project's directory:
3. Install the dependencies by running the following command: npm install
4. Create a `.env` file in the root directory and provide the necessary environment variables. For example:

  ACCESS_TOKEN='your-jwt-secret'
  REFRESH_TOKEN='your-jwt-secret'
  MONGO_USERNAME='your-mongodb-username'
  MONGO_PASSWORD='your-mongodb-password'
  MONGO_CLUSTER='your-mongodb-cluster'
  MONGO_DBNAME='your-mongodb-database-name'
  EMAIL_USER='your-email@gmail.com'
  EMAIL_PASS='your-email-password'

   Update the values with your desired configuration. The MONGO variables are included in a template literal that point to your MongoDB server.

5. Start the application: npm start
   The server will start running on `http://localhost:8080`.

## API Endpoints

The following API endpoints are available in the application:

- **User Routes:**

  - `GET /api/leaderboard` - Get the current leaderboard.
  - `POST /leaderboard/:userid` - Posts new score to leaderboard.
  - `POST /login` - Creates access token and post refresh token to mongoDB.
  - `DELETE /logout` - Deletes user tokens from mongoDB.
  - `POST /register` - Creates new user in mongoDB.
  - `POST /verifyemail` - Creates a temporary token for the user and sends an email for password reset.
  - `PATCH /reset-password` - Updates password in mongoDB.

Please refer to source code for detailed information about the request and response structure for each endpoint.

## Database Configuration

By default, the application uses MongoDB as the database. Make sure you have MongoDB and mongoose installed and running on your system. Update the MONGO environment variables in the `.env` file with the appropriate connection URL.

## Reset Password Functionality

The application uses Nodemailer to send password reset emails. It requires SMTP server configuration to function correctly. Update the following environment variables in the `.env` file with your SMTP server details:

- `EMAIL_USER`: Your email address for sending emails.
- `EMAIL_PASS`: Your email password for authentication.

The host and post in `./utils/nodemailer.js` will require changing the the relevant service provider if you are not using gmail.

## Contribution

Contributions to this project are welcome. If you find any issues or would like to add new features, please create a pull request with detailed information about the changes.

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute the code as per the terms of the license.

# Author
<h3>Robert Bish</h3>

<a href='https://www.linkedin.com/in/robert-bish-1a6a8637'>
  <img src='https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white' alt='LinkedIn Badge'/>
</a>
<a href='https://robertbishwebdeveloper.com'>
  <img src='https://img.shields.io/badge/Portfolio-darkgreen?style=for-the-badge&logo=portfolio&logoColor=white' alt='Portfolio Badge'/>
</a>
<a href='https://www.facebook.com/robert.bish.9'>
  <img src='https://img.shields.io/badge/Facebook-darkblue?style=for-the-badge&logo=facebook&logoColor=white' alt='Facebook Badge'/>
</a>


