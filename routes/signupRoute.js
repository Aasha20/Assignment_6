const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to the user.json file
const usersFilePath = path.join(__dirname, '../data/users.json');

router.post('/signup', (req, res, next) => {
    const { firstName, lastName,location, signupEmail, signupPassword, phone,favoriteDestination } = req.body;

    const newUser = {
        firstName,
        lastName,
        location:location,
        email: signupEmail,
        password: signupPassword,
        phone,
        favoriteDestination:favoriteDestination
    };

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

        const existingUser = users.find(user => user.email === signupEmail);
        if (existingUser) {
            const error = new Error('User with this email already exists');
            error.status = 400;
            return next(error);
        }

        users.push(newUser);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (writeErr) => {
            if (writeErr) {
                const error = new Error('Error saving user data');
                error.status = 500;
                return next(error);
            }

            // Render the registration success page after saving
            res.render('reg_Success', { signupEmail});
        });
    });
});

module.exports = router;
