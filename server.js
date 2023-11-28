const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const ejs = require('ejs');

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up middleware for parsing JSON and handling file uploads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: './Files/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Helper function to get file size
function getFileSize(filename) {
  const stats = fs.statSync(path.join(__dirname, 'Files', filename));
  const fileSizeInBytes = stats.size;
  const fileSizeInKilobytes = fileSizeInBytes / 1024;
  return fileSizeInKilobytes.toFixed(2) + ' KB';
}

// Define routes
app.get('/', (req, res) => {
  // Get the list of files in the "Files" folder
  const filesList = fs.readdirSync('./Files');

  // Render the main page with the list of files
  res.render('index', { files: filesList.map(fileName => ({ name: fileName, size: getFileSize(fileName) })) });
});

app.post('/upload', upload.single('file'), (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Execute Python script to process the uploaded file
  const pythonScriptPath = path.join(__dirname, 'process_upload.py');
  const command = `python ${pythonScriptPath} ${req.file.path}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      return res.status(500).send('Internal Server Error');
    }

    // Python script executed successfully
    console.log(`Python Script Output: ${stdout}`);

    // Redirect to the main page after the upload
    res.redirect('/');
  });
});

// New route to handle file downloads
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'Files', req.params.filename);
  res.download(filePath);
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Handle Ctrl+C to end the server gracefully
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server shut down gracefully.');
    process.exit(0);
  });
});
