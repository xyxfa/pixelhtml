import os
from PIL import Image

def optimize_high_res(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                try:
                    with Image.open(file_path) as img:
                        width, height = img.size
                        print(f"Processing {file_path} ({width}x{height})")
                        
                        # No resizing, just convert to WebP with good quality
                        webp_path = os.path.splitext(file_path)[0] + ".webp"
                        
                        # Use slightly higher quality (80) to keep it crisp, but WebP is still much smaller than PNG
                        img.save(webp_path, "WEBP", quality=80, method=6)
                        print(f"  Created high-res {webp_path}")
                        
                        # Delete the original to keep the workspace clean
                        os.remove(file_path)
                except Exception as e:
                    print(f"  Error: {e}")

if __name__ == "__main__":
    optimize_high_res("client/public/GameJam")
    optimize_high_res("client/public/bg")
