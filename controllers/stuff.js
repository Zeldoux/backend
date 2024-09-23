const Book = require('../Models/Book');
const fs = require('fs');


exports.createBook = (req,res,next) => {
    console.log('File:', req.file); // Pour voir si le fichier est bien reçu
    console.log('Body:', req.body.book); // Pour voir si le corps de la requête est bien reçu
    const newBook = JSON.parse(req.body.book); 
    delete newBook._id;
    delete newBook._userId;
    const book = new Book({
        ...newBook,
        userId: req.auth.userId,
        imageUrl: req.body.imageUrl
    });
    console.log('newly added book userID = ' + book.userId);
    book.save()
    
    .then(() => res.status(201).json({ message: 'object registered'}))
    .catch( e => res.status(400).json({ e }));
};

exports.RateBook = ( req, res, next) => {

    //console.log("Received post request content:", JSON.stringify(req.body));
    Book.findOne({_id: req.params.id})

        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            // check if user already rated book
            const alreadyRated = book.ratings.find(rating => rating.userId === req.auth.userId);
            if (alreadyRated) {
                return res.status(401).json({ message: "User already rated this book" });
            }

            // create new object for the received new rating
            const userRating = {
                userId: req.auth.userId,
                grade: req.body.rating,
            };

            // add new rating to ratings 
            book.ratings.push(userRating);

                // calculation of the average rating 
                const totalRatings = book.ratings.length;

                const averageRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0) / totalRatings;

                book.averageRating = averageRating;

            // save change  in mongoDB
            book.save()
                .then(() => res.status(200).json({ message: 'Rating added' }))
                .catch(error => res.status(400).json({ error }));
            })
            .catch((error) => {
            res.status(400).json({ error });
            });
  };

exports.modifyBook = (req,res,next) =>{
    
    console.log("modifying book started")
    const BookObject = req.file ? { // check if req contain image
        ...JSON.parse(req.body.book), // if it exist we handle the new image
        userId: req.auth.userId,
        imageUrl: req.body.imageUrl
        
    } : { ...req.body}; //if not we retrive just the body content 

    delete BookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...BookObject, _id: req.params.id}) // book before wasn't working (was updating the instance instead of the Book.book)
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})  // find corresponding Book in DB
        .then(book => {
            if (book.userId != req.auth.userId) { // check if userID is the same between book  and client request
                res.status(401).json({message: "Not authorized"});
            } else {
                const filename = book.imageUrl.split('/images/')[1]; // cut the image URL to only retrieve 

                fs.unlink(`images/${filename}` , () =>{ // delete image from folder images with the correct images/path
                    Book.deleteOne({_id: req.params.id}) // delete from DB 
                        .then(() => { res.status(200).json({message : "Object Deleted"})})
                        .catch(e => res.status(401).json({e}));
                    })
                }
            })
        .catch(e => {
            res.status(500).json({e});
        });
};

exports.getAllBook = (req,res,next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch( e => res.status(400).json({e}));
    
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

exports.getBestRatedBook = (req, res, next) => {
    console.log('GET /bestrating route called');
    Book.find()
        .then((books) => {
            console.log('Books retrieved:', books);
            // filter book to keep only one who has averageRating
            const validBooks = books.filter(book => book.averageRating !== null);
            const bestRatedBooks = validBooks
            // sort book by average rating > (plus grand au plus petit)
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 3); // keep only the 3 first (3 best)

            
            // send 3 best book   
            res.status(200).json(bestRatedBooks);
        })
        .catch((error) => {
            console.error('Error fetching books:', error);
            res.status(400).json({ error });
        });
};