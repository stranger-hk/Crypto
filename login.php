<?php
require_once 'db_connect.php';
session_start();

// Get the JSON data from frontend
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'];
$password = $data['password'];

// Retrieve stored password details based on username
$sql = "SELECT u.user_id, p.pass_key, p.iv, p.encrypted_password 
        FROM user_details u 
        JOIN passwords p ON u.user_id = p.user_id 
        WHERE u.username = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($user_id, $pass_key, $iv, $encrypted_password);
$stmt->fetch();
$stmt->close();

if (!$user_id) {
    echo "Invalid Username or Password!";
    exit();
}

// Decrypt stored password using passhash.py
$decrypted_password = shell_exec("python3 ../python/passhash.py decrypt " . escapeshellarg($pass_key) . " " . escapeshellarg($iv) . " " . escapeshellarg($encrypted_password));

if (trim($decrypted_password) === $password) {
    // Store session data
    $_SESSION["user_id"] = $user_id;
    $_SESSION["username"] = $username;

    echo "Login Successful!";
} else {
    echo "Invalid Username or Password!";
}

$conn->close();
?>
