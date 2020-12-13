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
    res.sendFile('src/front-end/index.html');
})



//configure the server port
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})