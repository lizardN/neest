var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Cart = require('../models/cart');
var Dispatch = require('../models/dispatch');
var Category = require('../models/stock');
var nodemailer = require('nodemailer');
var Product = require('../models/product');
var Sales = require('../models/sales');
var Preset = require('../models/preset');
var ShopStock = require('../models/shopStock');
var QStats = require('../models/qtyStats');
var PStats = require('../models/productStats');
var Message = require('../models/message');
var Recepient = require('../models/recepients');
var Time = require("intl-relative-time-format");
var CStats = require('../models/categoryStats');
var IncStats = require('../models/incomeStats');
var Shop = require('../models/shop');
var Stock = require('../models/stock');
var Note = require('../models/note');
var SalesStats= require('../models/salesStats');
const keys = require('../config1/keys')
const stripe = require('stripe')('sk_test_IbxDt5lsOreFtqzmDUFocXIp0051Hd5Jol');
var xlsx = require('xlsx')
var multer = require('multer')
const fs = require('fs')
var path = require('path');
var passport = require('passport');
var moment = require('moment')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";






router.get('/dispatch',isLoggedIn,function(req,res){
  var pro = req.user
  var successMsg = req.flash('success')[0];
  res.render('product/dispatch',{pro:pro,successMsg: successMsg, noMessages: !successMsg})
})

/*
router.post('/dispatch',isLoggedIn, function(req,res){
  var pro = req.user
  var barcodeNumber = req.body.barcodeNumber;
  var name = req.body.name;
  var m = moment()
  var year = m.format('YYYY')


var month = m.format('MMMM')

var mformat = m.format("L")
  var dateValue = m.valueOf()
  var date = m.toString()
  var dispatcher = req.user.fullname
  var category = req.body.category
  var cases = req.body.cases
  var unitCases = req.body.unitCases
  var casesDispatched = req.body.casesDispatched
  var shop = req.body.shopName
  var customer = req.body.customer
  var user = req.user.role
var numDate = m.valueOf()
var arr= ['months']
console.log(unitCases,casesDispatched,'why')
var quantity = unitCases * casesDispatched

  req.check('barcodeNumber','Enter Barcode Number').notEmpty();
  req.check('name','Enter Product Name').notEmpty();
  req.check('shopName','Enter Shop Name').notEmpty();
  req.check('casesDispatched','Enter Number of Cases To Be Dispatched').notEmpty();
 
  

  
  
  var errors = req.validationErrors();
   
  if (errors) {

    req.session.errors = errors;
    req.session.success = false;
    res.render('product/dispatch',{ errors:req.session.errors,pro:pro})
    
  
  }
  else{

  var book = new Dispatch();
  book.barcodeNumber = barcodeNumber
  book.category = category
  book.name = name
  book.customer = customer
  book.quantityDispatched = quantity
  book.cases = cases
  book.unitCases = unitCases
  book.casesDispatched = casesDispatched
  book.dispatcher = dispatcher
  book.casesReceived = 0
  book.status ='Pending'
  book.status2 = 'Confirm Delivery'
  book.status3 = 'No'
  book.shop = shop
  book.qtyReceived = 0
  book.quantityVariance = 0
  book.dateDispatched = date
  book.dateDispatchedValue = dateValue
  book.dateReceived = 'null'
  book.dateReceivedValue = 'null'
  book.receiver = 'null'
  book.rate = 0
  book.zwl = 0
  book.price = 0
  book.mformat = mformat
  book.month = month
  book.year = year 
      
       
        book.save()
          .then(pro =>{


           /* Stock.find({barcodeNumber:barcodeNumber},function(err,docs){
              let id = docs[0]._id
               
              nqty =  docs[0].quantity - pro.quantityDispatched 
              console.log(nqty,'nqty')*/
             /* Stock.findByIdAndUpdate(id,{$set:{quantity:nqty}},function(err,nocs){
 
              })*/


            /*  Product.find({barcodeNumber:barcodeNumber},function(err,focs){
                let idN = focs[0]._id
                 
                rqty =  focs[0].cases - pro.casesDispatched 
               let quantity = rqty * focs[0].unitCases
                Product.findByIdAndUpdate(idN,{$set:{cases:rqty,quantity:quantity}},function(err,vocs){
   
                })

              User.find({customer:customer, shop:shop},function(err,ocs){
  
                for(var i = 0; i<ocs.length;i++){
                
            
            
    let id = ocs[i]._id
    var not = new Note();
    not.role = 'admin'
    not.subject = 'Incoming Delivery';
    not.message = 'Incoming Delivery for'+" "+name
    not.examLink = 'null'
    not.status = 'not viewed';
    not.status1 = 'new';
    not.user = user;
    not.quizId = 'null'
    not.type = 'exam'
    not.status2 = 'new'
    not.status3 = 'new'
    not.status4 = 'null'
    not.date = m

    not.dateViewed = 'null'
    not.recId = ocs[i]._id
    not.recRole = 'merchant'
    not.senderPhoto = 'propic.jpg'
    not.numDate = numDate
             
  
               
          
              not.save()
                .then(user =>{
                  
            })
          }
        })
 
             
            })
          
          /*  req.session.message = {
              type:'success',
              message:'Product added'
            }  
            res.render('product/dispatch',{message:req.session.message,pro:pro});*/
          
        
     /*   })
     
res.redirect('/ship/dispatch')
}
})*/



router.post('/dispatch',isLoggedIn, function(req,res){
  var pro = req.user
  var barcodeNumber = req.body.barcodeNumber;
  var name = req.body.name;
  var m = moment()
  var year = m.format('YYYY')


var month = m.format('MMMM')

var mformat = m.format("L")
  var dateValue = m.valueOf()
  var date = m.toString()
  var dispatcher = req.user.fullname
  var category = req.body.category
  var cases = req.body.cases
  var unitCases = req.body.unitCases
  var casesDispatched = req.body.casesDispatched
  var shop = req.body.shopName
  var customer = req.body.customer
  var user = req.user.role
var numDate = m.valueOf()
var arr= ['months']
console.log(unitCases,casesDispatched,'why')
var quantity = unitCases * casesDispatched

  req.check('barcodeNumber','Enter Barcode Number').notEmpty();
  req.check('name','Enter Product Name').notEmpty();
  req.check('shopName','Enter Shop Name').notEmpty();
  req.check('casesDispatched','Enter Number of Cases To Be Dispatched').notEmpty();
 
  

  
  
  var errors = req.validationErrors();
   
  if (errors) {

    req.session.errors = errors;
    req.session.success = false;
   // res.render('product/dispatch',{ errors:req.session.errors,pro:pro})

   req.flash('success', req.session.errors[0].msg);
       
        
   res.redirect('/ship/dispatch');
    
  
  }
  else{
    Shop.findOne({'customer':customer,'name':shop})
    .then(loc=>{
     console.log(loc,'loc')
      Product.findOne({'name':name})
    .then(hoc=>{

      if(hoc && loc){

    
  var book = new Dispatch();
  book.barcodeNumber = barcodeNumber
  book.category = category
  book.name = name
  book.customer = customer
  book.quantityDispatched = quantity
  book.cases = cases
  book.unitCases = unitCases
  book.casesDispatched = casesDispatched
  book.dispatcher = dispatcher
  book.casesReceived = 0
  book.status ='Pending'
  book.status2 = 'Confirm Delivery'
  book.status3 = 'No'
  book.shop = shop
  book.qtyReceived = 0
  book.quantityVariance = 0
  book.dateDispatched = date
  book.dateDispatchedValue = dateValue
  book.dateReceived = 'null'
  book.dateReceivedValue = 'null'
  book.receiver = 'null'
  book.rate = 0
  book.zwl = 0
  book.price = 0
  book.mformat = mformat
  book.month = month
  book.year = year 
      
       
        book.save()
          .then(pro =>{


           /* Stock.find({barcodeNumber:barcodeNumber},function(err,docs){
              let id = docs[0]._id
               
              nqty =  docs[0].quantity - pro.quantityDispatched 
              console.log(nqty,'nqty')*/
             /* Stock.findByIdAndUpdate(id,{$set:{quantity:nqty}},function(err,nocs){
 
              })*/


              Product.find({barcodeNumber:barcodeNumber},function(err,focs){
                let idN = focs[0]._id
                 
                rqty =  focs[0].cases - pro.casesDispatched 
               let quantity = rqty * focs[0].unitCases
                Product.findByIdAndUpdate(idN,{$set:{cases:rqty,quantity:quantity}},function(err,vocs){
   
                })

              Preset.find({customer:customer, shop:shop},function(err,ocs){
  
                for(var i = 0; i<ocs.length;i++){
                
            
            
    let id = ocs[i].userId
    var note = new Note();
    note.role = 'dispatcher'
    note.subject = 'Incoming Delivery';
    note.message = casesDispatched+" "+'cases dispatched of'+" "+name+" "+'to your shop'
    note.customer = customer
    note.shop = shop
    note.status = 'not viewed';
    note.status1 = 'new';
    note.user = user;
    
    note.type = 'dispatch'
    note.status2 = 'new'
    note.status3 = 'new'
    note.status4 = 'null'
    note.date = m

    note.dateViewed = 'null'
    note.recId = ocs[i].userId
    note.recRole = 'merchant'
    note.senderPhoto = req.user.photo
    note.numDate = numDate
             
  
               
          
              note.save()
                .then(user =>{
                 
           
            })
   
          }

          User.find({role:'admin'},function(err,vocs){
  
            for(var i = 0; i<vocs.length;i++){
            
        
        
  let idN = vocs[i]._id
  var not = new Note();
  not.role = 'dispatcher'
  not.subject = 'Stock Dispatched';
  not.message = casesDispatched+" "+'cases dispatched of'+" "+name+" "+'on'+" "+date
  not.status = 'not viewed';
  not.status1 = 'new';
  not.user = dispatcher;
  not.type = 'dispatch'
  not.status2 = 'new'
  not.status3 = 'new'
  not.status4 = 'null'
  not.date = m
  not.dateViewed = 'null'
  not.recId = vocs[i]._id
  not.recRole = 'admin'
  not.senderPhoto = req.user.photo
  not.numDate = numDate
  not.customer = 'null'
  not.shop = 'null'
  
           
      
          not.save()
            .then(user =>{
     
        })
  
      }
    })
        })


      
             
            })
          
          /*  req.session.message = {
              type:'success',
              message:'Product added'
            }  
            res.render('product/dispatch',{message:req.session.message,pro:pro});*/
          
        
       })
       res.redirect('/ship/dispatch')

      }else{
        req.flash('success', 'Check Typo for ProductName, Customer & Shop!');
 
      
        res.redirect('/ship/dispatch');
      }
})
})
}
   
})



router.get('/viewDispatch',isLoggedIn, (req, res) => {
  var pro = req.user
  Dispatch.find({},(err, docs) => {
      if (!err) {
          res.render("product/dispatchList", {
             list:docs,pro:pro
            
          });
      }
  });
  });


  router.get('/updateDispatch',isLoggedIn, (req, res) => {
    var pro = req.user
    var m = moment()
    var year = m.format('YYYY')
    var dateValue = m.valueOf()
    var mformat = m.format("L")
    var date = m.toString()
    Dispatch.find({mformat:mformat,status:"Pending"},(err, docs) => {
        if (!err) {
            res.render("product/listChange2", {
               list:docs,pro:pro
              
            });
        }
    });
    });


    router.post('/updateDispatch/:id',isLoggedIn,function(req,res){
      var id = req.params.id
      var quantity = req.body.code
      var m = moment()
      var year = m.format('YYYY')
      var dateValue = m.valueOf()
      var mformat = m.format("L")
      let reg = /\d+\.*\d*/g;
    
      let result = quantity.match(reg)
      let updatedQuantity = Number(result)
    
     
      
      Dispatch.findById(id,function(err,doc){
        let barcodeNumber = doc.barcodeNumber
        let oldQty = doc.casesDispatched
        Product.find({barcodeNumber:barcodeNumber},function(err,locs){
      //let nqty = locs[0].quantity + oldQty
   let nqty = locs[0].cases + oldQty
   let nqty2 = nqty - updatedQuantity
      let proId =  locs[0]._id
let quantity = nqty2 * locs[0].unitCases
let dispatchedQuantity = updatedQuantity * locs[0].unitCases
          Product.findByIdAndUpdate(proId,{$set:{ cases:nqty2, quantity:quantity}},function(err,koc){


if(!err){
  Dispatch.findByIdAndUpdate(id,{$set:{casesDispatched:updatedQuantity,quantityDispatched:dispatchedQuantity}},function(err,locs){
        
  })
}
          
          })

        })
      })
     
    
    
    })
    
    
  




router.post('/fill',function(req,res){

  console.log(req.body.value)
      var customer = req.body.value
  Shop.find({customer:customer},function(err,docs){
    console.log(docs,'data')
  
      if(docs == undefined){
          res.redirect('/')
         }else
        
           res.send(docs)
  
  })
  
  })
  

  router.post('/fillX',function(req,res){

    console.log(req.body.value)
        var category = req.body.value
    Product.find({category:category},function(err,docs){
    
        if(docs == undefined){
            res.redirect('/')
           }else
          
             res.send(docs)
    
    })
    
    })
    
  






      
  //Autocomplete for customer
  router.get('/autocomplete/',isLoggedIn, function(req, res, next) {
    var id = req.user._id

      var regex= new RegExp(req.query["term"],'i');
     
      var shopFilter =Shop.find({customer:regex},{'customer':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
      shopFilter.exec(function(err,data){
     
   
    console.log('data',data)
    
    var result=[];
    
    if(!err){
       if(data && data.length && data.length>0){
         data.forEach(shop=>{
         let customer = shop.customer
          User.findByIdAndUpdate(id,{$set:{autoCustomer:customer}},function(err,docs){

          })
       
    
            
           let obj={
             id:shop._id,
             label: shop.customer
  
         
       
         
           
            
    
             
           };
          
           result.push(obj);
        
         
         });
    
       }
     
       res.jsonp(result);
  
      }
    
    })
   
    });
  

//this route autopopulates info of the customer
    router.post('/auto',isLoggedIn,function(req,res){
        var code = req.body.code

    
        
       
        Shop.find({customer:code},function(err,docs){
       if(docs == undefined){
         res.redirect('/')
       }else
      
          res.send(docs[0])
        })
      
      
      })
 
      

  //Autocomplete for Shop
  router.get('/autocompleteX/',isLoggedIn, function(req, res, next) {
    var id = req.user._id
    var customer = req.user.autoCustomer

      var regex= new RegExp(req.query["term"],'i');
     
      var shopFilter =Shop.find({customer:customer, name:regex},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
      shopFilter.exec(function(err,data){
     
   
    console.log('data',data)
    
    var result=[];
    
    if(!err){
       if(data && data.length && data.length>0){
         data.forEach(shop=>{
   

   
       
    
            
           let obj={
             id:shop._id,
             label: shop.name
  
         
       
         
           
            
    
             
           };
          
           result.push(obj);
        
          })
      
    
       }
     
       res.jsonp(result);
  
      }
    
    })
   
    });
  
 
//this route shop
    router.post('/autoShop',isLoggedIn,function(req,res){
        var code = req.body.code
        console.log(code,'code')
        var customer = req.user.autoCustomer

    
        
       
        Shop.find({customer:customer,name:code},function(err,docs){
       if(docs == undefined){
         res.redirect('/')
       }else

          res.send(docs[0])
        })
      
      
      })
 




   //autocomplete product
   router.get('/autocompleteProduct/',isLoggedIn, function(req, res, next) {
    var id = req.user._id

      var regex= new RegExp(req.query["term"],'i');
     
      var stockFilter =Product.find({name:regex},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
     stockFilter.exec(function(err,data){
     
   
    console.log('data',data)
    
    var result=[];
    
    if(!err){
       if(data && data.length && data.length>0){
         data.forEach(pro=>{
       
       
    
            
           let obj={
             id:pro._id,
             label: pro.name
  
         
       
         
           
            
    
             
           };
          
           result.push(obj);
        
         
         });
    
       }
     
       res.jsonp(result);
  
      }
    
    })
   
    });
  

//this route autopopulates info of the customer
    router.post('/autoProduct',isLoggedIn,function(req,res){
        var code = req.body.code

    
        
       
        Product.find({name:code},function(err,docs){
       if(docs == undefined){
         res.redirect('/')
       }else
      
          res.send(docs[0])
        })
      
      
      })
 
      

   


    
      
      
    


router.get('/nList',isLoggedIn,function(req,res){
  var id = req.user._id
  var m = moment()
  console.log(m.valueOf(),'crap')
  Note.find({recId:id},function(err,docs){
    if(!err){

   
    res.render('notList',{list:docs})

    }
  })
})

router.get('/notify/:id', isLoggedIn, function(req,res){
  var id = req.params.id
  var uid = req.user._id
  console.log(id,'id')
  var arr = []
  Note.find({recId:uid,_id:id},function(err,tocs){

let subject = tocs[0].subject
let message = tocs[0].message



    
    res.render('notView',{message:message, subject:subject})
  })

})



   

function encryptPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
  };
  
    module.exports = router;
  
    function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()) {
          return next();
      }
      else{
          res.redirect('/')
      }
    }
    
      
      