import sys
import shutil

# Get the path of the uploaded file
uploaded_file_path = sys.argv[1]

# Move the uploaded file to the 'Files' folder
shutil.move(uploaded_file_path, './Files/')
