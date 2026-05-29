import json
import os

def find_step_384():
    log_file = 'overview_backup.txt'
    if not os.path.exists(log_file):
        print("Log not found")
        return
    
    with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            if '"step_index":384' in line:
                with open('step384.json', 'w', encoding='utf-8') as out:
                    out.write(line)
                print("Found and saved step 384")
                return
    print("Step 384 not found")

find_step_384()
