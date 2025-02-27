function checkLogin() {
    fetch("../php/session_check.php")
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = "login.html"; // Redirect if not logged in
            }
        });
}

function logout() {
    fetch("../php/logout.php")
        .then(() => {
            window.location.href = "login.html";
        });
}

function showEncryption() {
    document.getElementById("selectionScreen").style.display = "none";
    document.getElementById("encryptionSection").style.display = "block";
}

function showDecryption() {
    document.getElementById("selectionScreen").style.display = "none";
    document.getElementById("decryptionSection").style.display = "block";
}

function goBack() {
    document.getElementById("selectionScreen").style.display = "block";
    document.getElementById("encryptionSection").style.display = "none";
    document.getElementById("decryptionSection").style.display = "none";
}

function generateRandomHex(length) {
    const characters = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
}

function encryptText() {
    let text = document.getElementById("textInput").value.trim();
    let key = generateRandomHex(16); // Random Key
    let iv = generateRandomHex(16);  // Random IV

    if (!text) {
        alert("Please enter text to encrypt!");
        return;
    }

    fetch("../php/encryption.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, key, iv })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("encKey").value = key;
            document.getElementById("encIV").value = iv;
            document.getElementById("encryptedOutput").value = data.encryptedText;
        } else {
            console.error("Encryption Error:", data.error);
            alert("Encryption failed: " + data.error);
        }
    })
    .catch(error => {
        console.error("Fetch Error:", error);
        alert("An error occurred during encryption.");
    });
}

function decryptText() {
    let encryptedText = document.getElementById("encryptedText").value.trim();
    let key = document.getElementById("decryptKey").value.trim();
    let iv = document.getElementById("decryptIV").value.trim();

    if (!encryptedText || !key || !iv) {
        alert("Please enter encrypted text, key, and IV!");
        return;
    }

    fetch("../php/decryption.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encryptedText, key, iv })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("decryptedOutput").value = data.decryptedText;
        } else {
            console.error("Decryption Error:", data.error);
            alert("Decryption failed: " + data.error);
        }
    })
    .catch(error => {
        console.error("Fetch Error:", error);
        alert("An error occurred during decryption.");
    });
}

function copyToClipboard() {
    let key = document.getElementById("encKey").textContent;
    let iv = document.getElementById("encIV").textContent;
    let encryptedText = document.getElementById("encryptedOutput").textContent;
    
    let fullText = `Key: ${key}\nIV: ${iv}\nEncrypted Text: ${encryptedText}`;
    navigator.clipboard.writeText(fullText).then(() => {
        alert("Encrypted data copied to clipboard!");
    });
}

document.addEventListener("DOMContentLoaded", checkLogin);
