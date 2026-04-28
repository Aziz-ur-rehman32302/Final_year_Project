import os
import glob
import re

src_dir = r"d:\Plaza_Management_System\src"

count = 0
for ext in ('*.js', '*.jsx', '*.ts', '*.tsx'):
    for filepath in glob.glob(os.path.join(src_dir, '**', ext), recursive=True):
        if 'config.js' in filepath: continue
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # The issue: fetch(API_BASE_URL + '/something", 
            # We want to replace single quote + string + double quote, or single quote + string + single quote but leaving the beginning alone
            # Wait, our replacement was:
            # new_content.replace('"http://localhost/plaza_management_system_backend', "API_BASE_URL + '")
            # So `"http://loc.../some.php"` became `API_BASE_URL + '/some.php"`
            # we want to fix the trailing `"`. 

            new_content = re.sub(r"API_BASE_URL \+ '([^'\"]+)\"", r"API_BASE_URL + '\1'", content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print("Fixed quote in", filepath)
                count += 1
        except Exception as e:
            pass
print("Done fixing quotes. Files changed:", count)
