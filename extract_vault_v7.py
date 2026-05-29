import json
import os

def extract():
    with open('step384.json', 'r', encoding='utf-8') as f:
        line = f.read()
    
    start = line.find('{"step_index"')
    if start == -1: return
    
    data = json.loads(line[start:])
    content = data['tool_calls'][0]['args']['TargetContent']
    
    # Repeatedly unescape until it doesn't start with a quote or we hit a limit
    for _ in range(3):
        if isinstance(content, str) and content.startswith('"'):
            try:
                # If it's a string that starts with a quote, it might be JSON-encoded
                content = json.loads(content)
            except Exception as e:
                print(f"Loads failed at step {_}: {e}")
                # Manual unescape as fallback
                if content.startswith('"') and content.endswith('"'):
                    content = content[1:-1]
                content = content.replace('\\"', '"').replace('\\n', '\n').replace('\\t', '\t').replace('\\\\', '\\')
        else:
            break

    with open('previous_vault.tsx', 'w', encoding='utf-8') as out:
        out.write(content)
    print("Extracted successfully")

extract()
