import json

with open('previous_vault.tsx', 'r', encoding='utf-8') as f:
    c = f.read(20)
    print(f"First 20 chars: {c!r}")
    for char in c:
        print(f"Char: {char!r} Code: {ord(char)}")
