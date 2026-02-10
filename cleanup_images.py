import os

def cleanup_originals(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                # Corresponding webp name
                base_name = os.path.splitext(file_path)[0]
                webp_path = base_name + ".webp"
                
                if os.path.exists(webp_path):
                    print(f"Deleting heavy original: {file_path}")
                    try:
                        os.remove(file_path)
                    except Exception as e:
                        print(f"  Error deleting {file_path}: {e}")

if __name__ == "__main__":
    cleanup_originals("client/public/GameJam")
    cleanup_originals("client/public/bg")
