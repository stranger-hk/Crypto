function registerUser() {
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm_password').value;

    // Password Strength Validation
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
        alert("Password must contain at least 8 characters, including uppercase, lowercase, a number, and a symbol.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let userData = {
        username: document.getElementById('username').value,
        f_name: document.getElementById('f_name').value,
        l_name: document.getElementById('l_name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        sex: document.getElementById('sex').value,
        password: password
    };

    fetch("../php/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })
    .then(res => res.text())
    .then(data => {
        document.getElementById('status').innerText = data;

        if (data.includes("Signup successful")) {
            alert("Signup successful! Redirecting to login...");
            window.location.href = "../html/login.html"; // Redirect to login page
        }
    });
}

function navigate(page) {
    if (page === "home") {
        window.location.href = "../html/home.html";
    } else if (page === "login") {
        window.location.href = "../html/login.html";
    }
}
