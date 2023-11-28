<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if a file was uploaded
    if ($_FILES["file"]["error"] == 0) {
        $uploadDir = '../Files/';
        $uploadFile = $uploadDir . basename($_FILES["file"]["name"]);

        // Move the uploaded file to the "Files" folder
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $uploadFile)) {
            // Redirect back to the main page
            header("Location: /");
            exit();
        } else {
            // Handle move_uploaded_file error
            echo "Error moving uploaded file.";
        }
    } else {
        // Handle upload error
        echo "Error uploading file. Error code: " . $_FILES["file"]["error"];
    }
} else {
    // Handle incorrect request method
    echo "Invalid request method.";
}
?>
