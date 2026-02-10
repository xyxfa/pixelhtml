import os
from PIL import Image

def optimize_image(file_path):
    try:
        with Image.open(file_path) as img:
            # Check dimensions
            width, height = img.size
            
            # Decide max dimensions
            max_dim = 1920
            if "seamless" in file_path.lower() or "pattern" in file_path.lower():
                max_dim = 1024 # Patterns don't need to be huge
            
            needs_resize = False
            if width > max_dim or height > max_dim:
                # Calculate new size
                if width > height:
                    new_width = max_dim
                    new_height = int(height * (max_dim / width))
                else:
                    new_height = max_dim
                    new_width = int(width * (max_dim / height))
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                needs_resize = True
                print(f"  Resized from {width}x{height} to {new_width}x{new_height}")

            # Save as WebP with aggressive quality
            webp_path = os.path.splitext(file_path)[0] + ".webp"
            img.save(webp_path, "WEBP", quality=75, method=6) # method 6 is slowest/best compression
            
            new_size = os.path.getsize(webp_path) / 1024
            print(f"  Optimized {file_path}: {new_size:.2f} KB")
            
            # If we resized or it was a png, and it's not the webp itself, we might have redundants
            # But here we just overwrite the webp.
    except Exception as e:
        print(f"  Error optimizing {file_path}: {e}")

def run_optimization(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.webp', '.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                # To avoid infinite loop or redundant work on already optimized webp in the same pass
                # we'll just process everything. Python's os.walk is fine with it.
                optimize_image(file_path)

if __name__ == "__main__":
    # Process both public folders
    run_optimization("client/public/GameJam")
    run_optimization("client/public/bg")
