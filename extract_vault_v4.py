import json
import os

def extract():
    with open('step384.json', 'r', encoding='utf-8') as f:
        line = f.read()
    
    # Find the JSON part in case there's garbage
    start = line.find('{"step_index"')
    if start == -1: return
    
    data = json.loads(line[start:])
    target_content = data['tool_calls'][0]['args']['TargetContent']
    
    # It seems it's double encoded in the JSON
    # e.g. TargetContent is a string that is ITSELF a JSON-encoded string
    try:
        # If it's a string, and it starts with a quote, it might be JSON-encoded
        if target_content.strip().startswith('"'):
            target_content = json.loads(target_content)
    except:
        pass

    # If it still has literal \n and \", unescape it
    target_content = target_content.encode('utf-8').decode('unicode_escape')

    with open('previous_vault.tsx', 'w', encoding='utf-8') as out:
        out.write(target_content)
    print("Extracted and unescaped")

extract()
