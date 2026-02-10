import os
from PIL import Image

def compress_images(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                size_mb = os.path.getsize(file_path) / (1024 * 1024)
                
                # Check if it's one of the large seamless backgrounds
                is_background = "seamless" in file.lower() or "bg" in file.lower()
                
                if size_mb > 0.5 or is_background:
                    print(f"Compressing {file_path} ({size_mb:.2f} MB)")
                    try:
                        with Image.open(file_path) as img:
                            # Convert to WebP
                            webp_path = os.path.splitext(file_path)[0] + ".webp"
                            # If it's a seamless background, we want it small but good
                            img.save(webp_path, "WEBP", quality=80)
                            print(f"  Created {webp_path}")
                            
                            # Keep the original if you want, but we should delete to save space
                            # For the portfolio, we'll replace the references in code
                    except Exception as e:
                        print(f"  Error: {e}")

if __name__ == "__main__":
    compress_images("client/public/GameJam")
    compress_images("client/public/bg")
