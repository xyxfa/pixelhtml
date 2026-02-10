import os
from PIL import Image

def report_assets(directory):
    print(f"{'File Path':<80} | {'Size (KB)':<10} | {'Dimensions':<15}")
    print("-" * 110)
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.webp'):
                file_path = os.path.join(root, file)
                size_kb = os.path.getsize(file_path) / 1024
                try:
                    with Image.open(file_path) as img:
                        dims = f"{img.width}x{img.height}"
                except:
                    dims = "Unknown"
                
                rel_path = os.path.relpath(file_path, directory)
                print(f"{rel_path:<80} | {size_kb:<10.2f} | {dims:<15}")

if __name__ == "__main__":
    report_assets("client/public")
