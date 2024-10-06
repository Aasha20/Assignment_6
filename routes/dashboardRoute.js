app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading user data');
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.email === req.session.userId);

        if (user) {
            console.log(user); // For debugging
            res.render('user/dashboard', {
                userName: `${user.firstName} ${user.lastName}`,
                userEmail: user.email,
                userPhone: user.phone,
                userLocation: user.location || 'Not provided',
                userFavoriteDestination: user.favoriteDestination || 'Unknown',
                userTrips: user.trips.length > 0 ? user.trips.join(', ') : 'None',
                userMemberSince: user.memberSince
            });
        } else {
            res.status(404).send('User not found');
        }
    });
});