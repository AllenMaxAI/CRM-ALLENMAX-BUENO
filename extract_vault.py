import json
import os

with open('step384.json', 'r', encoding='utf-16') as f: # PowerShell redirects often use utf-16
    content = f.read()

# Strip the prefix if it exists (Select-String output format)
if ':{"' in content:
    content = content[content.find(':{"')+1:]

try:
    data = json.loads(content)
    target_content = data['tool_calls'][0]['args']['TargetContent']
    with open('previous_vault.tsx', 'w', encoding='utf-8') as f:
        f.write(target_content)
    print("Successfully extracted previous_vault.tsx")
except Exception as e:
    print(f"Error: {e}")
