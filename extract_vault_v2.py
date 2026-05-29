import json
import os

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
                    # Find the JSON part
                    start = line.find('{"step_index"')
                    if start == -1: continue
                    data = json.loads(line[start:])
                    target_content = data['tool_calls'][0]['args']['TargetContent']
                    with open(output_file, 'w', encoding='utf-8') as out:
                        out.write(target_content)
                    print(f"Successfully extracted to {output_file}")
                    return
                except Exception as e:
                    print(f"Error parsing line: {e}")
    print("Step 384 not found in log")

extract()
