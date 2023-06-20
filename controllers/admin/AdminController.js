//var Request = require("request");  
var Users = require.main.require('./models/Users');         
const controller = 'admin';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
   
/** 
	 *  login
     *  Purpose: This function is used for login
	 *  Pre-condition:  None
	 *  Post-condition: None. 
	 *  Parameters: ,
	 *  Returns: void 
*/ 
const { body, validationResult } = require('express-validator');
//const bcrypt = require('bcrypt');

async function login(req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    req.role_id = 0;
    req.device_token = '4457544';
    req.device_type = 'ios';
    data = {};
    var action = 'login';
    errorData = {};

    if (req.session) {
        LoginUser = req.session.LoginUser;
        if (LoginUser) {
            res.set('content-type', 'text/html; charset=mycharset');
            res.redirect(nodeAdminUrl + '/index');
        }
    }

    if (req.method == "POST") {
        await Promise.all([
            body('email').notEmpty().withMessage('L\'email est obligatoire').run(req),
            body('password').notEmpty().withMessage('Le mot de passe est obligatoire').run(req),
            body('role_id').notEmpty().withMessage('Role_id est obligatoire').run(req),
            body('device_token').notEmpty().withMessage('device_token est obligatoire').run(req),
            body('device_type').notEmpty().withMessage('device_type est obligatoire').run(req)
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(function (errors1) {
                var field1 = String(errors1.param);
                var msg = errors1.msg;
                errorData[field1] = msg;
            });
            data.email = input.email;
            data.password = input.password;
            res.set('content-type', 'text/html; charset=mycharset');
            res.render('admin/login', { page_title: "Admin - Login", data: data, errorData: errorData });
        } else {
            var email = input.email;
            var password = input.password;
            const user = await Users.findOne({ email: email });

            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.LoginUser = user;
                return res.redirect('index');
            } else {
                data.email = input.email;
                data.password = input.password;
                errorData.email = 'Identifients erronés.';
            }
            res.set('content-type', 'text/html; charset=mycharset');
            res.render('admin/login', { page_title: "Admin - Login", data: data, errorData: errorData, controller: controller, action: action });
        }

    } else {
        res.set('content-type', 'text/html; charset=mycharset');
        res.render('admin/login', { page_title: "Admin - Login", data: data, errorData: errorData });
    }
}
exports.login = login;
/** 
 *  dashboard
 *  Purpose: This function is used to show dashboard
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function dashboard(req, res) {  
    res.set('content-type' , 'text/html; charset=mycharset'); 
    var action = 'login';
    const Spaces = require('../../models/Spaces');
    const TypeEspace = require('../../models/TypeEspace');
    const typeEspaces = await TypeEspace.find({}); 
    const  espaceId = req.params.id; 
    
    const Space = await Spaces.findOne({ _id: espaceId }).exec();


    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    console.log(espaceId);
    console.log(Space);
    res.render('admin/dashboard',{titreespace:Space.titre,typeEspaces:typeEspaces,espaceId:espaceId,page_title:"Admin - Dashboard",data:data,LoginUser:LoginUser,controller:controller,action:action});   
    
};  
exports.dashboard = dashboard;

/** 
 *  index
 *  Purpose: This function is used to show index
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function index(req, res) {  
   
    var action = 'login';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    res.render('admin/index',{page_title:"Admin - accueil",data:data,LoginUser:LoginUser,controller:controller,action:action});   
    
};  
exports.index = index;


/** 
 *  planification
 *  Purpose: This function is used to show planification
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function planification(req, res) {  

    var action = 'login';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    res.render('admin/planification',{page_title:"Admin - planification",data:data,LoginUser:LoginUser,controller:controller,action:action});   
    
};  
exports.planification = planification;


/** 
 *  planification
 *  Purpose: This function is used to show planificationtype
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function planificationtype(req, res) {  

    var action = 'login';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    res.render('admin/planificationtype',{page_title:"Admin - planificationtype",data:data,LoginUser:LoginUser,controller:controller,action:action});   
    
};  
exports.planificationtype = planificationtype;


/** 
 *  listzone
 *  Purpose: This function is used to show listzone
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
const Zones = require('../../models/Zones.js'); // Assurez-vous de spécifier le bon chemin vers votre modèle Zones

async function listzone(req, res) {
    try {
      const { espaceId } = req.params.id;; // Récupérez l'ID de l'espace à partir de req.params
  
      const zoneData = await Zones.find({ space: req.params.id }); // Utilisez l'ID de l'espace dans la requête pour filtrer les zones correspondantes

     // console.log(req.params.id);
      res.status(200).json(zoneData);
    } catch (error) {
      console.error('Erreur lors de la récupération des zones:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des zones' });
    }
  }
  
exports.listzone = listzone;



async function listallzone(req, res) {
    try {
  
      const zoneData = await Zones.find({ }); // Utilisez l'ID de l'espace dans la requête pour filtrer les zones correspondantes

     // console.log(req.params.id);
      res.status(200).json(zoneData);
    } catch (error) {
      console.error('Erreur lors de la récupération des zones:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des zones' });
    }
  }
  
exports.listallzone = listallzone;

/** 
 *  detailzone
 *  Purpose: This function is used to get constructor detail
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function detailzone(req, res) {
    try {
      const zoneId = req.params.id;
      console.log(zoneId);
      const zone = await Zones.findById(zoneId).populate('typeespace', 'titre');
      if (!zone) {
        return res.status(404).json({ error: 'Zone introuvable' });
      }
  
      const zoneData = {
        _id: zone._id,
        titre: zone.titre,
        description: zone.description,
        plan: zone.plan,
        cells: zone.cells,
        planification: zone.planification,
        name: zone.name,
        days: zone.days,
        times: zone.times,
        color: zone.color,
        type: zone.typeespace.titre,
        createdAt: zone.createdAt // Include the creation timestamp
      };
  
      res.status(200).json(zoneData);
    } catch (error) {
      console.error('Erreur lors de la récupération des zones:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des zones' });
    }
  };
  exports.detailzone = detailzone;
   
  async function listplanificationtype(req, res) {
    try {
      const Planification = require('../../models/Planification.js'); // Assurez-vous de spécifier le bon chemin vers votre modèle Zones

      const typeId = req.params.id;
     // console.log(zoneId);
      const planification = await Planification.find({ typeEspaceId: typeId }).exec();
      //const planification = await Planification.findById(zoneId); // Utilisez la méthode findById pour récupérer la zone par son identifiant
      if (!planification) {
        return res.status(404).json({ error: 'planification introuvable' });
      }
      res.status(200).json(planification); // Envoyez les données de la zone en réponse à la requête au format JSON      } catch (error) {
    } catch (error) {
    console.error('Erreur lors de la récupération des zones:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des zones' });
  }
};          
exports.listplanificationtype = listplanificationtype;

/** 
 *  listplanification
 *  Purpose: This function is used to get constructor detail
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function listplanification(req, res) {
    try {
      const Planification = require('../../models/Planification.js'); // Assurez-vous de spécifier le bon chemin vers votre modèle Zones

      const zoneId = req.params.id;
     // console.log(zoneId);
      const planification = await Planification.find({ zoneId: zoneId }).exec();
      //const planification = await Planification.findById(zoneId); // Utilisez la méthode findById pour récupérer la zone par son identifiant
      if (!planification) {
        return res.status(404).json({ error: 'planification introuvable' });
      }
      res.status(200).json(planification); // Envoyez les données de la zone en réponse à la requête au format JSON      } catch (error) {
    } catch (error) {
    console.error('Erreur lors de la récupération des zones:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des zones' });
  }
};          
exports.listplanification = listplanification;  

/** 
 *  savezone
 *  Purpose: This function is used to submit zone datas
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: void  
*/
async function savezone(req, res) { 
    const Zones = require('../../models/Zones.js'); // Assurez-vous de spécifier le bon chemin vers votre modèle Zones
    const Spaces = require('../../models/Spaces.js');
    const spaceId = req.params.id; // Access the ID of the space from the route parameter

    //console.log("ici");
    /*var auth_token = req.headers.authtoken; 
    if(!auth_token){   	 		 
        return res.send(JSON.stringify({ 
            "status": SessionExpireStatus,
            "message": 'Session Expired.',  
        }));	  		 
    }*/
    var input = JSON.parse(JSON.stringify(req.body));

    let allCellsNonVides = true;
    input.forEach(obj => {
        if (!Array.isArray(obj.cells) || obj.cells.length === 0) {
            allCellsNonVides = false;
        }
    });

    if (!allCellsNonVides) {
        console.log("vides !");
    }else{
        const zonesData = input.map(item => ({
            titre:item.titre,
            description:item.description,
            color: item.color,
            cells:JSON.stringify(item.cells),
            typeespace:item.typeespace,
            space: spaceId // Set the space ID for each zone
          }));
          
          Zones.insertMany(zonesData, function(err, result) {
            if (err) {
              console.error('Erreur lors de l\'insertion des documents:', err);
              return;
            }
           // Update the zones array in the space document
      Spaces.findByIdAndUpdate(spaceId, { $push: { zones: { $each: result } } }, function (err, space) {
        if (err) {
          console.error('Erreur lors de la mise à jour du document Space:', err);
          return;
        }
        });

       // console.log('Espace mis à jour avec les zones');
          
            console.log('Documents insérés avec succès.');
            msg = 'Documents insérés avec succès.';
            return res.send(JSON.stringify({    
                "status": successStatus, 
                "message": msg      
            }));
          });
    }
   // req.checkBody('first_name', 'First name is required').notEmpty();
    //console.log(input);
};
exports.savezone = savezone;

const TypeEspace = require('../../models/TypeEspace');

async function listTypeEspaces(req, res) {
  try {
    const typeEspaces = await TypeEspace.find();
    res.json(typeEspaces);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des types d\'espaces :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des types d\'espaces' });
  }
}
exports.listTypeEspaces = listTypeEspaces;



const Spaces = require('../../models/Spaces');


async function getspaces(req, res) {
    try {
      const spaces = await Spaces.find();
      res.json({ status: 'success', spaces: spaces });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Une erreur s\'est produite lors de la récupération des espaces' });
    }
  }
  
  exports.getspaces = getspaces;

  
/** 
 *  savespace
 *  Purpose: This function is used to submit space datas
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: void  
*/
async function savespace(req, res) {
  try {
    const { titre, description } = req.body;

    // Vérifier si un espace avec le même titre existe déjà
    const existingSpace = await Spaces.findOne({ titre: titre });
    if (existingSpace) {
      return res.status(400).json({ message: 'Un espace avec le même titre existe déjà' });
    }

    const newSpace = new Spaces({
      titre,
      description
    });

    await newSpace.save();
    //console.log('Espace enregistré avec succès.');
    msg = 'Espace enregistré avec succès.';
    return res.send(JSON.stringify({    
        "status": successStatus, 
        "message": msg      
    }));
   // res.status(200).json({ message: 'Espace enregistré avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'enregistrement de l\'espace' });
  }
}
exports.savespace = savespace;




/** 
 *  saveplanificationtype
 *  Purpose: This function is used to submit planification times
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: void  
*/
async function saveplanificationtype(req, res) { 
    const Planification = require('../../models/Planification.js'); // Assurez-vous de spécifier le bon chemin vers votre modèle Planification

  const typeId = req.body["typeId"]; // Récupérer l'ID de la zone à partir des données du formulaire
  console.log((req.body));
  const jours = {};
  ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].forEach(jour => {
   // console.log();
    jours[jour] = req.body[`${jour}`];
  });

  const existingPlanification = await Planification.findOneAndUpdate(
    { typeEspaceId: typeId },
    { $set: { jours: JSON.stringify(jours) } },
    { new: true, upsert: true }
  );

  if (existingPlanification) {
   // console.log('Planification mise à jour:', existingPlanification);
    res.redirect('/admin/planificationtype'); // Redirection vers la page d'administration
  } else {
    console.log('Nouvelle planification créée');
    res.redirect('/admin/planificationtype'); // Redirection vers la page d'administration
  }
}
exports.saveplanificationtype = saveplanificationtype;

/** 
 *  saveplanification
 *  Purpose: This function is used to submit planification times
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: void  
*/
async function saveplanification(req, res) { 
    const Planification = require('../../models/Planification.js'); // Assurez-vous de spécifier le bon chemin vers votre modèle Planification

  const zoneId = req.body["zoneId"]; // Récupérer l'ID de la zone à partir des données du formulaire
  console.log((req.body));
  const jours = {};
  ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].forEach(jour => {
   // console.log();
    jours[jour] = req.body[`${jour}`];
  });

  const existingPlanification = await Planification.findOneAndUpdate(
    { zoneId: zoneId },
    { $set: { jours: JSON.stringify(jours) } },
    { new: true, upsert: true }
  );

  if (existingPlanification) {
   // console.log('Planification mise à jour:', existingPlanification);
    res.redirect('/admin/planification'); // Redirection vers la page d'administration
  } else {
    console.log('Nouvelle planification créée');
    res.redirect('/admin/planification'); // Redirection vers la page d'administration
  }
}
exports.saveplanification = saveplanification;
/** 
 *  logout
 *  Purpose: This function is used to logout
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function logout(req, res) {  
      
    //res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    if(req.session){
        req.session.destroy(function (err) {
            //res.redirect('/'); //Inside a callback… bulletproof!
            //res.redirect(nodeAdminUrl+'/login');  
        });  
    }else{  
        //res.redirect(nodeAdminUrl+'/login');
    }   
    res.redirect(nodeAdminUrl+'/login');   
};  
exports.logout = logout;

/**  
 *  updateBankDetail
 *  Purpose: This function is used to updateBankDetail
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: void 
*/
async function submitReview(req, res) { 
  // try {
        const { check, validationResult } = require('express-validator/check');
        var reaponseArr = '{}'; 
        var input = JSON.parse(JSON.stringify(req.body));  
        var auth_token = req.headers.authtoken; 
        //req.checkBody('contractor_id', 'contractor_id is required').notEmpty();
        req.checkBody('project_id', 'project_id is required').notEmpty();
        req.checkBody('rating', 'Rating is required').notEmpty();
        req.checkBody('reviewer_id', 'reviewer_id is required').notEmpty(); 
        //req.checkBody('review', 'review is required').notEmpty();   
        var errors = req.validationErrors();  
        if(!auth_token){   	 		 
            return res.send(JSON.stringify({ 
                "status": SessionExpireStatus,
                "message": 'Session Expired.',  
            }));	  		 
        }
        if(errors){	  		 
            return res.send(JSON.stringify({
                "status": failStatus,
                "message": errors[0].msg, 
            })); 	  		 
        }else{ 
            var respondeArray = {};
            const CheckAuthentication = await Users.CheckAuthentication(auth_token);   // Check Authentication  
            if(CheckAuthentication.length > 0){
                var constructor_id = '';
                const projectDetail = await Projects.getProjectById(input.project_id);  
                if(projectDetail.length > 0){ 
                    constructor_id = projectDetail[0].contractor_id;   
                    const checkUser = await Users.getUserByid(constructor_id);  
                    const customerDetail = await Users.getUserByid(projectDetail[0].user_id);   
                    if(checkUser.length > 0){ 

                        var reviewData = {  
                            user_id    : constructor_id,      
                            rating : input.rating,     
                            reviewer_id : input.reviewer_id, 
                            project_id : input.project_id,    
                        }; 
                        if (typeof input.review !== 'undefined' && input.review != null && input.review != '') {
                            reviewData.review = input.review;
                        } 
                        var msg =  'Review added successfully.'; 
                        var saveRecord = await Reviews.saveData(reviewData); 
                        //console.log(reviewData);      
                        if(saveRecord){ 

                            var rating = await Reviews.getOverallRating(constructor_id);               // Get avg rating 
                            var updateData = {is_rated : 1,id : input.project_id}; 
                            var rated = await Projects.updateById(updateData);                          // Update project status 
                            
                            var ratingData = {rating : parseFloat(rating).toFixed(1), user_id : constructor_id}        
                            var updateRating = await BussinessProfiles.updateRating(ratingData);      // Update overall rating  
                            
                            // Send notification to customer 
                            var notification_data = {
                                user_id : constructor_id,  
                                message : customerDetail[0].first_name+' submitted review on your project.',  
                                title : 'Review and rating.' , 
                                type : REVIEW_NOTIFICATION_TYPE,  
                                type_id : input.project_id, 
                                sender_id : input.reviewer_id 
                            }  
                            Auth.sendNotificationAndroid(notification_data,function(notificationResult){
                                //console.log(notificationResult);     
                            });   
                            return res.send(JSON.stringify({    
                                "status": successStatus, 
                                "message": msg,  
                                "data": {},          
                            })); 
                            
                        }else{
                            return res.send(JSON.stringify({ 
                                "status": failStatus,  
                                "message": 'Data could  not updated. Please try again.',
                                "data": respondeArray  
                            })); 
                        }  
                    }else{
                        return res.send(JSON.stringify({ 
                            "status": failStatus,  
                            "message": 'Invalid user_id.',
                            "data": respondeArray  
                        })); 
                    }  
                }else{
                    return res.send(JSON.stringify({ 
                        "status": failStatus,  
                        "message": 'Invalid project_id.',
                        "data": respondeArray  
                    })); 
                }
            }else{
                return res.send(JSON.stringify({ 
                    "status": failStatus,  
                    "message": 'Session expired.', 
                    "data": respondeArray   
                })); 
            }   
        } 
    // } catch (err) {
    //     return res.send(JSON.stringify({
    //         "status": failStatus,
    //         "message": err, 
    //     })); 
    // }  
    return false;  
}; 
exports.submitReview = submitReview;