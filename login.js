function loginUser() {
    let userData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    fetch("../php/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })
    .then(res => res.text())
    .then(data => {
        if (data.includes("Login Successful")) {
            alert("Login Successful! Redirecting to chat...");
            window.location.href = "../html/encryption.html"; // Redirect to chat page
        } else {
            alert("Invalid Username or Password!");
        }
    });
}

function navigate(page) {
    if (page === "home") {
        window.location.href = "../html/home.html";
    } else if (page === "signup") {
        window.location.href = "../html/signup.html";
    }
}
