<?php
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['text']) || !isset($data['key']) || !isset($data['iv'])) {
    echo json_encode(["success" => false, "error" => "Invalid input"]);
    exit();
}

$text = escapeshellarg($data['text']);
$key = escapeshellarg($data['key']);
$iv = escapeshellarg($data['iv']);

$command = "python3 ../python/rc4_cipher.py encrypt $key $iv $text 2>&1"; // Capture error output
$encryptedText = shell_exec($command);

if ($encryptedText === null) {
    echo json_encode(["success" => false, "error" => "Encryption process failed"]);
} else {
    echo json_encode(["success" => true, "encryptedText" => trim($encryptedText)]);
}
?>
