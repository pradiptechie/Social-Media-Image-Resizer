const express = require('express')
const app = express()
const port = 3400

const bodyParser = require ('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname)); // Serve static files, including uploaded images

const multer = require('multer');
const upload = new multer ();

const sharp = require('sharp');
const fs = require('fs');

app.set('view engine', "hbs"); //setting view engine


app.get('/', (req, res) => {
    res.render('main');
})

app.post('/', upload.single('mainImage'), (req, res) => {

    const height = Number(req.body.height);
    const width = Number(req.body.width);
    console.log(`Target Height: ${height}`);
    console.log(`Target width: ${width}`);
    // req.file contains the uploaded image as a buffer
  const imageBuffer = req.file.buffer;
  console.log(imageBuffer);

    sharp(imageBuffer)
    .metadata()
    .then(metadata => {
        if (!metadata.width) {
        throw new Error('Image width not found.');
        }

        const originalWidth = metadata.width;
        console.log(`Original Width: ${originalWidth}`);
        // Define aspect ratio and dimensions
        const aspectRatio = width / height;
        console.log(`Aspect Ratio: ${aspectRatio}`);
        
        const targetHeight = Math.round(originalWidth / aspectRatio); // Calculate height
        console.log(`Calculated Height: ${targetHeight}`);
        // console.log(imageBuffer);

        console.log(`===================================================`);

        sharp(imageBuffer)
        .resize(originalWidth, targetHeight)
        .png()
        .toBuffer()
            .then((processedImage) => {
                // Set the content type to display the image
                res.set('Content-Type', 'image/png');
                res.end(processedImage);
            }).catch((error) => {
                console.error('Error:', error);
                res.status(500).send('Image processing error');
            });
    });
      
  
});


app.listen(port, () => console.log(`Server listening on port ${port}!`))