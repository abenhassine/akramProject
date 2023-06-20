//var Request = require("request");      
//var Categories = require.main.require('./models/Categories');   
var Users = require.main.require('./models/Users');   
const controller = 'Users'; 
const module_name = 'Users'; 
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

//const SerialPort = require('serialport');

/*const port = new SerialPort('COM1', { baudRate: 9600 });

port.on('open', () => {
  console.log('Le port série est ouvert');

  port.on('data', (data) => {
    console.log('Données reçues depuis l\'Arduino:', data.toString());
  });

  // Envoi de données à l'Arduino
  const data = 'Hello Arduino!';
  port.write(data, (err) => {
    if (err) {
      console.error('Erreur lors de l\'envoi des données:', err);
    } else {
      console.log('Données envoyées à l\'Arduino:', data);
    }
  });
});

port.on('error', (err) => {
  console.error('Erreur lors de l\'ouverture du port série:', err);
});*/
/*const { SerialPort } = require('serialport');

// Créer un port série
const port = new SerialPort('COM3', {
  baudRate: 57600,
});*/

/*const SerialPort = require('virtual-serialport');
const matrix = [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1]
  ];

  const matrixString = matrix.flat().join('');
// Crée un port série virtuel
const port = new SerialPort('COM1');

// Écoute les données reçues sur le port série virtuel
port.on('data', (matrixString) => {
  console.log('Données reçues:', matrixString);
});

// Ouvre le port série virtuel manuellement
port.open((err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture du port série:', err);
  } else {
    console.log('Le port série est ouvert.');

    // Envoie des données sur le port série virtuel
    const data = '00000000111111111111111111111111111111111111111111111111111111111';
    port.write(matrixString, (err) => {
      if (err) {
        console.error('Erreur lors de l\'envoi des données:', err);
      } else {
        console.log('Données envoyées:', data);
      }
    });
  }
});*/

var  serialport = require('serialport');
//var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
//var SerialPort1 = SerialPort;

//var sp = 
//const port = new SerialPort('COM1'); // Port de votre application Node.js
const port = new SerialPort({ path: "COM1", baudRate: 9600, autoOpen: true })  
const simulidePort = new SerialPort({ path: "COM2", baudRate: 9600, autoOpen: true })  

// Écouter les données reçues depuis votre application
const dataFromApp = 'Hello, SimulIDE!'; // Remplacez cette ligne par les données à envoyer
port.write(dataFromApp, err => {
  if (err) {
    console.error('Erreur lors de l\'écriture sur le port série :', err);
  } else {
    console.log('Données envoyées avec succès vers SimulIDE');
  }
});

// Lire les données reçues depuis SimulIDE
simulidePort.on('data', data => {
  console.log('Données reçues depuis SimulIDE :', data.toString());
});

/** 
 *  list
 *  Purpose: This function is used to show listing of all arecord
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json   
*/
async function list(req, res) { 
    port.write("test", (err) => {
        if (err) {
          console.error('Erreur lors de l\'envoi des données:', err);
        } else {
          console.log('Données envoyées:', "test");
        }
      });
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {};    
    action = 'list'; 
    //const allRecord = await Users.findAll();   
    const allRecord = await Users.find({}); 
    res.render('admin/users/list',{
        page_title:" List",
        data:allRecord, 
        controller:controller, 
        action:action,
        module_name:module_name
    });    
};      
exports.list = list;
 
/** 
 *  Edit
 *  Purpose: This function is used to get constructor List
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function edit(req, res) { 
   
    res.set('content-type' , 'text/html; charset=mycharset'); 
    var action = 'edit';
    var entityDetail = {}; 
    var errorData = {};
    if(req.params.id){
        var id =  req.params.id; 
        const entityDetail = await Users.findById({_id:id});    
        if(entityDetail == 0){     
            req.flash('error', 'Invalid url')  
            return res.redirect(nodeAdminUrl+'/Users/list');  
        }     
        if (req.method == "POST") {  
            var input = JSON.parse(JSON.stringify(req.body)); 
            
            console.log(input); console.log('Here');  
            req.checkBody('first_name', 'First name is required').notEmpty();
            req.checkBody('last_name', 'Last name is required').notEmpty();  
            req.checkBody('contact_number', 'Mobile number is required').notEmpty();  
            var errors = req.validationErrors();    
            if(errors){	   
                if(errors.length > 0){
                    errors.forEach(function (errors1) {
                        var field1 = String(errors1.param); 
                        var msg = errors1.msg; 
                        errorData[field1] = msg;   
                        entityDetail.field1 = req.field1;
                    }); 
                }    
            }else{  
                var saveResult = '';  
                // Upload Image  
                if (req.files && req.files.profile_pic !== "undefined") { 
                    let profile_pic = req.files.profile_pic;  
                    var timestamp = new Date().getTime();   
                    filename = timestamp+'-'+profile_pic.name;   
                    input.profile_pic =   filename; 
                    profile_pic.mv('public/upload/'+filename, function(err) {
                        if (err){    
                            console.log(err);    
                            req.flash('error', 'Could not upload image. Please try again!')  
                            res.locals.message = req.flash();   
                            return res.redirect(nodeAdminUrl+'/Users/'+action); 
                        }     
                    });  
                }   
                var msg =  controller+' updated successfully.';  
                var saveResult = await Users.findByIdAndUpdate(req.params.id, {$set: input});  
                req.flash('success', msg)    
                res.locals.message = req.flash(); 
                if(saveResult){     
                    return res.redirect(nodeAdminUrl+'/'+controller+'/list');     
                }        
            }  
        }  
        res.render('admin/'+controller+'/edit',{page_title:" Edit",data:entityDetail,errorData:errorData,controller:controller,action:action});  
    }else{ 
        req.flash('error', 'Invalid url.');  
        return res.redirect(nodeAdminUrl+'/'+controller+'/list');     
    }   
};          
exports.edit = edit;  
 
/** 
 *  Edit
 *  Purpose: This function is used to get constructor List
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function add(req, res) { 
    
    res.set('content-type' , 'text/html; charset=mycharset'); 
    var page_title = 'Add'; 
    var errorData = {}; 
    var data = {};  
    var action = 'add'; 
    var errorData = {};    
    if (req.method == "POST") { 
        var input = JSON.parse(JSON.stringify(req.body));  
        req.checkBody('first_name', 'First name is required').notEmpty();
        req.checkBody('last_name', 'Last name is required').notEmpty();  
        req.checkBody('contact_number', 'Mobile number is required').notEmpty(); 
        req.checkBody('password', 'Password is required').notEmpty(); 
        req.checkBody('email', 'email is required').notEmpty();  
        var errors = req.validationErrors();    
        if(errors){	  
            if(errors.length > 0){
                errors.forEach(function (errors1) {
                    var field1 = String(errors1.param); 
                    console.log(errors1);
                    var msg = errors1.msg; 
                    errorData[field1] = msg;   
                    data.field1 = req.field1; 
                }); 
            }     
            data = input;   
        }else{ 
            // Upload Image 
            if (req.files && req.files.profile_pic !== "undefined") { 
                let profile_pic = req.files.profile_pic;  
                var timestamp = new Date().getTime(); 
                var imagePath = '';   
                filename = timestamp+'-'+profile_pic.name;   
                input.profile_pic =   filename; 
                profile_pic.mv('public/upload/'+filename, function(err) { 
                    if (err){    
                        console.log(err);    
                        req.flash('error', 'Could not upload image. Please try again!')  
                        res.locals.message = req.flash();   
                        return res.redirect(nodeAdminUrl+'/Users/add'); 
                    }     
                }); 
            }  
            // Decrypt password with password hash
            var salt = bcrypt.genSaltSync(saltRounds);
            var password = bcrypt.hashSync(input.password, salt);
            input.password = password;    
            
            const SaveData = new Users(input);
            var saveResult=   await SaveData.save();   
            if(saveResult){    
                req.flash('success', controller+' added successfully.')  
                res.locals.message = req.flash();  
                res.set('content-type' , 'text/html; charset=mycharset');  
                return res.redirect(nodeAdminUrl+'/'+controller+'/list');     
            }else{
                req.flash('error', 'Could not save record. Please try again')  
                res.locals.message = req.flash();  
            }
        }
    }
    res.render('admin/'+controller+'/add',{page_title:page_title,data:data, errorData:errorData,controller:controller,action:action});
};          
exports.add = add; 

/** 
 *  delete
 *  Purpose: This function is used to get constructor delete
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function deleteRecord(req, res) { 
   
    var categoryDetail = {}; 
    if(req.params.id){ 
        categoryDetail = await Users.findByIdAndRemove(req.params.id);     
        if(categoryDetail){      
            req.flash('error', 'Invalid url')  
            return res.redirect(nodeAdminUrl+'/'+controller+'/list'); 
        }else{
            req.flash('success', 'Record deleted succesfully.');    
            return res.redirect(nodeAdminUrl+'/'+controller+'/list');  
        }    
    }else{  
        req.flash('error', 'Invalid url.');   
        return res.redirect(nodeAdminUrl+'/'+controller+'/list');      
    }    
};          
exports.deleteRecord = deleteRecord;  
   
