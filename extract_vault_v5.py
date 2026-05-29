import json
import os

def extract():
    with open('step384.json', 'r', encoding='utf-8') as f:
        line = f.read()
    
    start = line.find('{"step_index"')
    if start == -1: return
    
    data = json.loads(line[start:])
    target_content = data['tool_calls'][0]['args']['TargetContent']
    
    # If it's a string, and it's escaped (starts with quote or contains \n as literal)
    # The logs store it as a JSON string within the JSON object
    if isinstance(target_content, str):
        if target_content.startswith('"'):
             target_content = json.loads(target_content)
        
    # Remove any extra quotes at start/end if they were added erroneously
    if target_content.startswith('"') and target_content.endswith('"'):
        target_content = target_content[1:-1]

    with open('previous_vault.tsx', 'w', encoding='utf-8') as out:
        out.write(target_content)
    print("Extracted successfully")

extract()
