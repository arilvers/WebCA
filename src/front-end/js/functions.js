        //base url without final bar 
        var baseUrl = 'https://3000-c39ae4bb-c375-4cd9-a366-49e8a9fa95dc.ws-us03.gitpod.io';
        var pathAPI = '/api/products';
        var APIUrl = baseUrl+pathAPI;

        $('form').submit(false);


        $(".modal").on("hidden.bs.modal", function () {

            document.getElementById("formInsert").reset();
   
            document.getElementById("formInsertImage").reset();     
            clearModalMessage();

        }); 




        function moneyFormat(value){
           price = value.toLocaleString("en-IE", { style: "decimal" , currency:"EUR"});
           return price;
        }



        function isNotEmpty(str){
            if(str.replace(/\s/g,"") == ""){
                return false;
            }
            else{
                return true;
            }
        }


        function emptyFielsMessage(){
            var x = document.querySelectorAll(".modalResponse");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].innerHTML = '<span style="color:red;">Empty fields, please fill in all fields</span>';
            }
        }



        function defineModalMessage(message){
            var x = document.querySelectorAll(".modalResponse");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].innerHTML = message;
            }
        }



        function clearModalMessage(){
            var x = document.querySelectorAll(".modalResponse");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].innerHTML = ' ';
            }
        }


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

                                    const image = data[i].image+'?updated='+data[i].updated;
                                    tr.innerHTML = '' +
                                                '<td><img src="' + baseUrl + '/' + image + '" alt="' + data[i].name + '" class="table-image"></td>' +
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

                            const image = data[i].image+'?updated='+data[i].updated;
                            tr.innerHTML = '' +
                                           '<td><img src="' + baseUrl + '/' + image + '" alt="' + data[i].name + '" class="table-image"></td>' +
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