const signInButton = document.getElementById("sign-in-button");

signInButton.addEventListener("click", function () {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check if email is empty
    if (email === "") {
        alert("Please enter your email.");
        return;
    }

    // Check if password is empty
    if (password === "") {
        alert("Please enter your password.");
        return;
    }

    // If both are filled in
    alert("Login successful!");

});