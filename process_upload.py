import sys
import os

# Get the path of the uploaded file
uploaded_file_path = sys.argv[1]

# Specify the destination directory (Files folder)
destination_directory = './Files/'

# Extract the filename from the path
filename = os.path.basename(uploaded_file_path)

# Create the destination path
destination_path = os.path.join(destination_directory, filename)

# Move the uploaded file to the destination folder
os.rename(uploaded_file_path, destination_path)
