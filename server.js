const express = require('express');
var cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();

// Set up CORS
app.use(
  cors({
    origin: true, // "true" will copy the domain of the request back
    // to the reply. If you need more control than this
    // use a function.

    credentials: true, // This MUST be "true" if your endpoint is
    // authenticated via either a session cookie
    // or Authorization header. Otherwise the
    // browser will block the response.

    methods: 'POST,GET,PUT,OPTIONS,DELETE', // Make sure you're not blocking
    // pre-flight OPTIONS requests
  })
);

// Connect Databse
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('', require('./routes/api/home'));
app.use('/steps', require('./routes/api/step'));
app.use('/items', require('./routes/api/item'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
