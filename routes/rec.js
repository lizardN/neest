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





router.get('/addStock',isLoggedIn,function(req,res){
  var pro = req.user
  var successMsg = req.flash('success')[0];
  res.render('product/stock',{pro:pro,successMsg: successMsg, noMessages: !successMsg})
})


router.post('/addStock',isLoggedIn, function(req,res){
  var pro = req.user
  var barcodeNumber = req.body.barcodeNumber;
  var name = req.body.name;
  var m = moment()
  var year = m.format('YYYY')
  var dateValue = m.valueOf()
  var date = m.toString()
  var numDate = m.valueOf()
var month = m.format('MMMM')

var mformat = m.format("L")
  var receiver = req.user.fullname
  var category = req.body.category
  var unitCases = req.body.unitCases
  var casesReceived = req.body.casesReceived

var quantity  = casesReceived * unitCases

  req.check('barcodeNumber','Enter Barcode Number').notEmpty();
  req.check('name','Enter Product Name').notEmpty();
  req.check('casesReceived','Enter Number of Cases').notEmpty();
 
  

  
  
  var errors = req.validationErrors();
   
  if (errors) {

    req.session.errors = errors;
    req.session.success = false;
   // res.render('product/stock',{ errors:req.session.errors,pro:pro})
   req.flash('success', req.session.errors[0].msg);
       
        
   res.redirect('/rec/addStock');
  
  }
  else

 {

  Product.findOne({'name':name})
  .then(hoc=>{

    if(hoc){
  var book = new Stock();
  book.barcodeNumber = barcodeNumber
  book.category = category
  book.name = name
  book.mformat = mformat
  book.month = month
  book.year = year 
  book.stockUpdate = 'no'
  book.receiver = receiver;
  book.date  = date
  book.dateValue = dateValue
  book.quantity = quantity
  book.unitCases = unitCases
  book.cases = casesReceived
  book.rate = 0
  book.zwl = 0
  book.price = 0
      
       
        book.save()
          .then(pro =>{

            Product.find({barcodeNumber:barcodeNumber},function(err,docs){
             let id = docs[0]._id
              let rcvdQty = pro.cases
              let openingQuantity = docs[0].cases
             //nqty = pro.quantity + docs[0].quantity
             nqty = pro.cases + docs[0].cases
             nqty2 = nqty * docs[0].unitCases
             console.log(nqty,'nqty')
             Product.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity, rcvdQuantity:rcvdQty,quantity:nqty2}},function(err,nocs){

             })

             

            })

            User.find({role:'admin'},function(err,ocs){
  
              for(var i = 0; i<ocs.length;i++){
              
          
          
  let id = ocs[i]._id
  var not = new Note();
  not.role = 'receiver'
  not.subject = 'Stock Received';
  not.message = casesReceived+" "+'cases received of'+" "+name+" "+'on'+" "+date
  not.status = 'not viewed';
  not.status1 = 'new';
  not.user = receiver;
  not.type = 'receiving'
  not.status2 = 'new'
  not.status3 = 'new'
  not.status4 = 'null'
  not.date = m
  not.dateViewed = 'null'
  not.recId = ocs[i]._id
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
          
          /*  req.session.message = {
              type:'success',
              message:'Product added'
            }  
            res.render('product/stock',{message:req.session.message,pro:pro});*/
          
        
        })
        res.redirect('/rec/addStock')
      }   else{
        req.flash('success', 'Product Does Not Exist');
 
        res.redirect('/rec/addStock');
      }
    }) 

      }
})


///////


router.get('/search',isLoggedIn,function(req,res){
  var pro = req.user
  res.render('product/search',{pro:pro})
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
    
  

    router.get('/viewStock',isLoggedIn, (req, res) => {
      var pro = req.user
      Stock.find({},(err, docs) => {
          if (!err) {
              res.render("product/productList2", {
                 list:docs,pro:pro
                
              });
          }
      });
      }); 





      router.get('/verify',isLoggedIn, (req, res) => {
        var pro = req.user
        var m = moment()
      var year = m.format('YYYY')
      var dateValue = m.valueOf()
      var mformat = m.format("L")
      var date = m.toString()
        Stock.find({mformat:mformat},(err, docs) => {
            if (!err) {
                res.render("product/listChange", {
                   list:docs,pro:pro
                  
                });
            }
        });
        }); 
  
  

     

        
        
        router.post('/verify/:id',isLoggedIn,function(req,res){
          var id = req.params.id
          var quantity = req.body.code
          var arr = []
          var m = moment()
          var year = m.format('YYYY')
          var dateValue = m.valueOf()
          var mformat = m.format("L")
          var oldQty
          let reg = /\d+\.*\d*/g;
        
          let result = quantity.match(reg)
          let rcvdQuantity = Number(result)
        /* Stock.find({barcodeNumber:barcodeNumber,mformat:mformat},function(err,joc){
              if(arr.length > 0 && arr.find(value => value.barcodeNumber == joc[i].barcodeNumber)){
                console.log('true')
               arr.find(value => value.barcodeNumber == docs[i].barcodeNumber).quantity += docs[i].quantity;
          }else{
  arr.push(joc[i])
          }
            })*/ 

            console.log(rcvdQuantity,'rcvd')

          Stock.findById(id,function(err,doc){
            let barcodeNumber = doc.barcodeNumber
           

      oldQty = doc.cases
      let quantity = doc.unitCases * rcvdQuantity

          Stock.findByIdAndUpdate(id,{$set:{cases:rcvdQuantity, quantity:quantity}},function(err,locs){
          
          })


          Stock.find({barcodeNumber:barcodeNumber,mformat:mformat},function(err,joc){
            for(var i = 0;i<joc.length;i++){

          
            if(arr.length > 0 && arr.find(value => value.barcodeNumber == joc[i].barcodeNumber)){
              console.log('true')
             arr.find(value => value.barcodeNumber ==joc[i].barcodeNumber).cases += joc[i].cases;
        }else{
arr.push(joc[i])
        }

      }


        
        Product.find({barcodeNumber:barcodeNumber},function(err,locs){
          console.log(arr[0].unitCases,'arr')
        let proId = locs[0]._id
       
       // let opQuantity = arr[0].cases - oldQty
        //let nqty  =opQuantity + rcvdQuantity
          //let nqty = opQuantity + arr[0].quantity
        //  let openingQty = nqty - arr[0].cases

         
let nqty2 = arr[0].cases * locs[0].unitCases
          Product.findByIdAndUpdate(proId,{$set:{rcvdQuantity:arr[0].cases, cases:arr[0].cases,openingQuantity:0, quantity:nqty2}},function(err,koc){

          })

        })
          })



          Dispatch.find({barcodeNumber:barcodeNumber,mformat:mformat},function(err,noc){
  if(noc){
    for(var i = 0;i<noc.length;i++){
      Dispatch.findByIdAndRemove(noc[i]._id,function(err,poc){

      })
    }
  }
})
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



   //autocomplete product
   router.get('/autocompleteProduct/',isLoggedIn, function(req, res, next) {
    var id = req.user._id

      var regex= new RegExp(req.query["term"],'i');
     
      var productFilter =Product.find({name:regex},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
      productFilter.exec(function(err,data){
     
   
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
    
      
      