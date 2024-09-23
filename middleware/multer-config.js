const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MINE_TYPE = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'jpg'
};
console.log('Multer middleware called');
// storage represent location/directory where images are stored
// Define the storage engine using multer.diskStorage
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // Check if the images directory exists, if not, create it
        if (!fs.existsSync('./images')) {
            fs.mkdirSync('./images', { recursive: true });
        }
        callback(null, 'images'); // Set the destination folder
    },
    filename: (req, file, callback) => {
        // Create a unique filename
        const name = file.originalname.split(' ').join('_');
        const extension = path.extname(file.originalname);
        const timestamp = Date.now();
        const uniqueFilename = `${name}-${timestamp}${extension}`;
        callback(null, uniqueFilename);
    }
});

// Initialize multer with the defined storage
const upload = multer({ storage }).single('image');

// Middleware to optimize the image
const optimizeImage = async (req, res, next) => {
    if (!req.file) {
        return next(); // If no file uploaded, go to the next middleware
    }
    try {
        const inputPath = path.join(__dirname, '../images', req.file.filename);
        const outputPath = path.join(__dirname, '../images', `${req.file.filename}.webp`);
        console.log('Image saved to:', outputPath);
        // Optimize the image using sharp
        await sharp(inputPath)
            .webp({ quality: 20 })
            .toFile(outputPath);

        // Optionally delete the original file if not needed
        fs.unlinkSync(inputPath);
        
        // Set the image URL in the request body
        req.body.imageUrl = `http://localhost:3000/images/${req.file.filename}.webp`;
        next();
    } catch (error) {
        console.error('Erreur Sharp:', error); // Log the complete error
        res.status(500).json({ message: 'Erreur lors de la compression de l\'image.' });
    }
};

// Export multer and optimizeImage as separate functions
module.exports = {
    upload,
    optimizeImage
};
