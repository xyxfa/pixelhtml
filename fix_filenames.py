import os
import re

def rename_to_ascii(path):
    for root, dirs, files in os.walk(path):
        # Rename directories first
        for name in dirs:
            if not all(ord(c) < 128 for c in name) or ' ' in name:
                new_name = name.encode('ascii', 'ignore').decode().strip()
                if not new_name:
                    new_name = "folder"
                new_name = new_name.replace(' ', '-')
                old_path = os.path.join(root, name)
                new_path = os.path.join(root, new_name)
                print(f"Renaming directory: {old_path} -> {new_path}")
                try:
                    os.rename(old_path, new_path)
                except:
                    pass

        # Rename files
        for name in files:
            if not all(ord(c) < 128 for c in name) or ' ' in name:
                # Custom overrides for special cases
                if "标题" in name or "微信图片" in name or "主页" in name:
                    ext = os.path.splitext(name)[1]
                    new_name = "hero" + ext
                else:
                    new_name = name.encode('ascii', 'ignore').decode().strip()
                    if not new_name:
                        new_name = "file"
                    new_name = new_name.replace(' ', '-')
                
                old_path = os.path.join(root, name)
                new_path = os.path.join(root, new_name)
                print(f"Renaming file: {old_path} -> {new_path}")
                try:
                    os.rename(old_path, new_path)
                except:
                    pass

if __name__ == "__main__":
    rename_to_ascii("client/public")
