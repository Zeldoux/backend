const express = require("express");
const auth = require('../middleware/auth');

const router = express.Router();
const stuffCtrl = require('../controllers/stuff');


const { upload, optimizeImage } = require('../middleware/multer-config');

console.log("Upload middleware:", upload);

console.log("Optimize image middleware:", optimizeImage);

// POST (add new book)
router.post('/', auth, upload, optimizeImage, stuffCtrl.createBook);

// POST (rate a book)
router.post('/:id/rating', auth , upload, stuffCtrl.RateBook)

// PUT (updating a book)
router.put('/:id', auth, upload, optimizeImage, stuffCtrl.modifyBook);
// DELETE (deleting a book)
router.delete('/:id', auth, upload, stuffCtrl.deleteBook);

router.get('/bestrating',stuffCtrl.getBestRatedBook);
// GET all books
router.get('/',stuffCtrl.getAllBook);
// GET a single book (ID)
router.get('/:id',stuffCtrl.getOneBook);


// router.get('/bestrating',stuffCtrl.getBestRatedBook); not working here must be above other get router

module.exports = router;