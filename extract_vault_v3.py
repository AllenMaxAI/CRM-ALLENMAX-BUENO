import json
import os
import ast

log_file = 'overview_backup.txt'
output_file = 'previous_vault.tsx'

def extract():
    if not os.path.exists(log_file):
        print(f"Error: {log_file} not found")
        return

    with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            if '"step_index":384' in line:
                try:
                    start = line.find('{"step_index"')
                    if start == -1: continue
                    data = json.loads(line[start:])
                    target_content = data['tool_calls'][0]['args']['TargetContent']
                    
                    # If it's a string that looks like a JSON string, try to parse it
                    if target_content.startswith('"') and target_content.endswith('"'):
                        try:
                            # Use json.loads to unescape
                            target_content = json.loads(target_content)
                        except:
                            pass
                    
                    with open(output_file, 'w', encoding='utf-8') as out:
                        out.write(target_content)
                    print(f"Successfully extracted to {output_file}")
                    return
                except Exception as e:
                    print(f"Error parsing line: {e}")
    print("Step 384 not found in log")

extract()
