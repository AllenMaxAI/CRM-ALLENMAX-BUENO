import json
import os

def extract():
    with open('step384.json', 'r', encoding='utf-8') as f:
        line = f.read()
    
    start = line.find('{"step_index"')
    if start == -1: return
    
    data = json.loads(line[start:])
    target_content = data['tool_calls'][0]['args']['TargetContent']
    
    print(f"Type: {type(target_content)}")
    print(f"Starts with: {target_content[:50]!r}")
    
    with open('previous_vault.tsx', 'w', encoding='utf-8') as out:
        out.write(target_content)
    print("Saved raw content")

extract()
