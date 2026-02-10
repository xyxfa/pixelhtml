import os

def kill_nul(start_path):
    abs_start = os.path.abspath(start_path)
    for root, dirs, files in os.walk(abs_start):
        for name in files:
            if name.lower() == 'nul':
                file_path = os.path.join(root, name)
                # Ensure we have the absolute path correctly formatted
                target = r"\\?\{}".format(file_path)
                print(f"Trying to kill: {target}")
                try:
                    os.remove(target)
                    print(f"Killed!")
                except Exception as e:
                    print(f"Error: {e}")

if __name__ == "__main__":
    kill_nul(".") 
