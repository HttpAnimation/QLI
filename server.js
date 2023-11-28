const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Helper function to get file size
function getFileSize(filename) {
  const filePath = path.join(__dirname, 'Files', filename);
  try {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInKilobytes = fileSizeInBytes / 1024;
    return fileSizeInKilobytes.toFixed(2) + ' KB';
  } catch (error) {
    console.error(`Error getting file size: ${error.message}`);
    return 'N/A';
  }
}

// Set up middleware for parsing JSON and handling file uploads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage(); // Use memory storage for simplicity
const upload = multer({ storage: storage });

// Define routes
app.get('/', (req, res) => {
  try {
    // Get the list of files in the "Files" folder
    const filesList = fs.readdirSync('./Files');

    // Render the main page with the list of files
    res.render('index', { files: filesList.map(fileName => ({ name: fileName, size: getFileSize(fileName) })) });
  } catch (error) {
    console.error(`Error reading Files folder: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

// Serve static files from the 'public' folder
app.use('/public', express.static('public'));

// Define routes
app.post('/public/upload.php', upload.single('file'), (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Save the file buffer to the "Files" folder
  const fileName = req.file.originalname;
  const filePath = path.join(__dirname, 'Files', fileName);

  fs.writeFileSync(filePath, req.file.buffer);

  // Redirect to the main page after the upload
  res.redirect('/');
});


app.post('/upload', upload.single('file'), (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Save the file buffer to the "Files" folder
  const fileName = req.file.originalname;
  const filePath = path.join(__dirname, 'Files', fileName);
  
  fs.writeFileSync(filePath, req.file.buffer);

  // Redirect to the main page after the upload
  res.redirect('/');
});

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
