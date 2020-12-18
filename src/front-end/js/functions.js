        //base url without final bar 
        var baseUrl = 'https://3000-c39ae4bb-c375-4cd9-a366-49e8a9fa95dc.ws-us03.gitpod.io';
        var pathAPI = '/api/products';
        var APIUrl = baseUrl+pathAPI;
	    var imagesUrl = baseUrl

        //prevent form submit
        $('form').submit(false);


        //If close modal, clean all form inputs
        $(".modal").on("hidden.bs.modal", function () {

            if(document.getElementById("formInsert") !== null){
                document.getElementById("formInsert").reset();
            }

            if(document.getElementById("formUpdate") !== null){
                document.getElementById("formUpdate").reset();
            }

            if(document.getElementById("formDelete") !== null){
                document.getElementById("formDelete").reset();
            } 

            if(document.getElementById("formInsertImage") !== null){
                document.getElementById("formInsertImage").reset();
            }

            if(document.getElementById("formUpdateImage") !== null){
                document.getElementById("formUpdateImage").reset();  
            }

            clearModalMessage();

        }); 


        //Function to format money in EUR format
        function moneyFormat(value){
           price = value.toLocaleString("en-IE", { style: "decimal" , currency:"EUR"});
           return price;
        }


        //Function to verify if fields is not empty
        function isNotEmpty(str){
            if(str.replace(/\s/g,"") == ""){
                return false;
            }
            else{
                return true;
            }
        }

        //Function to return empty fields message
        function emptyFielsMessage(){
            var x = document.querySelectorAll(".modalResponse");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].innerHTML = '<span style="color:red;">Empty fields, please fill in all fields</span>';
            }
        }


        //Function to return modal messages
        function defineModalMessage(message){
            var x = document.querySelectorAll(".modalResponse");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].innerHTML = message;
            }
        }


        //Function to clear all modal messages
        function clearModalMessage(){
            var x = document.querySelectorAll(".modalResponse");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].innerHTML = ' ';
            }
        }

        //Function to generate CSS preloader
        function loadingBar(){
            const loader = `<tr>
                                    <td colspan="4">  
                                        <div style="text-align:center">Loading data...</div>
                                        <br>
                                        <div id="floatBarsG">
                                            <div id="floatBarsG_1" class="floatBarsG"></div>
                                            <div id="floatBarsG_2" class="floatBarsG"></div>
                                            <div id="floatBarsG_3" class="floatBarsG"></div>
                                            <div id="floatBarsG_4" class="floatBarsG"></div>
                                            <div id="floatBarsG_5" class="floatBarsG"></div>
                                            <div id="floatBarsG_6" class="floatBarsG"></div>
                                            <div id="floatBarsG_7" class="floatBarsG"></div>
                                            <div id="floatBarsG_8" class="floatBarsG"></div>
                                        </div>
                                    </td>
                                </tr>`
            return loader
        }


        function AddToCart(product, quantity, price, position){
            localStorage.setItem("product" + position, product);
            localStorage.setItem("quantity" + position, quantity);
            price = price * quantity;
            localStorage.setItem("price" + position, price);

            //show product name added to cart
            document.querySelector("#cartAddMessage").innerHTML = `
                Product <b>`+product+`</b> was successfully added to cart!    
                <div class="mt-3 mb-3">
                    <a href="shopping-cart.html">See products in shopping cart</a>
                </div>

                <div class="mt-3 mb-3">
                    <a href="javascript:void(0);" data-dismiss="modal" aria-label="Close">Continue shopping</a>
                </div>

            `
        }


        $("#shoppingCartMini").load("shopping-cart.html #shopping-cart");

        function reloadMiniCart(){
            setTimeout(function(){ 
                shoppingCart();
            }, 200);
            
        }




        function shoppingCart(){
            var total = 0; // Total products in LocalStorage
            var i = 0;     // positions
            var price = 0; // product price
            
            let cartItems = '';

            for(i=1; i<=99; i++){ // verify max of 99 products in localStorage
            
                var prod = localStorage.getItem("product" + i + ""); 
                if(prod != null) {	

                    cartItems += `
                            <div class="row">
                                <div class="col-12 text-sm-center col-sm-12 text-md-left col-md-6">
                                    <h5 class="product-name">
                                        `+localStorage.getItem("product" + i)+
                                    `</h5>
                                </div>
                                <div class="col-12 col-sm-12 text-sm-center col-md-4 text-md-right row">
                                    <div class="col-3 col-sm-3 col-md-6 text-md-right" style="padding-top: 5px">
                                        <h6>
                                            `+parseFloat(localStorage.getItem("price" + i)).toFixed(2)+`
                                            <span class="text-muted"> x </span>
                                        </h6>
                                    </div>
                                    <div class="col-4 col-sm-4 col-md-4">
                                        <div class="quantity">
                                            <input type="number" step="1" max="99" min="1" value="`+localStorage.getItem("quantity" + i)+`" class="qty">
                                        </div>
                                    </div>
                                    <div class="col-2 col-sm-2 col-md-2 text-right">
                                        <button type="button" class="btn btn-outline-danger btn-xs" onclick="removeFromCart(`+i+`)">
                                            <i class="fa fa-trash" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            `

                    price = parseFloat(localStorage.getItem("price" + i)); // convert price with parseFloat()
                    total = (total + price);
                }
            } 

            document.getElementById("items").innerHTML = cartItems;
            //Show total price
            document.getElementById("total").innerHTML = parseFloat(total).toFixed(2); 
        }



        function removeFromCart(i){
            window.localStorage.removeItem("product" + i);
            window.localStorage.removeItem("quantity" + i);
            window.localStorage.removeItem("price" + i);
            shoppingCart()
        }  



        async function insert(){

            let id = '';
            let status = '';
            let message = '';

            const name = document.querySelector("#insertName").value;
            const price = document.querySelector("#insertPrice").value.replace(",", "");
            const description = document.querySelector("#insertDescription").value;

            let data = new FormData()

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);

            formData = JSON.stringify(Object.fromEntries(data));

   
            if(isNotEmpty(name) && isNotEmpty(price) && isNotEmpty(description)){

                const url = APIUrl;

                await fetch(url, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                //make sure to serialize your JSON body
                body: formData

                }).then( (response) => { 

                    status = response.status;
                    data = response.json();
                    return data

                    
                }).then((data) => { 

                    message = data.message;

                    if(status == 201){

                        id = data.id;

                        defineModalMessage('<span style="color:green">product &nbsp;<b>' + name + '</b>&nbsp; has been successfully inserted</span>');
                        
                        document.querySelector("#formInsert").reset();
                        document.querySelector("#list").innerHTML = ''
    
    
                        document.querySelector("#message-alert").innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">                  
                            product <b>` + name + `</b> has been successfully inserted
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </div>`
                    }
                    else{
                        console.error(message);
                        defineModalMessage(message);  
                    }
                   


                }).catch(function(err){ 

                    console.error('Failed to insert data', err);
                    defineModalMessage('Failed to insert data, ' + err);   

                });
  


                if(document.querySelector('#insertImage').files.length > 0){  
                    
                    
                    document.querySelector("#list").innerHTML = loadingBar()

                    const image = document.querySelector('#insertImage');
    
                    let imageData = new FormData()
                    imageData.append('image', image.files[0]) 
        
    
                    await fetch(url+'/'+id, {
                        method: "put",
                        headers: {
                            'enctype': 'multipart/form-data'
                        },
        
                        
                        body: imageData
                        }).then( (response) => { 

                            status = response.status;
                            data = response.json();
                            return data
        
                            
                        }).then((data) => { 

                            message = data.message;

                             document.querySelector("#list").innerHTML = ''

                            if(status == 200 || message == 'Product data missing'){
                                document.getElementById("formInsertImage").reset(); 
                            }
                            else{
                                console.error(message);
                                defineModalMessage(message);
                            }
             
        
                        }).catch(function(err){ 
        
                            console.error('Failed update image, ' + err);
                            defineModalMessage('Failed update image, ' + err);
                        
                        });  

                }

                document.querySelector("#list").innerHTML = ''; 
                listAll();
            }
            else{

                emptyFielsMessage();

            }



        }






        async function listAll(){

            document.querySelector("#list").innerHTML = loadingBar()

            await fetch(APIUrl)
                .then(function(response){

                    let status = response.status;

                    response.json().then(function(data){

                        document.querySelector("#list").innerHTML = ' ';

                        data = data.data

                        for (i = 0; i < data.length; i++) {

                            let tr = document.createElement("tr");
                            tr.setAttribute("id", 'row-'+data[i].id);

                            const image = imagesUrl+'/'+data[i].image+'?updated='+data[i].updated;
                            tr.innerHTML = '' +
                                           '<td><img src="' + image + '" alt="' + data[i].name + '" class="table-image"></td>' +
                                           '<td>' + data[i].name + '</td>' +
                                           '<td class="hidden_in_mobile">$' + moneyFormat(data[i].price) + '</td>' +
                                           '' +
                                 

                            '<td> <a href="javascript:void(0);" class="table-icon" onclick=list("'+data[i].id+'") data-toggle="modal" data-target="#updateModal"><i class="fas fa-edit"></i></a>'  +
                            '<a href="javascript:void(0);" class="table-icon" onclick=list("'+data[i].id+'") data-toggle="modal" data-target="#deleteModal"><i class="fas fa-trash"></i></a>' +
                            '';
                            
                            document.getElementById("list").appendChild(tr);


                        }

                
                    });
                })
                .catch(function(err){ 

                    console.error('Failed retrieving information', err);
                    document.querySelector("#message-alert").innerHTML = 'Failed retrieving information, '+ err;

                 });

                document.getElementById("formSearch").reset();
        }






        async function search(){

            document.querySelector("#list").innerHTML = loadingBar()

            let search =  document.querySelector("#search").value;

            if(isNotEmpty(search)){

                search = encodeURI(search);

                await fetch(APIUrl+'?search='+search)
                    .then(function(response){

                        let status = response.status;

                        response.json().then(function(data){

                            data = data

                            document.querySelector("#list").innerHTML = ' '
             
                            if(data.length > 0){
                                
                                document.querySelector("#list").innerHTML = ' '
                                for (i = 0; i < data.length; i++) {

                                    let tr = document.createElement("tr");
                                    tr.setAttribute("id", 'row-'+data[i].id);

                                    const image = imagesUrl+'/'+data[i].image+'?updated='+data[i].updated;
                                    tr.innerHTML = '' +
                                                '<td><img src="' + image + '" alt="' + data[i].name + '" class="table-image"></td>' +
                                                '<td>' + data[i].name + '</td>' +
                                                '<td class="hidden_in_mobile">$' + moneyFormat(data[i].price) + '</td>' +
                                                '' +
                                        

                                    '<td> <a href="javascript:void(0);" class="table-icon" onclick=list("'+data[i].id+'") data-toggle="modal" data-target="#updateModal"><i class="fas fa-edit"></i></a>'  +
                                    '<a href="javascript:void(0);" class="table-icon" onclick=list("'+data[i].id+'") data-toggle="modal" data-target="#deleteModal"><i class="fas fa-trash"></i></a>' +
                                    '';

                                    document.getElementById("list").appendChild(tr);
                                }

                            }

                            else{
                                document.querySelector("#list").innerHTML = `<tr>
                                    <td colspan="4">  
                                        No search found
                                    </td>
                                </tr>`
                            }

                    
                        });
                    })
                    .catch(function(err){ 

                        console.error('Failed retrieving information', err);
                        document.querySelector("#message-alert").innerHTML = 'Failed retrieving information, '+ err;

                    });

                }
                else{

                    document.querySelector("#list").innerHTML = ''
                    listAll();
                }

                search = '';
        }





        async function list(id){

            const url = APIUrl+'/'+id;

            await fetch(url)
                .then(function(response){

                    let status = response.status;
 
                    response.json().then(function(data){         

                        data = data.data[0]


                         const createDate = data.created
                         const updateDate = data.updated
                   

                         document.querySelector("#showUpdateId").innerHTML = 'Product ID: <b>' + id + '</b>'
                         document.querySelector("#created").innerHTML = 'Created at: <b>' + createDate + '</b>'
                         document.querySelector("#updated").innerHTML = 'Updated at: <b>' + updateDate + '</b>'

                         document.querySelector("#updateId").value = id
                         document.querySelector("#updateName").value = data.name
                         document.querySelector("#updatePrice").value = moneyFormat(data.price)
                         document.querySelector("#updateDescription").value = data.description

                         document.querySelector("#showUpdateImage").src = imagesUrl+'/'+data.image+'?updated='+updateDate
                         
                         document.querySelector("#showDeleteName").innerHTML = 'Really delete product: <b>' + data.name + '</b> ?'
                         document.querySelector("#deleteId").value = id
                         document.querySelector("#deleteName").value = data.name

                        id = '';
                    });
                })
                .catch(function(err){ 

                    console.error('Failed retrieving information', err);
                    defineModalMessage('Failed retrieving information, ' + err);
                
            });

            
        }

        
        

        async function update(){

            const id = document.querySelector("#updateId").value;
            const name = document.querySelector("#updateName").value;
            const price = document.querySelector("#updatePrice").value.replace(",", "");
            const description = document.querySelector("#updateDescription").value;

            let status = '';
            let message = '';


            let data = new FormData()

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);

            formData = JSON.stringify(Object.fromEntries(data));


            if(isNotEmpty(id) && isNotEmpty(name) && isNotEmpty(price) && isNotEmpty(description)){

                const url = APIUrl+'/'+id;

                await fetch(url, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: formData
                }).then( (response) => { 

                    status = response.status;
                    data = response.json();
                    return data

                    
                }).then((data) => { 

                    message = data.message;

                    if(status == 200){
                        $('.modal').modal('hide');
                        document.querySelector("#formUpdate").reset();
                        document.querySelector("#list").innerHTML = ''; 

                        document.querySelector("#message-alert").innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">                  
                            product <b>` + name + `</b> has been successfully updated
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`
                    }
                    else{
                        console.error(message);
                        defineModalMessage(message);
                    }

                }).catch(function(err){ 

                    console.error('Failed update data, ' + err);
                    defineModalMessage('Failed update data, ' + err);
                   
                });  



                if(document.querySelector('#updateImage').files.length > 0){   
                     
                    document.querySelector("#list").innerHTML = loadingBar();
                                
                                
                    const image = document.querySelector('#updateImage');

                    let imageData = new FormData()
                    imageData.append('image', image.files[0]) 
        

                    await fetch(url, {
                        method: "put",
                        headers: {
                            'enctype': 'multipart/form-data'
                        },
  
                        body: imageData
                        }).then( (response) => { 

                            status = response.status;
                            data = response.json();
                            return data
                            
                        }).then((data) => {

                            document.querySelector("#list").innerHTML = ''
    
                            message = data.message;

                            if(status == 200 || message == 'Product data missing'){
                                document.getElementById("formUpdateImage").reset();
                            }
                            else{
                                console.error(message);
                                defineModalMessage(message);
                            }
                            
        
                        }).catch(function(err){ 
        
                            console.error('Failed update image, ' + err);
                            defineModalMessage('Failed update image, ' + err);
                        
                        });      

                      

                }

                document.querySelector("#list").innerHTML = ''; 
                listAll();

            }
            else{

                emptyFielsMessage();

            }



        }
        
        

        async function remove(){

            const id = document.querySelector("#deleteId").value;
            const name = document.querySelector("#deleteName").value;

            let status = '';

            if(isNotEmpty(id) && isNotEmpty(name)){

                const url = APIUrl+'/'+id;

                await fetch(url, {
                method: "delete"
                })
                .then( (response) => { 

                    status = response.status;

                    if(status == 204){

                        document.querySelector("#message-alert").innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">                  
                        product <b>` + name + `</b> has been successfully deleted
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>`


                        $('.modal').modal('hide');
                        document.querySelector("#formDelete").reset();

                        document.querySelector("#row-"+id).remove();
                        document.querySelector("#deleteId").value = '';
                        document.querySelector("#deleteName").value = '';

                    }
                    else{
                        console.error('Failed to delete data');
                        defineModalMessage('Failed to delete data');   
                    }


                    

                }).catch(function(err){ 

                    console.error('Failed to delete data ', err);
                    defineModalMessage('Failed to delete data, ' + err);           

                });

            }

            else{
                emptyFielsMessage();
            }
           
        }




        async function listProducts(){

            await fetch(APIUrl)
                .then(function(response){

                    response.json().then(function(data){

                        data = data.data

                        let products = '';

                        for (i = 0; i < data.length; i++) {

                            products += `
                            <div class="col-md-4">
                                <figure class="card card-product-grid card-lg"> <a href="#" class="img-wrap" data-abc="true"><img src="`+imagesUrl+'/'+data[i].image+`"></a>
                                    <figcaption class="info-wrap">
                                        <div class="row">
                                            <div class="col-md-8"> <a href="#" class="title" data-abc="true">`+data[i].name+`</a> </div>
             
                                        </div>
                                    </figcaption>
                                    <div class="bottom-wrap"> <a data-toggle="modal" data-target="#cartMessageModal" onclick="AddToCart('`+data[i].name+`', '1', '`+data[i].price+`', `+(i+1)+`)" href="javascript:void(0);" class="btn btn-primary float-right" data-abc="true"> <i class="fas fa-shopping-cart"></i> Add to cart </a>
                                        <div class="price-wrap"> <span class="price h5">$`+moneyFormat(data[i].price)+`</span> <br> <small class="text-success">Free shipping</small> </div>
                                    </div>
                                </figure>
                            </div>
                            `
                        }

                        document.getElementById("productsList").innerHTML = products;
                
                    });
                })
                .catch(function(err){ 
                    console.error('Failed retrieving information', err);
              
                 });

               
        }


        

        async function searchProducts(){

            let search =  document.querySelector("#search").value;

            if(isNotEmpty(search)){

                search = encodeURI(search);

                await fetch(APIUrl+'?search='+search)
                    .then(function(response){

                        response.json().then(function(data){

                            let products = '';

                            if(data.length > 0){
                                for (i = 0; i < data.length; i++) {

                                    products += `
                                    <div class="col-md-4">
                                        <figure class="card card-product-grid card-lg"> <a href="#" class="img-wrap" data-abc="true"><img src="`+imagesUrl+'/'+data[i].image+`"></a>
                                            <figcaption class="info-wrap">
                                                <div class="row">
                                                    <div class="col-md-8"> <a href="#" class="title" data-abc="true">`+data[i].name+`</a> </div>
                    
                                                </div>
                                            </figcaption>
                                            <div class="bottom-wrap"> <a data-toggle="modal" data-target="#cartMessageModal" onclick="AddToCart('`+data[i].name+`', '1', '`+data[i].price+`', `+(i+1)+`)" href="javascript:void(0);" class="btn btn-primary float-right" data-abc="true"> <i class="fas fa-shopping-cart"></i> Add to cart </a>
                                                <div class="price-wrap"> <span class="price h5">$`+moneyFormat(data[i].price)+`</span> <br> <small class="text-success">Free shipping</small> </div>
                                            </div>
                                        </figure>
                                    </div>
                                    `

                                }

                                document.getElementById("productsList").innerHTML = products;
                            }
                            else{
                                document.getElementById("productsList").innerHTML = '<div class="col-md-12">No product found</div>'
                            }
                    
                        });
                    })
                    .catch(function(err){ 
                        console.error('Failed retrieving information', err);
                
                    });

            }
            else{
                document.getElementById("productsList").innerHTML = '';
                listProducts()
            }

        }

        