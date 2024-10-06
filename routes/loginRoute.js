const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to the user.json file
const usersFilePath = path.join(__dirname, '../data/users.json');

// Handle login request
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            const error = new Error('Error reading user data');
            error.status = 500;
            return next(error);
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            // User is authenticated
            req.session.userId = user.email; // Store the user's email in the session
            res.redirect('/');  // Redirect to the index page after successful login
        } else {
            // Show an error if credentials don't match
            res.render('login', { errorMessage: 'Email or password is incorrect. Please try again or sign up.' });
        }
    });
});

module.exports = router;
