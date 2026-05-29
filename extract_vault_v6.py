import json
import os

def extract():
    with open('step384.json', 'r', encoding='utf-8') as f:
        line = f.read()
    
    start = line.find('{"step_index"')
    if start == -1: return
    
    data = json.loads(line[start:])
    target_content = data['tool_calls'][0]['args']['TargetContent']
    
    # It's a string containing a JSON-encoded string
    # We want to unescape it.
    if target_content.startswith('"') and target_content.endswith('"'):
        # Manual unescape of the most common characters if json.loads fails
        try:
            target_content = json.loads(target_content)
        except:
            # Fallback: remove wrapping quotes and unescape manually
            target_content = target_content[1:-1]
            target_content = target_content.replace('\\"', '"').replace('\\n', '\n').replace('\\t', '\t').replace('\\\\', '\\')

    with open('previous_vault.tsx', 'w', encoding='utf-8') as out:
        out.write(target_content)
    print("Extracted and manually unescaped")

extract()
