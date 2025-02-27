<?php
require_once 'db_connect.php';

// Get JSON data from frontend
$data = json_decode(file_get_contents("php://input"), true);

// Extract user details
$username = $data['username'];
$first_name = $data['f_name'];
$last_name = $data['l_name'];
$email = $data['email'];
$age = $data['age'];
$sex = $data['sex'];
$password = $data['password'];

// Validate password strength
if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', $password)) {
    echo "Password does not meet security requirements!";
    exit();
}

// Encrypt password using passhash.py
$encryption_output = shell_exec("python3 ../python/passhash.py " . escapeshellarg($password));
list($pass_key, $iv, $encrypted_password) = explode("|", trim($encryption_output));

// Insert user details into user_details table
$sql1 = "INSERT INTO user_details (username, f_name, l_name, email, age, sex) VALUES (?, ?, ?, ?, ?, ?)";
$stmt1 = $conn->prepare($sql1);
$stmt1->bind_param("ssssss", $username, $first_name, $last_name, $email, $age, $sex);

if ($stmt1->execute()) {
    $user_id = $stmt1->insert_id; // Get the newly inserted user_id

    // Insert encrypted password into passwords table
    $sql2 = "INSERT INTO passwords (user_id, pass_key, iv, encrypted_password) VALUES (?, ?, ?, ?)";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("isss", $user_id, $pass_key, $iv, $encrypted_password);

    if ($stmt2->execute()) {
        echo "Signup successful!";
    } else {
        echo "Error inserting password: " . $stmt2->error;
    }

    $stmt2->close();
} else {
    echo "Error inserting user details: " . $stmt1->error;
}

$stmt1->close();
$conn->close();
?>
