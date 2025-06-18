require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');

// express app
const app = express();

const allowedOrigins = [
  'https://mern-workout-budyy.netlify.app', // my hosted frontend
  'http://localhost:5173'                    // local development
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"]
  })
);

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
})

// routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen requests
    app.listen(process.env.PORT || 4000, () => {
      console.log('Now listening to port ' + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("did not work due to this " + error);
  })
