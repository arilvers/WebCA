const express = require('express')
const fs = require('fs')
const sanitizer = require('sanitizer');
const striptags = require('striptags');
const fileUpload = require('express-fileupload');

const app = express()



app.use(
    express.json(), //acept json data
    express.static("src/front-end"), //specify static folder
    express.static('src/api/public'), //specify static folder
    fileUpload() //allow file upload
)

/* FRONT-END - Read - GET method */
app.get('/', (req, res) => {
    res.sendFile('src/front-end/');
})



/* Create - POST method */
app.post('/api/products', (req, res) => {

    //create product object for fields
    let inputData = {}

    //Generate ID attribute
    inputData.id = getTimestamp();

    //Sanitize fields 
    inputData.name = sanitize(req.body.name);

    //Define format of Float(Double) type
    inputData.price = parseFloat(sanitize(req.body.price))

    inputData.description = sanitize(req.body.description);

    //Generate date attributes
    inputData.created = getDateTime();
    inputData.updated = 'never'; 



    if(req.files == null || req.files == ''){

        //Generate defult image named with product id
        inputData.image = 'images/'+inputData.id+'.jpg'

        //Copy default image to images folder
        fs.copyFile('src/api/public/images/dont-delete/default.jpg', 'src/api/public/'+inputData.image+'', (error) => { 
            if (error) { 
                return res.status(500).send(
                    {
                        message: 'Image not copied to server folder'
                    }
                )
            } 
        });
    }
    else{

        image = req.files.image;
        imagePath = 'src/api/public/images/'+inputData.id+'.jpg'

        //Save image in server
        const imageStored = saveImage(image, imagePath);

        if(imageStored){
            inputData.image = 'images/'+inputData.id+'.jpg'
        }
        else{
            return res.status(500).send(
                {
                    message: 'Image not uploaded'
                }
            )
        }

    }



    //check if the inputData fields are missing
    if (empty(inputData.name) || empty(inputData.price) || empty(inputData.description)) {
        return res.status(202).send(
            {
                message: 'Product data missing'
            }
        )
    }



    //get the existing product data
    const existRegister = getData().data;
    
    //check if the product exist already
    const findExist = existRegister.find(register => register.name == inputData.name)

    if (findExist) {
        return res.status(202).send(
            {
                message: 'Product already exist'
            }
        )
    }

    //append the product data
    existRegister.push(inputData)
    //save the new product data to file
    saveData(existRegister);

    const linkSelf = req.protocol+'://'+req.get('host')+req.originalUrl
    const linkImage = (req.protocol+'://'+req.get('host')+req.originalUrl).slice(0, -13)
    
    res.status(201).send(
        {
            id: inputData.id, 
            message: ''+inputData.name+' product has been successfully created',
            self: linkSelf+'/'+inputData.id,
            image: linkImage+'/images/'+inputData.id+'.jpg'
        }
    )
})



/* Read - GET method */
app.get('/api/products', (req, res) => {

    //Search for name
    if(req.query.search && req.query.search !== null){

        const search = sanitize(req.query.search).toLowerCase();
        //get the existing product data
        const existRegister = getData().data
        
        //filter the products
        const searchData = existRegister.filter( register => register.name.toLowerCase().includes(search) )


        if (searchData.length > 0) {
            res.status(200).send(searchData)
        }
        else{
            return res.status(404).send(
                {
                    message: 'Not exists products for search '+search+''
                }
            )
        }


    }
    else{
        //Get all registers
        const data = getData()
        res.status(200).send(data)
    }
})






//configure the server port
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})