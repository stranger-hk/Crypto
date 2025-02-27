import sys
import base64
import os
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Util.Padding import pad, unpad

# Constants
SALT_SIZE = 16
KEY_SIZE = 32
IV_SIZE = 16
ITERATIONS = 100000

# Function to encrypt password
def encrypt_password(password):
    salt = os.urandom(SALT_SIZE)
    key = PBKDF2(password, salt, dkLen=KEY_SIZE, count=ITERATIONS)
    iv = os.urandom(IV_SIZE)

    cipher = AES.new(key, AES.MODE_CBC, iv)
    encrypted_password = cipher.encrypt(pad(password.encode(), AES.block_size))

    # Convert to base64 for storage
    pass_key_b64 = base64.b64encode(key).decode()
    iv_b64 = base64.b64encode(iv).decode()
    encrypted_password_b64 = base64.b64encode(encrypted_password).decode()

    return f"{pass_key_b64}|{iv_b64}|{encrypted_password_b64}"

# Function to decrypt password
def decrypt_password(pass_key_b64, iv_b64, encrypted_password_b64):
    key = base64.b64decode(pass_key_b64)
    iv = base64.b64decode(iv_b64)
    encrypted_password = base64.b64decode(encrypted_password_b64)

    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted_password = unpad(cipher.decrypt(encrypted_password), AES.block_size).decode()

    return decrypted_password

# CLI Execution
if len(sys.argv) == 2:
    password = sys.argv[1]
    print(encrypt_password(password))
    sys.exit(0)

elif len(sys.argv) == 5 and sys.argv[1] == "decrypt":
    print(decrypt_password(sys.argv[2], sys.argv[3], sys.argv[4]))
    sys.exit(0)
