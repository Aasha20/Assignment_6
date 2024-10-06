const express = require('express');
const app = express();
const path = require('path');
const url = require('url');
const fs = require('fs');
const session = require('express-session');

// routers
const signupRoute = require('./routes/signupRoute');
const userRoute = require('./routes/user');
const searchFlightRoute = require('./routes/searchFlight');
const guidesRoute = require('./routes/guidesRoute');

// template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// urlencoded for post requests
app.use(express.urlencoded({ extended: true }));

// session management
app.use(session({
  secret: 'your_secret_key',  // Change this to a secure secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set to true if using HTTPS
}));

// routing
app.post('/signup', signupRoute);
app.post('/login', userRoute);  // Handling login
app.use('/user', userRoute);
app.post('/flights', searchFlightRoute);
app.post('/guides', guidesRoute);

// Ensure flights are properly routed
app.get('/flights', (req, res) => {
  // Ensure that you have a "flights.pug" file inside views/user
  res.render('user/flights');
});
app.get('/restaurant', (req, res) => {
  res.render('user/restaurant');
});

app.get('/guides', (req, res) => {
  res.render('user/guides');
});

app.get('/profile', (req, res) => {
  res.render('user/profile');
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }

  // Assume users are stored in a file or database
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading user data');
    }

    const users = JSON.parse(data);
    const user = users.find(u => u.email === req.session.userId);

    if (user) {
      res.render('user/dashboard', {
        userFirstName: user.firstName,   // First Name
        userLastName: user.lastName,     // Last Name
        userEmail: user.email,           // Email
        userPhone: user.phone,           // Phone Number
        userLocation: user.location || 'Not provided',   // Location
        userFavoriteDestination: user.favoriteDestination || 'Unknown',  // Favorite Destination
        userTrips: user.trips || 'None',    // Trips Planned
        userMemberSince: user.memberSince   // Member Since
      });
    } else {
      res.status(404).send('User not found');
    }
  });
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/user'); // If there's an error, redirect to user page
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.redirect('/'); // Redirect to index page
  });
});

// Middleware - Static pages
app.use((req, res, next) => {
  try {
    res.render(url.parse(req.url, true).pathname.substring(1), { userId: req.session.userId });
  } catch (error) {
    const err = new Error('Error rendering the page');
    err.status = 500;
    return next(err);
  }
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.log('error called');
  const statusCode = err.status || 500;
  res.status(statusCode).render('error', {
    title: `Error ${statusCode}`,
    statusCode: statusCode,
    message: err.message || 'Something went wrong. Please try again later.'
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running @ http://localhost:${port}`);
});
