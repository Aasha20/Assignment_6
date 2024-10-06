 // Get the email from the URL query parameters
 const params = new URLSearchParams(window.location.search);
 const email = params.get('email');

 // Display the email in the thank you message
 document.getElementById('emailDisplay').textContent = `We have received your feedback. Thank you, ${email}!`;

 // Countdown for redirect
 let countdown = 5; // seconds
 const countdownElement = document.getElementById('countdown');

 const countdownInterval = setInterval(() => {
     countdown--;
     countdownElement.textContent = countdown;

     if (countdown === 0) {
         clearInterval(countdownInterval);
         window.location.href = 'index.html'; // Redirect to homepage
     }
 }, 1000);