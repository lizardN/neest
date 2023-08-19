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




router.get('/userUpdate',isLoggedIn,function(req,res){
  var id = req.user._id

  
  User.findByIdAndUpdate(id,{$set:{customer:'null',shop:'null',status:'null'}}, function(err,coc){
      
       
  })
  res.redirect('/merch/land')

})

router.get('/land',isLoggedIn,function(req,res){
 var userId = req.user._id
  Preset.find({userId:userId},function(err,docs){
  res.render('product/steps3',{arr:docs})

  })
})      



router.post('/land',isLoggedIn,  function(req,res){
var shop = req.body.shop;
var customer = req.body.customer
var id = req.user._id
var merchandiser = req.user.fullname



req.check('shop','Enter Name of Shop').notEmpty();
req.check('customer','Enter Customer').notEmpty();



var errors = req.validationErrors();

if (errors) {
req.session.errors = errors;
req.session.success = false;
res.render('product/steps3',{ errors:req.session.errors})

}

else 

Preset.findOne({'merchandiser':merchandiser,'customer':customer,'shop':shop})
.then(grower =>{

if(grower){


 
        User.findByIdAndUpdate(id,{$set:{customer:customer,shop:shop,status:'activated'}}, function(err,coc){
      
       
})

}
res.redirect('/merch/notUpdate')


})


})



router.get('/notUpdate',isLoggedIn,function(req,res){
  var m = moment()
  let n = m.valueOf()
  var id = req.user._id
  
  Note.find({recId:id},function(err,docs){
  
  for(var i = 0; i<docs.length;i++){
  let value = docs[i].numDate
  let num = n - value
  let nId = docs[i]._id
  
  if(num >= 86000000){
    Note.findByIdAndUpdate(nId,{$set:{status1:'old'}},function(err,nocs){
  
  
    })
  }
  
  }
  res.redirect('/merch/nots')
  
  
  })
  
  
  
  })
  
  router.get('/nots',isLoggedIn, function(req,res){
    var m = moment();
  var id = req.user._id
  var customer = req.user.customer
  var shop = req.user.shop
    Note.find({recId:id,status:'viewed',customer:customer,shop:shop},function(err,docs){
      for(var i = 0;i<docs.length;i++){
        let duration =moment(docs[i].dateViewed)
        let days=m.diff(duration,"days");
        let nId = docs[i]._id
  console.log(days,'days')
       if(days > 0){
  Note.findByIdAndUpdate(nId,{$set:{status2:'expired',status1:'old'}},function(err,nocs){
  
  })
       }
      }

      res.redirect('/merch/deliveries')
    })
  
  
  })




router.get('/deliveries',isLoggedIn, activate,function(req,res){
    var shop = req.user.shop
    var customer = req.user.customer

    var pro = req.user
    const arr = []
  const m = moment();
    var id =req.user._id

   
      
            console.log(req.user._id)
            console.log(req.user.email)
              Note.find({recId:req.user._id,customer:customer,shop:shop},function(err,docs){
                console.log(docs,'docs')
             for(var i = 0;i<docs.length;i++){
      
             
               let date = docs[i].date
               let id = docs[i]._id
               let timeX = moment(date)
               let timeX2 =timeX.fromNow()
               console.log(timeX2,'timex2')
      
               Note.findByIdAndUpdate(id,{$set:{status4:timeX2}},function(err,locs){
      
               
               
              // Format relative time using negative value (-1).
      
                
              })
            }
      
            Note.find({recId:req.user._id,status1:'new',customer:customer,shop:shop},function(err,flocs){
              var les 
           
              Note.find({recId:req.user._id,status:'not viewed',customer:customer,shop:shop},function(err,jocs){
               les = jocs.length > 0
            
              for(var i = flocs.length - 1; i>=0; i--){
          
                arr.push(flocs[i])
              }
           
    Dispatch.find({shop:shop, customer:customer,status:'Pending'},(err, mocs) => {
        if (!err) {
            res.render("merchant/list", {
               listX:mocs, pro:pro,list:arr, les:les
              
            });
        }
    });

})
              
})

})



})
  


//update subject

router.get('/deliveries/:id', activate,function(req,res){
    var pro = req.user
 Dispatch.findById(req.params.id, (err, doc) => {
   if (!err) {
   
       res.render("merchant/update", {
          
           doc: doc,pro:pro
         
           
       });
     
   }
});



})


router.post('/deliveries/:id',isLoggedIn, activate,  (req, res) => {
 var pro = req.user
 var m = moment()
 var fullname = req.user.fullname
 var year = m.format('YYYY')
 var month = m.format('MMMM')
 var dateValue = m.valueOf()
 var mformat = m.format("L")

 var date = m.toString()
 var id = req.params.id;
 var name = req.body.name;
 var shop = req.user.shop
 var customer = req.user.customer
 var category = req.body.category;
 var barcodeNumber = req.body.barcodeNumber
 var quantityDispatched = req.body.quantityDispatched
 let status3 = req.body.status3
 let status4
 var quantityReceived = req.body.quantityReceived
 var cases

        let reg = /\d+\.*\d*/g;

        let result = quantityReceived.match(reg)
        let quan = Number(result)
 var quantityVariance = quantityReceived - quantityDispatched
if(quantityDispatched > quantityReceived){
    status3 ="Flagged"
    console.log('yes')
}

if(quantityDispatched == quantityReceived){
  status4 = 'yes'
}

console.log(quantityReceived,quantityDispatched,"qtyReceived")
 req.check('name','Enter Name Of Subject').notEmpty();
 req.check('category','Enter Category').notEmpty();
 req.check('barcodeNumber','Enter Barcode Number').notEmpty();
 req.check('status3','Enter Answer').notEmpty();
 req.check('quantityReceived','Enter Quantity Delivered').notEmpty();

 
   
 var errors = req.validationErrors();



  if (errors) {
 
    
       req.session.errors = errors;
       req.session.success = false;
       res.render('merchant/update',{ errors:req.session.errors,pro:pro})
    
   
   }
 
else
{

   

        ShopStock.find({barcodeNumber:barcodeNumber,shop:shop, customer:customer},function(err,docs){
  
                if(docs.length == 0)
                {

    
           
    
                    var pass =ShopStock();
                    pass.barcodeNumber = barcodeNumber;
                    pass.name = name
                    pass.category= category;
                    pass.date = date
                    pass.dateValue = dateValue
                    pass.updateDate='null'
                    pass.updateDateValue = 0
                    pass.stockUpdate = 'no'
                    pass.openingQuantity=quantityReceived;
                    pass.currentQuantity = quantityReceived;
                    pass.receiver = fullname;
                    pass.customer = customer;
                    pass.shop = shop;
                    pass.rate = 0
                    pass.zwl = 0
                    pass.price = 0
                    pass.month = month
                    pass.mformat = mformat
                    pass.year = year
                    pass.cases = 0
        
                    pass.save()
            .then(pas =>{

            })
        }
        else{
            var  idX  = docs[0]._id
            console.log(idX)
            let openingQuantity = docs[0].currentQuantity
            var xquant = docs[0].currentQuantity + quan
            console.log(xquant,'xquant')
            ShopStock.findByIdAndUpdate(idX,{$set:{currentQuantity:xquant,openingQuantity:openingQuantity,stockUpdate:"no"}},function(err,locs){

            })
        }
       Dispatch.findById(id,function(err,noc){
         let unitCases = noc.unitCases
         cases = quantityReceived / unitCases
        Dispatch.findByIdAndUpdate(id,{$set:{status:status3,status3:status4,qtyReceived:quantityReceived, quantityVariance:quantityVariance, casesReceived:cases,dateReceived:date,dateReceivedValue:dateValue}},function(err,locs){
if(!err){
  ShopStock.findByIdAndUpdate(idX,{$set:{cases:cases}},function(err,locs){

  })
}
        })
      })
      
            })

res.redirect('/merch/deliveries')
   
}

});





router.post('/inlineX/:id',function(req,res){
  var org = req.body.code
  console.log(org,'org')
  var id = req.params.id
  var arr = ['win','win']
  let reg = /\d+\.*\d*/g;

  let result = org.match(reg)
  let code = Number(result)

  Dispatch.findByIdAndUpdate(id,{$set:{quantity:code}},function(err,docs){

   
  })

  res.send(arr)

})


/*
router.get('/update',isLoggedIn,function(req,res){
    var shop = req.user.shop
    var customer = req.user.customer
    res.render('merchant/stockUpdate',{shop:shop,customer:customer})
})


router.post('/update',isLoggedIn,function(req,res){
var shop = req.body.shopName
var m = moment()
var year = m.format('YYYY')
var dateValue = m.valueOf()
var date = m.toString()
var customer = req.body.customer
var productName = req.body.name
var category = req.body.category
var quan = req.body.quantity
var mformat = m.format("L")
var barcodeNumber = req.body.barcodeNumber
console.log(barcodeNumber,'barcodeNumber')
console.log(quan,'quantity')
;

let result = quan.match(reg)
let currentStock = Number(result)

req.check('barcodeNumber','Enter Barcode Number').notEmpty();
  req.check('category','Enter Product Category').notEmpty();
  req.check('quantity','Enter Quantity').notEmpty();

 
  

  
  
  var errors = req.validationErrors();
   
  if (errors) {

    req.session.errors = errors;
    req.session.success = false;
    res.render('merchant/stockUpdate',{ errors:req.session.errors})
    
  
  }else{

 

ShopStock.find({barcodeNumber:barcodeNumber,shop:shop,customer:customer},function(err,docs){
let oldStock = docs[0].currentQuantity
let sales = docs[0].currentQuantity - currentStock
ShopStock.findByIdAndUpdate(docs[0]._id,{$set:{currentQuantity:currentStock, openingQuantity:oldStock}},function(err,locs){

})




var sale = new Sales()
sale.productName = productName
sale.category = category
sale.barcodeNumber = barcodeNumber
sale.qty = sales
sale.date = date
sale.dateValue = dateValue
sale.customer = customer
sale.shop = shop
sale.mformat = mformat
sale.price =0
sale.openingStock =oldStock
sale.newStock = currentStock
sale.save()
.then(sal =>{

})




res.redirect('/merch/update')
})
  }
 



})*/

router.get('/update',isLoggedIn, activate,function(req,res){
  var shop = req.user.shop
  var customer = req.user.customer
  var pro = req.user
  ShopStock.find({shop:shop, customer:customer},(err, docs) => {
      if (!err) {
          res.render("merchant/stockUpdate", {
             listX:docs, pro:pro
            
          });
      }
  });
})


router.post('/update/:id',isLoggedIn,activate,function(req,res){
var id = req.params.id
var pro = req.user
var m = moment()
var year = m.format('YYYY')
var month = m.format('MMMM')
var dateValue = m.valueOf()
var mformat = m.format("L")
var date = m.toString()
var quan = req.body.code
ShopStock.findById(id,function(err,doc){

  if(doc.stockUpdate == "no"){
let customer = doc.customer
let productName = doc.name
let category = doc.category
let shop = doc.shop
let barcodeNumber = doc.barcodeNumber

  let reg = /\d+\.*\d*/g;

  let result = quan.match(reg)
  let currentStock = Number(result)

  ShopStock.find({barcodeNumber:barcodeNumber,shop:shop,customer:customer},function(err,docs){
    let oldStock = docs[0].currentQuantity
    let sales = docs[0].currentQuantity - currentStock
    ShopStock.findByIdAndUpdate(docs[0]._id,{$set:{currentQuantity:currentStock, openingQuantity:oldStock,stockUpdate:'yes'}},function(err,locs){
    
    })
    
    

var sale = new Sales()
sale.productName = productName
sale.category = category
sale.barcodeNumber = barcodeNumber
sale.qty = sales
sale.date = date
sale.dateValue = dateValue
sale.customer = customer
sale.shop = shop
sale.mformat = mformat
sale.price =0
sale.year = year
sale.month = month
sale.openingStock =oldStock
sale.newStock = currentStock
sale.save()
.then(sal =>{

})




})
}else{
  console.log('null')

  ShopStock.findByIdAndUpdate(id,{$set:{stockUpdate:'yes'}},function(err,loc){

  })
}
res.send(doc)
})
})

router.get('/stockChange',isLoggedIn,activate,function(req,res){
  var shop = req.user.shop
  var customer = req.user.customer
  var pro = req.user
  var m = moment()
var year = m.format('YYYY')
var dateValue = m.valueOf()
var mformat = m.format("L")
var date = m.toString()
var arr = []

Sales.find({mformat:mformat},function(err,docs){
  for(var i = 0; i< docs.length;i++){
    let barcodeNumber = docs[i].barcodeNumber
    ShopStock.find({barcodeNumber:barcodeNumber},function(err,locs){
      if(locs){
        arr.push(locs[0])
      }
    })
  }
  res.render("merchant/listChange", {
    listX:arr, pro:pro
   
 });
  
})

})


router.post('/stockChange/:id',isLoggedIn,activate,function(req,res){
  var id = req.params.id
  var quantity = req.body.code
  var m = moment()
  var year = m.format('YYYY')
  var dateValue = m.valueOf()
  var mformat = m.format("L")
  let reg = /\d+\.*\d*/g;

  let result = quantity.match(reg)
  let currentStock = Number(result)

  ShopStock.findByIdAndUpdate(id,{$set:{currentQuantity:currentStock}},function(err,locs){
    
  })
ShopStock.findById(id,function(err,doc){
  let barcodeNumber = doc.barcodeNumber

  Sales.find({barcodeNumber:barcodeNumber,mformat:mformat},function(err,loc){
    let sId = loc[0]._id
   
    let qty = loc[0].openingStock - currentStock
    Sales.findByIdAndUpdate(sId,{$set:{newStock:currentStock, qty:qty}},function(err,foc){

    })
  })
})

})


router.get('/viewStock',isLoggedIn,activate,function(req,res){
    var shop = req.user.shop
    var customer = req.user.customer
    var pro = req.user
    ShopStock.find({shop:shop, customer:customer},(err, docs) => {
        if (!err) {
            res.render("merchant/listX2", {
               list:docs, pro:pro
              
            });
        }
    });
  
})



router.post('/verifyScan',activate,function(req,res){
  
    var barcodeNumber = req.body.code
     Product.find({barcodeNumber:barcodeNumber},function(err,docs){
    if(docs == undefined){
      res.redirect('/verify')
    }else
    console.log(docs,'docs')
   
       res.send(docs[0])
     })
   })
   

   router.post('/verifyScanX',activate,function(req,res){
  
    var barcodeNumber = req.body.code
     Stock.find({barcodeNumber:barcodeNumber},function(err,docs){
    if(docs == undefined){
      res.redirect('/verify')
    }else
    console.log(docs,'docs')
   
       res.send(docs[0])
     })
   })




   router.get('/autocompleteShop/',isLoggedIn,activate, function(req, res, next) {

   
    var regex= new RegExp(req.query["term"],'i');
    var userId = req.user._id
   
    var uidFilter =Shop.find({ userId:userId,name:regex},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
    
    uidFilter.exec(function(err,data){
   
  
  console.log('data',data)
  
  var result=[];
  
  if(!err){
     if(data && data.length && data.length>0){
       data.forEach(sub=>{
  
        
     
  
          
         let obj={
           id:sub._id,
           label: sub.name,
  
     
          
       
  
           
         };
        
         result.push(obj);
         console.log('object',obj.id)
       });
  
     }
   
     res.jsonp(result);
     console.log('Result',result)
    }
  
  })
  
  });
  
  // role admin
  //this routes autopopulates teachers info from the id selected from automplet1
  router.post('/autoShop',isLoggedIn,activate,function(req,res){
    var code = req.body.code
    var userId = req.user._id
  
    Preset.find({userId:userId,name:code},function(err,docs){
   if(docs == undefined){
     res.redirect('/dash')
   }else
  
      res.send(docs[0])
    })
  
  
  })
   





  router.get('/autocompleteCustomer/',isLoggedIn,activate, function(req, res, next) {

   
    var regex= new RegExp(req.query["term"],'i');
    
   
    var uidFilter =Shop.find({ customer:regex},{'customer':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
    
    uidFilter.exec(function(err,data){
   
  
  console.log('data',data)
  
  var result=[];
  
  if(!err){
     if(data && data.length && data.length>0){
       data.forEach(sub=>{
  
        
     
  
          
         let obj={
           id:sub._id,
           label: sub.customer,
  
     
          
       
  
           
         };
        
         result.push(obj);
         console.log('object',obj.id)
       });
  
     }
   
     res.jsonp(result);
     console.log('Result',result)
    }
  
  })
  
  });
  
  // role admin
  //this routes autopopulates teachers info from the id selected from automplet1
  router.post('/autoCustomer',isLoggedIn,activate,function(req,res){
    var code = req.body.code
  
  
    Shop.find({customer:code},function(err,docs){
   if(docs == undefined){
     res.redirect('/dash')
   }else
  
      res.send(docs[0])
    })
  
  
  })
   
   
  router.post('/fill',function(req,res){

    console.log(req.body.value)
        var customer = req.body.value
        var userId = req.user._id
    Preset.find({userId:userId,customer:customer},function(err,docs){
      console.log(docs,'data')
    
        if(docs == undefined){
            res.redirect('/')
           }else
          
             res.send(docs)
    
    })
    
    })
    

   

    router.post('/not/:id',function(req,res){
      var m = moment()
      var date = m.toString()
    
    var id = req.params.id
      Note.find({recId:id},function(err,docs){
        for(var i = 0; i<docs.length; i++){
          let nId = docs[i]._id
    
          Note.findByIdAndUpdate(nId,{$set:{status:'viewed',dateViewed:date}},function(err,locs){
    
          })
        }
    
        res.send('success')
      })
    })
    
    
    
      
      
    


router.get('/nList',isLoggedIn,function(req,res){
  var id = req.user._id
  var m = moment()
  console.log(m.valueOf(),'crap')
  Note.find({recId:id},function(err,docs){
    if(!err){

   
    res.render('merchant/notList',{list:docs})

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
let status4 = tocs[0].status4
let user = tocs[0].user
let date = tocs[0].date
let senderPhoto = tocs[0].senderPhoto

    
    res.render('merchant/notView',{message:message, subject:subject,status4:status4,user:user,date:date,senderPhoto:senderPhoto})
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
    

      
  function activate(req,res,next){
    if(req.user.status == 'activated'){
      return next()
    }
    res.redirect('/merch/land')
    }  

      
      