import os

def fix_css(file_path):
    if not os.path.exists(file_path):
        print(f"Skipping {file_path}, not found.")
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to comment out the first @font-face block which loads Inter
    if '@font-face' in content and 'Inter' in content:
        start = content.find('@font-face')
        end = content.find('}', start) + 1
        new_content = content[:start] + "/* " + content[start:end] + " */" + content[end:]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {file_path}")
    else:
        print(f"No @font-face found in {file_path}")

fix_css('trinayai-web/src/assets/themes/theme.css')
fix_css('trinayai-admin/src/assets/themes/theme.css')
