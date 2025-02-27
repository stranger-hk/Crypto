<?php
session_start();
header("Content-Type: application/json");

if (isset($_SESSION['username'])) {
    echo json_encode(["loggedIn" => true]);
} else {
    echo json_encode(["loggedIn" => false]);
}
?>
