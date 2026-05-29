import os

input_file = 'previous_vault.tsx'
output_file = r'src\app\vault\page.tsx'

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove leading/trailing quotes
content = content.strip()
if content.startswith('"'):
    content = content[1:]
if content.endswith('"'):
    content = content[:-1]

# Fix double double quotes at start if they exist
if content.startswith('"'):
    content = content[1:]

with open(output_file, 'w', encoding='utf-8') as out:
    out.write(content)

print(f"Restored to {output_file}")
