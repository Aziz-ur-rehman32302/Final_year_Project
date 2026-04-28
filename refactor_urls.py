import os
import glob
import re

src_dir = r"d:\Plaza_Management_System\src"
target_string = "http://localhost/plaza_management_system_backend"

# Creates a config file
config_code = """export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/plaza_management_system_backend';\n"""
with open(os.path.join(src_dir, 'config.js'), 'w') as f:
    f.write(config_code)

count = 0
for ext in ('*.js', '*.jsx', '*.ts', '*.tsx'):
    for filepath in glob.glob(os.path.join(src_dir, '**', ext), recursive=True):
        if 'config.js' in filepath: continue
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            if target_string in content:
                # Replace logic
                # We will just replace 'http://localhost/plaza_management_system_backend...' with API_BASE_URL + '/...'
                new_content = content.replace("'http://localhost/plaza_management_system_backend", "API_BASE_URL + '")
                new_content = new_content.replace('"http://localhost/plaza_management_system_backend', "API_BASE_URL + '")
                new_content = new_content.replace('`http://localhost/plaza_management_system_backend', "`${API_BASE_URL}")

                # Need to add import API_BASE_URL if it doesn't exist
                if "API_BASE_URL" in new_content and "import { API_BASE_URL }" not in new_content and "const API_BASE_URL" not in new_content:
                    # Determine relative path to src/config.js
                    depth = filepath.replace(src_dir, '').count(os.sep) - 1
                    rel_path = '../' * depth + 'config' if depth > 0 else './config'
                    # Actually wait, some files might have 'const API_BASE_URL =' inside them.
                    # Let's remove them
                    import_statement = f"import {{ API_BASE_URL }} from '{rel_path}';\n"
                    new_content = import_statement + new_content

                # also remove any internal definitions of API_BASE_URL
                new_content = re.sub(r"const API_BASE_URL = ['\"`]http://localhost/[^'\"]+['\"`];\n?", "", new_content)

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                
        except Exception as e:
            print("Error parsing", filepath, e)

print(f"Refactored {count} files.")
