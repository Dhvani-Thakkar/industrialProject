const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const User = require("./User");
const Chatbot = require("./Chatbot");
const Student = require("./Student");
const Instructor = require("./Instructor");
const Course = require("./Course");
const Notification = require("./Notification");
const Conversation = require("./Conversation");
const cors = require('cors');

require('dotenv').config(); // Load environment variables

// entrance into all other routes
const app = express();

app.use(cors());
app.use(express.json());
app.use('/user', User);
app.use('/chatbot', Chatbot);
app.use('/student', Student);
app.use('/instructor', Instructor);
app.use('/course', Course);
app.use('/notification', Notification);
app.use('/conversation', Conversation);

app.use("/", (req, res) => {
    res.status(200).json({ Message: "Welcome to the main path" });
});

const server = awsServerlessExpress.createServer(app);

if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
    // AWS express
    exports.handler = (event, context) => {
        awsServerlessExpress.proxy(server, event, context);
    };
} else {
    
    // useful for tests to treat backend like a regular express app.
    module.exports = app;
}