<?php
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['encryptedText']) || !isset($data['key']) || !isset($data['iv'])) {
    echo json_encode(["success" => false, "error" => "Invalid input"]);
    exit();
}

$encryptedText = escapeshellarg($data['encryptedText']);
$key = escapeshellarg($data['key']);
$iv = escapeshellarg($data['iv']);

$command = "python3 ../python/rc4_cipher.py decrypt $key $iv $encryptedText 2>&1";
$decryptedText = shell_exec($command);

if ($decryptedText === null || trim($decryptedText) === "") {
    echo json_encode(["success" => false, "error" => "Decryption failed"]);
} else {
    echo json_encode(["success" => true, "decryptedText" => trim($decryptedText)]);
}
?>
