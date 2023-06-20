var express = require('express');
var router = express.Router(); 
var AdminController    =  require('../controllers/admin/AdminController');   
var UsersController    =  require('../controllers/admin/UsersController');   

/** Routes for admin  */     
router.get('/login', AdminController.login);     
router.post('/admin/login', AdminController.login);     
router.get('/admin/login', AdminController.login);     
router.get('/admin/Dashboard/:id', requiredAuthentication, AdminController.dashboard);  
router.get('/admin/logout', AdminController.logout);   
router.get('/admin/spaces', AdminController.getspaces);

router.get('/admin/Index', requiredAuthentication, AdminController.index); 
router.get('/admin/Planification',requiredAuthentication, AdminController.planification); 
router.get('/admin/Planificationtype',requiredAuthentication, AdminController.planificationtype); 

router.post('/admin/Savezone/:id', requiredAuthentication,  AdminController.savezone);

router.post('/admin/Savespace', requiredAuthentication,AdminController.savespace);

router.post('/admin/Saveplanification', requiredAuthentication,  AdminController.saveplanification);
router.post('/admin/Saveplanificationtype', requiredAuthentication,  AdminController.saveplanificationtype);
router.get('/admin/Listzone/:id', requiredAuthentication,  AdminController.listzone);
router.get('/admin/Listallzone', requiredAuthentication,  AdminController.listallzone);

router.get('/admin/Detailzone/:id', requiredAuthentication,  AdminController.detailzone);
router.get('/admin/Listplanification/:id', requiredAuthentication,  AdminController.listplanification);
router.get('/admin/Listplanificationtype/:id', requiredAuthentication,  AdminController.listplanificationtype);

router.get('/admin/ListTypeEspaces', requiredAuthentication,  AdminController.listTypeEspaces);



/** Routes for users module  */ 
router.get('/admin/Users/list',requiredAuthentication,  UsersController.list);     
router.get('/admin/Users/edit/:id', requiredAuthentication, UsersController.edit);     
router.post('/admin/Users/edit/:id',requiredAuthentication,  UsersController.edit); 
router.post('/admin/Users/add',requiredAuthentication, UsersController.add); 
router.get('/admin/Users/add', requiredAuthentication, UsersController.add); 
router.get('/admin/Users/delete/:id', requiredAuthentication, UsersController.deleteRecord);


module.exports = router;        
 

function requiredAuthentication(req, res, next) { 
    if(req.session){
        LoginUser = req.session.LoginUser; 
        if(LoginUser){    
            next();   
        }else{
            res.redirect(nodeAdminUrl+'/login');       
        } 
    }else{
        res.redirect(nodeAdminUrl+'/login');       
    }
}