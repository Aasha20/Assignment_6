function toggleEdit() {
    const editButton = document.querySelector('.edit-profile');
    const saveButton = document.querySelector('.save-profile');
    const editableFields = ['userName', 'userEmail', 'userPhone', 'userLocation', 'userTrips', 'userFavoriteDestination'];
    
    // Convert each field into an input box with the current value
    editableFields.forEach(field => {
        const element = document.getElementById(field);
        const currentValue = element.textContent.trim();
        element.innerHTML = `<input type="text" class="editable" value="${currentValue}">`;
    });
    
    // Hide Edit button, show Save button
    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
}

function saveProfile() {
    const editButton = document.querySelector('.edit-profile');
    const saveButton = document.querySelector('.save-profile');
    const editableFields = ['userName', 'userEmail', 'userPhone', 'userLocation', 'userTrips', 'userFavoriteDestination'];
    const updatedProfile = {};

    // Capture updated values from the input fields
    editableFields.forEach(field => {
        const element = document.getElementById(field);
        const input = element.querySelector('input');
        const updatedValue = input.value.trim();
        element.textContent = updatedValue;
        updatedProfile[field] = updatedValue;
    });
    
    // Show Edit button, hide Save button
    editButton.style.display = 'inline-block';
    saveButton.style.display = 'none';

    // Send the updated profile data to the server
    fetch('/api/updateProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfile)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Profile updated successfully!');
        } else {
            console.log('Error updating profile:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}
