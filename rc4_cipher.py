import base64
import sys

def rc4(key, plaintext):
    S = list(range(256))
    j = 0
    out = []

    key = [ord(c) for c in key]

    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) % 256
        S[i], S[j] = S[j], S[i]

    i = j = 0
    for char in plaintext:
        i = (i + 1) % 256
        j = (j + S[i]) % 256
        S[i], S[j] = S[j], S[i]
        out.append(chr(ord(char) ^ S[(S[i] + S[j]) % 256]))

    return ''.join(out)

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Error: Missing arguments", file=sys.stderr)
        sys.exit(1)

    mode = sys.argv[1]
    key = sys.argv[2]
    iv = sys.argv[3]
    text = sys.argv[4]

    try:
        if mode == "encrypt":
            encrypted = rc4(key, text)
            print(base64.b64encode(encrypted.encode()).decode())  # Base64 encoding for safe transport
        elif mode == "decrypt":
            decoded_text = base64.b64decode(text).decode()
            print(rc4(key, decoded_text))  # Base64 decoding before decryption
        else:
            print("Error: Invalid mode", file=sys.stderr)
            sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
