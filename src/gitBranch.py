import subprocess


# Function to get the current Git branch
def get_current_branch():
    try:
        result = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True)
        return result.stdout.strip()
    except Exception as e:
        print("Error:", e)
        return None


# Function to write branch name to a file
def write_branch_to_file(branchName):
    try:
        file_path = './frontend/src/api/URL.jsx'
        with open(file_path, 'r') as file:
            content = file.read()
        local = 'apiURL = local;'
        remote = 'apiURL = remote;'
        if branchName == "master" and local in content:
            content = content.replace(local, remote)
        elif branchName != "master" and remote in content:
            content = content.replace(remote, local)
        with open(file_path, 'w') as file:
            file.write(content)
    except Exception as e:
        print("Error:", e)


# Example usage
if __name__ == "__main__":
    branch_name = get_current_branch()
    if branch_name:
        write_branch_to_file(branch_name)
    else:
        print("Unable to get current branch.")
