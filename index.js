const express = require('express')
const app = express()
const port = 3000

const bodyParser = require ('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname)); // Serve static files, including uploaded images


const multer = require('multer');
// const upload = new multer ();
// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.set('view engine', "hbs"); //setting view engine


app.get('/', (req, res) => {
    res.render('main');
    
})

const sharp = require('sharp');

app.post('/', upload.single('mainImage'), (req, res) => {
    //body-parser le body tag vitra ko elements lai direct access garn milx, like: req.body.element-Name
    const height = Number(req.body.height);
    const width = Number(req.body.width);
    console.log(`Target Height: ${height}`);
    console.log(`Target width: ${width}`);
    
    // req.file contains the uploaded image as a buffer
    const imageBuffer = req.file.buffer;
    console.log(`imageBuffer: ${imageBuffer}`);
  
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
        console.log(`===================================================`);
      
  
      sharp(imageBuffer)
        .resize(originalWidth, targetHeight)
        .png()
        .toBuffer()
        .then((processedImage) => {
          const imageBase64 = processedImage.toString('base64');
          const dataUrl = `data:image/png;base64,${imageBase64}`;
          res.send(dataUrl);
        // console.log(`Processed Image: ${dataUrl}`);

          
        })
      .catch((err) => {
        console.log(`Processing Error: ${err}`);
        res.status(500).send('Image processing error');
      });
    });
  });

app.listen(port, () => console.log(`Server listening on port ${port}!`))