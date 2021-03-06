const express = require('express')
const fs = require('fs')
const sanitizer = require('sanitizer');
const striptags = require('striptags');
const fileUpload = require('express-fileupload');
const cors = require('cors')

const app = express()

app.use(
    express.json(), //return json data
    express.static("src/front-end"), //specify static folder
    express.static('src/api/public'), //specify another static folder
    fileUpload(), //allow file upload
    cors() //Allow requests for all origins
)

/* front-end - Read - GET method */
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

    //Generate slug field
    inputData.slug = toSEOString(inputData.name)

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
        //request file
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



    //check if the inputData fields are missing or empty
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

    //Generate link
    const linkSelf = req.protocol+'://'+req.get('host')+req.originalUrl

    //Generate image link from image stored in server
    const linkImage = (req.protocol+'://'+req.get('host')+req.originalUrl).slice(0, -13)
    
    //Formated response 
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



/* Read one - GET method - get register by id or slug */
app.get('/api/products/:id', (req, res) => {

    //get the id from url
    const id = sanitize(req.params.id);

    //get the existing product data
    const existRegister = getData().data

    let findExist = '';
    //If is number, search by id, else, search by slug
    if(isNaN(id)){
        //check if the slug exist
        findExist = existRegister.find( register => register.slug == id )
    }
    else{
        //check if the id exist
        findExist = existRegister.find( register => register.id == id )
    }

    if (findExist) {
        const data =  JSON.parse(JSON.stringify({"data": [findExist]}))
        res.send(data)
    }
    else{
        return res.status(404).send(
            {
                message: 'The product with id or slug '+id+' not exist'
            }
        )
    }

})






/* Update - PUT method */
app.put('/api/products/:id', (req, res) => {
    //get the id from url
    const id = sanitize(req.params.id);

    //create product object for fields
    let inputData = {}

    //get the existing product data
    const existRegister = getData().data

    //check if the id exist or not       
    const findExist = existRegister.find( register => register.id == id )
    if (!findExist) {
        return res.status(404).send(
            {
                message: 'The product with id '+id+' not exist'
            }
        )
    }
    //filter the products
    const updateData = existRegister.filter( register => register.id != id )

    //set the id to the previously defined id
    inputData.id = findExist.id;

    //catch data registred and compare with data from put request
    if(findExist.name == req.body.name){
        inputData.name = findExist.name;
    }
    else{
        inputData.name = sanitize(req.body.name);
    }

    //Generate slug field with name
    inputData.slug = toSEOString(inputData.name)


    if(findExist.price == req.body.price){
        inputData.price = findExist.price;
    }
    else{
        //Define format of Float(Double) type
        inputData.price = parseFloat(sanitize(req.body.price))
    }

    if(findExist.description == req.body.description){
        inputData.description = findExist.description;
    }
    else{
        inputData.description = sanitize(req.body.description);
    }
    

    inputData.created = findExist.created;
    inputData.updated = getDateTime();


    if(req.files == null || req.files == ''){
        inputData.image = findExist.image;

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
   


    //push the updated data
    updateData.push(inputData)
    //finally save it in file
    saveData(updateData) 

    const linkSelf = (req.protocol+'://'+req.get('host')+req.originalUrl).slice(0, -14);
    const linkImage = linkSelf.slice(0, -13)

    res.status(200).send(
        {
            id: inputData.id, 
            message: ''+inputData.name+' product has been successfully updated',
            self: linkSelf+'/'+inputData.id,
            image: linkImage+'/images/'+inputData.id+'.jpg'
        }
    )
})






/* Delete - Delete method */
app.delete('/api/products/:id', (req, res) => {
    
    const id = sanitize(req.params.id);
    
    //get the existing product
    const existRegister = getData().data
    //filter the product data to remove it
    const filterData = existRegister.filter( register => register.id != id )
    if ( existRegister.length === filterData.length ) {
        return res.status(404).send(
            {
                message: 'Product does not exist'
            }
        )
    }

    const findExist = existRegister.find( register => register.id == id);

    //Remove image from server 

    imageToDelete = 'src/api/public/'+findExist.image

    try {
        fs.unlinkSync(imageToDelete)
        //file removed
    } catch(err) {
        console.error(err)
    }
    

    //save the filtered data
    saveData(filterData)

    res.status(204).send(
        {

        }
    )
    
})








/* util functions */

//save the Product data to json file
const saveData = (data) => {
    //format object to JSON data 
    const stringifyData = JSON.stringify({"data": data})
    const targetDir = 'src/api/json-files/products.json'
    //write data in file
    fs.writeFileSync(targetDir, stringifyData)
}

//get the Product data from json file
const getData = () => {
    const targetDir = 'src/api/json-files/products.json'
    //read data from file
    const jsonData = fs.readFileSync(targetDir)
    //covert JSON data in object
    return JSON.parse(jsonData)
}


//get current date in timestamp format
const getTimestamp = () => {
    let dt = new Date();
    return dt.getTime();
}

//get current date in usual format
const getDateTime = () => {

    let dt = new Date();

    year  = dt.getFullYear();
    month = (dt.getMonth() + 1).toString().padStart(2, "0");
    day   = dt.getDate().toString().padStart(2, "0");
    hour   = dt.getHours().toString().padStart(2, "0");
    minute   = dt.getMinutes().toString().padStart(2, "0");
    second   = dt.getSeconds().toString().padStart(2, "0");

    return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
}

//save image file in server folder
const saveImage = (file, path) => {
    // Use the mv() method to place the file somewhere on your server
    try{
        file.mv(path);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}


//verify if value (string) is empty
function empty(string){
    //Force convert to string
    string = String(string);
    //Remove extra white spaces
    string = string.replace(/\s{2,}/g, '');

    if(string == null || string == ''){
        return true
    }
    else{
        return false
    }
}

//remove HTML tags and convert to plain text
function sanitize(value){
    value = striptags(value)
    value = sanitizer.sanitize(value)
    value = sanitizer.escape(value)
    //remove extra white spaces
    value = value.replace(/\s+/g, ' ').trim()
    return value
  }



  function toSEOString(string) {      
    // make the url lowercase         
    let encodedString = string.toString().toLowerCase(); 
    // replace & with and           
    encodedString = encodedString.split(/\&+/).join("-and-")
    // remove invalid characters 
    encodedString = encodedString.split(/[^a-z0-9]/).join("-");       
    // remove duplicates 
    encodedString = encodedString.split(/-+/).join("-");
    // trim leading & trailing characters 
    encodedString = encodedString.trim('-');  
    return encodedString; 
  }

/* util functions ends */



//configure the server port
var listener = app.listen(3000, function(){
    console.log('Listening on port ' + listener.address().port); 
});