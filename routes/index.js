var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Cart = require('../models/cart');
var Dispatch = require('../models/dispatch');
var Category = require('../models/category');
var Customer = require('../models/customer');
var nodemailer = require('nodemailer');
var Product = require('../models/product');
var SaleStats = require('../models/saleStats');
var SaleStats2 = require('../models/saleStats2');
var Chart = require('../models/chart')
var Sales = require('../models/sales');
var ShopStock = require('../models/shopStock');
var QStats = require('../models/qtyStats');
var PStats = require('../models/productStats');
var Message = require('../models/message');
var Recepient = require('../models/recepients');
var Time = require("intl-relative-time-format");
var CStats = require('../models/categoryStats');
var IncStats = require('../models/incomeStats');
var Shop = require('../models/shop');
var Preset = require('../models/preset');
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
/*const connectEnsureLogin = require('connect-ensure-login')*/


var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})



var upload = multer({
    storage:storage
})








router.get('/', function (req, res, next) {
  var messages = req.flash('error');
  
  res.render('login', { messages: messages, hasErrors: messages.length > 0});
});
router.post('/', passport.authenticate('local.signin', {
  failureRedirect: '/',
  failureFlash: true
}), function (req, res, next) {
  if(req.user.role == "admin"){
    res.redirect("/storeStat");
  }else if (req.user.role == 'merchant')
  res.redirect('/merch/userUpdate')
  else if(req.user.role == 'receiver')
  res.redirect('/rec/addStock')
  else if(req.user.role == 'dispatcher')
  res.redirect('/ship/dispatch')
  
});


//dashboard stats
router.get('/storeStat',function(req,res){
  var max
    var m = moment()
    var year = m.format('YYYY')
    var arr = []
  
    SaleStats.find({year:year}, function(err,locs){
      console.log(locs.length,'length')
      if(locs.length == 0){
  var std = SaleStats();
  std.bestSellingCustomer = 0;
  std.bestSellingCategory = 0;
  std.bestSellingStore = 0;
  std.bestSellingProduct = 0;
  std.bestSellingCustomerX = 'null';
  std.bestSellingCategoryX = 'null';
  std.bestSellingStoreX = 'null';
  std.bestSellingProductX = 'null';
  std.year = year;
  
  
  std.save()
  .then(std=>{
  
    Sales.find({year:year},function(err,docs) {
      // console.log(docs,'docs')
      if(docs.length > 0){
       for(var i = 0;i<docs.length;i++){
  
     
  
       
          if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
                 console.log('true')
                arr.find(value => value.shop == docs[i].shop).qty += docs[i].qty;
           }else{
   arr.push(docs[i])
           }
   
         }
       
      // console.log(arr,'arr')
      //res.send(arr)
   max = arr[0].qty
   let max2
   for(var i = 0;i< arr.length;i++){
     if(arr[i].qty >= max){
       max = arr[i].qty
       max2 = arr[i].shop
     }
   }
   console.log(max,'max')
   console.log(max2,'shop')
   SaleStats.findByIdAndUpdate(std._id,{$set:{bestSellingStore:max,bestSellingStoreX:max2}},function(err,kocs){
  
  
  })
}
     })
  
    
  
  })
      }else{
        Sales.find({year:year},function(err,docs) {
          // console.log(docs,'docs')
          if(docs.length > 0){
           for(var i = 0;i<docs.length;i++){
       
           
              if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
                     console.log('true')
                    arr.find(value => value.shop == docs[i].shop).qty += docs[i].qty;
               }else{
       arr.push(docs[i])
               }
       
             }
           
          // console.log(arr,'arr')
          //res.send(arr)
       max = arr[0].qty
       let max2
       for(var i = 0;i< arr.length;i++){
         if(arr[i].qty >= max){
           max = arr[i].qty
           max2 = arr[i].shop
         }
       }
       console.log(max,'max')
       console.log(max2,'shop')
       SaleStats.findByIdAndUpdate(locs[0]._id,{$set:{bestSellingStore:max, bestSellingStoreX:max2}},function(err,kocs){
      
      
      })
    }
         })
        
      }
  res.redirect('/customerStat')
      })
  
    })









    router.get('/customerStat',function(req,res){
      var max
        var m = moment()
        var year = m.format('YYYY')
        var arr = []
      
        SaleStats.find({year:year}, function(err,locs){
          console.log(locs.length,'length')
          if(locs.length == 0){
      var std = SaleStats();
      std.bestSellingCustomer = 0;
      std.bestSellingCategory = 0;
      std.bestSellingStore = 0;
      std.bestSellingProduct = 0;
      std.bestSellingCustomerX = 'null';
      std.bestSellingCategoryX = 'null';
      std.bestSellingStoreX = 'null';
      std.bestSellingProductX = 'null';
      std.year = year;
      
      
      std.save()
      .then(std=>{
      
        Sales.find({year:year},function(err,docs) {
          // console.log(docs,'docs')
          if(docs.length > 0){
           for(var i = 0;i<docs.length;i++){
       
           
              if(arr.length > 0 && arr.find(value => value.customer == docs[i].customer)){
                     console.log('true')
                    arr.find(value => value.shop == docs[i].customer).qty += docs[i].qty;
               }else{
       arr.push(docs[i])
               }
       
             }
           
          // console.log(arr,'arr')
          //res.send(arr)
       max = arr[0].qty
       let max2
       for(var i = 0;i< arr.length;i++){
         if(arr[i].qty >= max){
           max = arr[i].qty
           max2 = arr[i].customer
         }
       }
       console.log(max,'max')
       console.log(max2,'shop')
       SaleStats.findByIdAndUpdate(std._id,{$set:{bestSellingCustomer:max, bestSellingCustomerX:max2}},function(err,kocs){
      
      
      })
    }
         })
      
         
      
      })
          }else{
            Sales.find({year:year},function(err,docs) {
              // console.log(docs,'docs')
              if(docs.length > 0){
               for(var i = 0;i<docs.length;i++){
           
               
                  if(arr.length > 0 && arr.find(value => value.customer == docs[i].customer)){
                         console.log('true')
                        arr.find(value => value.customer == docs[i].customer).qty += docs[i].qty;
                   }else{
           arr.push(docs[i])
                   }
           
                 }
               
              // console.log(arr,'arr')
              //res.send(arr)
           max = arr[0].qty
           let max2
           for(var i = 0;i< arr.length;i++){
             if(arr[i].qty >= max){
               max = arr[i].qty
               max2 = arr[i].customer
             }
           }
           console.log(max,'max')
           console.log(max2,'shop')
           SaleStats.findByIdAndUpdate(locs[0]._id,{$set:{bestSellingCustomer:max, bestSellingCustomerX:max2}},function(err,kocs){
          
          
          })
        }
             })
            
          }
          res.redirect('/categoryStat')
          })
      
        })



        
    router.get('/categoryStat',function(req,res){
      var max
        var m = moment()
        var year = m.format('YYYY')
        var arr = []
      
        SaleStats.find({year:year}, function(err,locs){
          console.log(locs.length,'length')
          if(locs.length == 0){
      var std = SaleStats();
      std.bestSellingCustomer = 0;
      std.bestSellingCategory = 0;
      std.bestSellingStore = 0;
      std.bestSellingProduct = 0;
      std.bestSellingCustomerX = 'null';
      std.bestSellingCategoryX = 'null';
      std.bestSellingStoreX = 'null';
      std.bestSellingProductX = 'null';
      std.year = year;
      
      
      std.save()
      .then(std=>{
      
        Sales.find({year:year},function(err,docs) {
          if(docs.length > 0){
          // console.log(docs,'docs')
           for(var i = 0;i<docs.length;i++){
       
           
              if(arr.length > 0 && arr.find(value => value.category == docs[i].category)){
                     console.log('true')
                    arr.find(value => value.category == docs[i].category).qty += docs[i].qty;
               }else{
       arr.push(docs[i])
               }
       
             }
           
          // console.log(arr,'arr')
          //res.send(arr)
       max = arr[0].qty
       let max2
       for(var i = 0;i< arr.length;i++){
         if(arr[i].qty >= max){
           max = arr[i].qty
           max2 = arr[i].category
         }
       }
       console.log(max,'max')
       console.log(max2,'shop')
       SaleStats.findByIdAndUpdate(std._id,{$set:{bestSellingCategory:max, bestSellingCategoryX:max2}},function(err,kocs){
      
      
      })
    }
         })
      
         
      
      })
          }else{
            Sales.find({year:year},function(err,docs) {
              // console.log(docs,'docs')
              if(docs.length > 0){
               for(var i = 0;i<docs.length;i++){
           
               
                  if(arr.length > 0 && arr.find(value => value.category == docs[i].category)){
                         console.log('true')
                        arr.find(value => value.category == docs[i].category).qty += docs[i].qty;
                   }else{
           arr.push(docs[i])
                   }
           
                 }
               
              // console.log(arr,'arr')
              //res.send(arr)
           max = arr[0].qty
           let max2
           for(var i = 0;i< arr.length;i++){
             if(arr[i].qty >= max){
               max = arr[i].qty
               max2 = arr[i].category
             }
           }
           console.log(max,'max')
           console.log(max2,'shop')
           SaleStats.findByIdAndUpdate(locs[0]._id,{$set:{bestSellingCategory:max,bestSellingCategoryX:max2}},function(err,kocs){
          
          
          })
        }
             })
            
          }

          res.redirect('/productStat')
      
          })
      
        })







        router.get('/productStat',function(req,res){
          var max
            var m = moment()
            var year = m.format('YYYY')
            var arr = []
          
            SaleStats.find({year:year}, function(err,locs){
              console.log(locs.length,'length')
              if(locs.length == 0){
          var std = SaleStats();
          std.bestSellingCustomer = 0;
          std.bestSellingCategory = 0;
          std.bestSellingStore = 0;
          std.bestSellingProduct = 0;

          std.bestSellingCustomerX = 'null';
          std.bestSellingCategoryX = 'null';
          std.bestSellingStoreX = 'null';
          std.bestSellingProductX = 'null';
          std.year = year;
          
          
          std.save()
          .then(std=>{
          
            Sales.find({year:year},function(err,docs) {
              // console.log(docs,'docs')
              if(docs.length > 0){
               for(var i = 0;i<docs.length;i++){
           
               
                  if(arr.length > 0 && arr.find(value => value.productName  == docs[i].productName )){
                         console.log('true')
                        arr.find(value => value.productName  == docs[i].productName ).qty += docs[i].qty;
                   }else{
           arr.push(docs[i])
                   }
           
                 }
               
              // console.log(arr,'arr')
              //res.send(arr)
           max = arr[0].qty
           let max2
           for(var i = 0;i< arr.length;i++){
             if(arr[i].qty >= max){
               max = arr[i].qty
               max2 = arr[i].productName 
             }
           }
           console.log(max,'max')
           console.log(max2,'shop')
           SaleStats.findByIdAndUpdate(std._id,{$set:{bestSellingProduct:max,bestSellingProductX:max2}},function(err,kocs){
          
          
          })
        }
             })
          
             
          
          })
              }else{
                Sales.find({year:year},function(err,docs) {
                  // console.log(docs,'docs')
                  if(docs.length > 0){
                   for(var i = 0;i<docs.length;i++){
               
                   
                      if(arr.length > 0 && arr.find(value => value.productName  == docs[i].productName )){
                             console.log('true')
                            arr.find(value => value.productName  == docs[i].productName ).qty += docs[i].qty;
                       }else{
               arr.push(docs[i])
                       }
               
                     }
                   
                  // console.log(arr,'arr')
                  //res.send(arr)
               max = arr[0].qty
               let max2
               for(var i = 0;i< arr.length;i++){
                 if(arr[i].qty >= max){
                   max = arr[i].qty
                   max2 = arr[i].productName 
                 }
               }
               console.log(max,'max')
               console.log(max2,'shop')
               SaleStats.findByIdAndUpdate(locs[0]._id,{$set:{bestSellingProduct:max,bestSellingProductX:max2}},function(err,kocs){
              
              
              })
            }
                 })
                
              }
          res.redirect('/notUpdate')
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
  res.redirect('/nots')
  
  
  })
  
  
  
  })
  
  router.get('/nots',isLoggedIn, function(req,res){
    var m = moment();
  var id = req.user._id
    Note.find({recId:id,status:'viewed'},function(err,docs){
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

      res.redirect('/dash')
    })
  
  
  })



            //sales stats

router.post('/dashGX1',isLoggedIn,function(req,res){
   
  var m = moment()
  var year = m.format('YYYY')

  SaleStats.find({year:year},function(rr,docs){
    if(docs == undefined){
      res.redirect('/dash')
    }else

       res.send(docs)
  })
})


            router.post('/dashChartS2',isLoggedIn,function(req,res){
              
             
              var m = moment()
              var year = m.format('YYYY')
              var arr = []
             
            
              
            
            
            
              Sales.find({year:year},function(err,docs) {
                for(var i = 0;i<docs.length;i++){
            
               
                    
                   if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
                          console.log('true')
                         arr.find(value => value.month == docs[i].month).qty += docs[i].qty;
                    }else{
            arr.push(docs[i])
                    }
            
                
                }
                //console.log(arr,'arr')
               res.send(arr)
              })
            
            })
       //store General Stores     
       
router.post('/dashChartStoreG',isLoggedIn,function(req,res){
  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var customer = req.body.customer
 

  Sales.find({year:year,customer:customer},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

    
       if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
              console.log('true')
             arr.find(value => value.shop == docs[i].shop).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

      
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})

router.post('/dashChartStoreG4',isLoggedIn,function(req,res){
  var m = moment()
  var year = m.format('YYYY')
  var arr = []
 

  Sales.find({year:year},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

    
       if(arr.length > 0 && arr.find(value => value.customer == docs[i].customer)){
              console.log('true')
             arr.find(value => value.customer == docs[i].customer).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

      
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})


router.post('/dashChartG1',isLoggedIn,function(req,res){

 
  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id

  



  Sales.find({year:year},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

   
        
       if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
              console.log('true')
             arr.find(value => value.month == docs[i].month).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

    
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})



router.post('/dashChartG2',isLoggedIn,function(req,res){

 
  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id

  



  ShopStock.find({year:year},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

   
        
       if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
              console.log('true')
             arr.find(value => value.month == docs[i].month).currentQuantity += docs[i].currentQuantity;
        }else{
arr.push(docs[i])
        }

    
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})


//general sales stats
router.get('/dash',isLoggedIn,function(req,res){
  var pro = req.user
  const arr = []
const m = moment();
  var id =req.user._id

    Recepient.find({recepientId:id,statusCheck:'not viewed'},function(err,rocs){
      let lgt = rocs.length
      var gt = lgt > 0
    
          console.log(req.user._id)
          console.log(req.user.email)
            Note.find({recId:req.user._id},function(err,docs){
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
    
          Note.find({recId:req.user._id,status1:'new'},function(err,flocs){
            var les 
         
            Note.find({recId:req.user._id,status:'not viewed'},function(err,jocs){
             les = jocs.length > 0
          
            for(var i = flocs.length - 1; i>=0; i--){
        
              arr.push(flocs[i])
            }
         
    Customer.find(function(err,zocs){

  
           
            res.render('admin/dashG',{pro:pro,list:arr,listX:zocs, les:les,gt:gt })
    
          })
        })
          })
    
        })
    
    
 
  })

})


router.get('/productSaleStats',isLoggedIn,function(req,res){
  var pro = req.user
  Customer.find({},function(err,docs){
    Category.find({},function(err,ocs){
  res.render('admin/index',{pro:pro,arr:docs,arr1:ocs})
    })
  })
})


router.get('/yearProductStats',isLoggedIn,function(req,res){
  var pro = req.user
  
  Customer.find({},function(err,docs){
    Category.find({},function(err,ocs){
  res.render('admin/index3',{pro:pro,arr:docs,arr1:ocs})
    })
  })
})


router.get('/shopSaleStats',isLoggedIn,function(req,res){
  var pro = req.user

  Customer.find({},function(err,docs){
    Category.find({},function(err,ocs){
  res.render('admin/dashX',{pro:pro,listX:docs,arr1:ocs})
    })
  })
})


router.get('/shopStock',isLoggedIn,function(req,res){
  var pro = req.user
 // res.render('admin/dashStock',{pro:pro})
  Customer.find({},function(err,docs){
    Category.find({},function(err,ocs){
  res.render('admin/dashStock',{pro:pro,listX:docs,listX2:docs,arr:docs,arr1:ocs})
    })
  })
})


router.get('/warehouseStock',isLoggedIn,function(req,res){
  var pro = req.user
  //res.render('admin/dash6',{pro:pro})
  Customer.find({},function(err,docs){
    Category.find({},function(err,ocs){
  res.render('admin/dash6',{pro:pro,arr:docs,arr1:ocs})
    })
  })
})





router.get('/dashChartX',isLoggedIn,function(req,res){
  var customer = req.body.customer
  var shop = req.body.shop
  var category = req.body.category
  var product = req.body.product
  var date = req.body.date
  var arr = []
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')

  Sales.find({customer:customer,shop:shop},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        let productName = docs[i].productName
        let category = docs[i].category
        let barcodeNumber = docs[i].barcodeNumber
        
        let qty = docs[i].qty

       
        

        Chart.find({barcodeNumber:barcodeNumber},function(err,locs) {
          console.log(locs.length)
    if(locs.length == 0 ){

      

      var chart = Chart();
            chart.productName = productName
            chart.category = category;
            chart.barcodeNumber = barcodeNumber
            chart.qty = qty
            chart.customer = customer
            chart.shop = shop
            chart.save()
    .then(chartX =>{

      
      arr.push(chartX)

    })

    }else{
let qtyX = docs[i].qty + locs[0].qty
Chart.findByIdAndUpdate(locs[0]._id,{$set:{qty:qtyX}},function(err,koc){
  arr.push(koc)
})
    }
        })

//arr.push(docs[i])
      }
    }
    //console.log(arr,'arr')
       
    res.send(arr)
   
});
})

router.post('/dashChart',isLoggedIn,function(req,res){
  var customer = req.body.customer
  var shop = req.body.shop
  var category = req.body.category
  var product = req.body.product
  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')



  Sales.find({customer:customer,shop:shop},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        
       if(arr.length > 0 && arr.find(value => value.barcodeNumber == docs[i].barcodeNumber)){
              console.log('true')
             arr.find(value => value.barcodeNumber == docs[i].barcodeNumber).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

      }
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})

router.post('/dashChart2',isLoggedIn,function(req,res){
  var customer = req.body.customer
  var shop = req.body.shop

  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')


  Sales.find({customer:customer,shop:shop},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        console.log(docs[i],'docs')
       if(arr.length > 0 && arr.find(value => value.category == docs[i].category)){
              console.log('true')
             arr.find(value => value.category == docs[i].category).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

      }
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})





router.post('/dashChart3',isLoggedIn,function(req,res){
 
  var category = req.body.category
  var product = req.body.productName
  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')



  Sales.find({category:category, productName:product},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        
       if(arr.length > 0 && arr.find(value => value.customer == docs[i].customer)){
              console.log('true')
             arr.find(value => value.customer== docs[i].customer).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

      }
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})






router.post('/dashChart4',isLoggedIn,function(req,res){
 
  var category = req.body.category
 
  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')


  Sales.find({category:category},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        
       if(arr.length > 0 && arr.find(value => value.customer == docs[i].customer)){
              console.log('true')
             arr.find(value => value.customer== docs[i].customer).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

      }
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})




router.post('/dashChart5',isLoggedIn,function(req,res){
 
  var category = req.body.category
  var product = req.body.product
 
  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')



  Sales.find({category:category,product:product},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        
       if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
              console.log('true')
             arr.find(value => value.shop== docs[i].shop).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

      }
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})





router.post('/dashChart6',isLoggedIn,function(req,res){
 
  var category = req.body.category
 
 
  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')



  Sales.find({category:category},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        
       if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
              console.log('true')
             arr.find(value => value.shop== docs[i].shop).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

      }
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})





router.post('/dashChartStockX',isLoggedIn,function(req,res){

   var category = req.body.category

  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  


  Product.find({category:category},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){


       if(arr.length > 0 && arr.find(value => value.name == docs[i].name)){
              console.log('true')
             arr.find(value => value.name == docs[i].name).quantity += docs[i].quantity;
        }else{
arr.push(docs[i])
        }

      
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})




router.post('/dashChartStockXI',isLoggedIn,function(req,res){

  

 var date = req.body.date
 var arr = []
 var id = req.user._id
 let num = req.user.num
 num++
 


 Product.find({},function(err,docs) {
  // console.log(docs,'docs')
   for(var i = 0;i<docs.length;i++){


      if(arr.length > 0 && arr.find(value => value.category == docs[i].category)){
             console.log('true')
            arr.find(value => value.category == docs[i].category).cases += docs[i].cases;
       }else{
arr.push(docs[i])
       }

     
   }
  // console.log(arr,'arr')
  res.send(arr)
 })

})



/*

router.post('/dashChartCS',isLoggedIn,function(req,res){
  var customer = req.body.customer
 

  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')


  Sales.find({customer:customer},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        console.log(docs[i],'docs')
       if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
              console.log('true')
             arr.find(value => value.shop == docs[i].shop).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

      }
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})
*/

router.post('/dashChartStore',isLoggedIn,function(req,res){
  var customer = req.body.customer
   var product = req.body.product
   var category = req.body.category

  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')


  Sales.find({customer:customer,productName:product,category:category},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        console.log(docs[i],'docs')
       if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
              console.log('true')
             arr.find(value => value.shop == docs[i].shop).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

      }
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})




router.get('/dashChartTest',function(req,res){
 

 
  var arr = []
  


  Sales.find({customer:'Pick n Pay',productName:'Lancewood Low Mixed Fruit',  category:'yorghut', },function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

    
       if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
              console.log('true')
             arr.find(value => value.shop == docs[i].shop).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

      }
    
   // console.log(arr,'arr')
   //res.send(arr)
var max = arr[0].qty
let max2
for(var i = 0;i< arr.length;i++){
  if(arr[i].qty >= max){
    max = arr[i].qty
    max2 = arr[i].shop
  }
}
console.log(max,'max')
console.log(max2,'shop')
  })

})


router.post('/dashChartStoreX',isLoggedIn,function(req,res){
  var customer = req.body.customer

   var category = req.body.category

  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')


  Sales.find({category:category,customer:customer},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        console.log(docs[i],'docs')
       if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
              console.log('true')
             arr.find(value => value.shop == docs[i].shop).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

      }
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})


router.post('/dashStockCS',isLoggedIn,function(req,res){
  var customer = req.body.customer
 

  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')


  Product.find({category:customer},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

    
       if(arr.length > 0 && arr.find(value => value.category == docs[i].category)){
              console.log('true')
             arr.find(value => value.category == docs[i].category).quantity += docs[i].quantity;
        }else{
arr.push(docs[i])
        }

      
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})


router.post('/dashChartY',isLoggedIn,function(req,res){
  var customer = req.body.customer
  var shop = req.body.shop
  var category = req.body.category
  var productName = req.body.productName
  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id

  



  Sales.find({year:year,customer:customer,shop:shop,category:category,productName:productName},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

   
        
       if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
              console.log('true')
             arr.find(value => value.month == docs[i].month).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

    
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})





router.post('/dashChartStock2',isLoggedIn,function(req,res){
  var customer = req.body.customer
  var product = req.body.product
  var category = req.body.category


  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  

  ShopStock.find({category:category,name:product,customer:customer},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

    
       if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
              console.log('true')
             arr.find(value => value.shop == docs[i].shop).currentQuantity += docs[i].currentQuantity;
        }else{
arr.push(docs[i])
        }

      
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})




router.post('/dashStockStore',isLoggedIn,function(req,res){
  var customer = req.body.customer
 


  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  

  ShopStock.find({customer:customer},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

    
       if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
              console.log('true')
             arr.find(value => value.shop == docs[i].shop).currentQuantity += docs[i].currentQuantity;
        }else{
arr.push(docs[i])
        }

      
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})




router.post('/dashStockStore3',isLoggedIn,function(req,res){
  var customer = req.body.customer
  var shop = req.body.shop


  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  

  ShopStock.find({customer:customer,shop:shop},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

    
       if(arr.length > 0 && arr.find(value => value.name == docs[i].name)){
              console.log('true')
             arr.find(value => value.shop == docs[i].name).currentQuantity += docs[i].currentQuantity;
        }else{
arr.push(docs[i])
        }

      
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})



router.post('/dashStockStore4',isLoggedIn,function(req,res){
  var customer = req.body.customer
  var category = req.body.category


  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  

  ShopStock.find({customer:customer,category:category},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

    
       if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
              console.log('true')
             arr.find(value => value.shop == docs[i].shop).currentQuantity += docs[i].currentQuantity;
        }else{
arr.push(docs[i])
        }

      
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})

router.post('/dashChartY',isLoggedIn,function(req,res){
  var customer = req.body.customer
  var shop = req.body.shop
  var category = req.body.category
  var productName = req.body.productName
  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id

  



  Sales.find({year:year,customer:customer,shop:shop,category:category,productName:productName},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

   
        
       if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
              console.log('true')
             arr.find(value => value.month == docs[i].month).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

    
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})


router.post('/dashChartY2',isLoggedIn,function(req,res){
  var customer = req.body.customer
  var shop = req.body.shop
  var category = req.body.category

  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id

  



  Sales.find({year:year,customer:customer,shop:shop,category:category},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

   
        
       if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
              console.log('true')
             arr.find(value => value.month == docs[i].month).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

    
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})



router.post('/dashChartY5',isLoggedIn,function(req,res){

  var category = req.body.category

  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id

  



  Sales.find({year:year,category:category},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

   
        
       if(arr.length > 0 && arr.find(value => value.customer == docs[i].customer)){
              console.log('true')
             arr.find(value => value.customer == docs[i].customer).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

    
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})






router.post('/dashChartY6',isLoggedIn,function(req,res){


  var category = req.body.category
  var productName = req.body.productName

  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id

  



  Sales.find({year:year,category:category,productName:productName},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

   
        
       if(arr.length > 0 && arr.find(value => value.customer == docs[i].customer)){
              console.log('true')
             arr.find(value => value.customer == docs[i].customer).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

    
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})






router.post('/dashChartY7',isLoggedIn,function(req,res){

 
  var category = req.body.category
  var productName = req.body.productName

  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id

  



  Sales.find({year:year,category:category,productName:productName},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

   
        
       if(arr.length > 0 && arr.find(value => value.shop == docs[i].shop)){
              console.log('true')
             arr.find(value => value.shop == docs[i].shop).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

    
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})












router.post('/dashChartY3',isLoggedIn,function(req,res){
  var customer = req.body.customer
  var shop = req.body.shop
  var category = req.body.category
  var productName = req.body.productName
 
  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id

  



  Sales.find({year:year,customer:customer,shop:shop,category:category,productName:productName},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

   
        
       if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
              console.log('true')
             arr.find(value => value.month == docs[i].month).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

    
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})



router.post('/dashChartY4',isLoggedIn,function(req,res){
  var customer = req.body.customer
  var shop = req.body.shop
  var category = req.body.category
 
 
  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id

  



  Sales.find({year:year,customer:customer,shop:shop,category:category},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

   
        
       if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
              console.log('true')
             arr.find(value => value.month == docs[i].month).qty += docs[i].qty;
        }else{
arr.push(docs[i])
        }

    
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})



router.post('/dashNum',function(req,res){
  var id = req.user._id
  var num = req.user.num
  num++
  User.findByIdAndUpdate(id,{$set:{num:num}},function(err,docs){

res.send(docs)
  })


})




router.get('/add',function(req,res){

 

  res.render('user/admitHb')


})

router.post('/add', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                  
                var name = req.body.name
            
                var mobile = req.body.mobile
                var email = req.body.email
                var password = req.body.password
                var role = req.body.role
                var username = req.body.username
                req.check('name','Enter Name').notEmpty();
               
              
                req.check('email','Enter email').notEmpty().isEmail();
         
                
             
               
                req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
                    
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      res.render('user/admitHb',{ errors:req.session.errors,})
                      
                    
                  }
                  else
                
                 {
                    User.findOne({'email':email})
                    .then(user =>{
                        if(user){ 
                      // req.session.errors = errors
                        //req.success.user = false;
                    
                       req.session.message = {
                         type:'errors',
                         message:'user id already in use'
                       }     
                       
                          res.render('user/admitHb', {
                              message:req.session.message,    }) 
                       
                        
                  }
                  
                                else  {   
               

                  
                  var user = new User();
                  user.fullname = name;
                  user.email = email;
                  user.mobile = mobile;
                  user.photo = 'propic.jpg';
                  user.role = role;
                  user.num = 0
                  user.category = 'null'
                  user.status = 'null'
                  user.shop = 'null'
                  user.customer = 'null'
                  user.autoCustomer='null'
                  user.dateAdded = date
                  user.dateModified =date
                  user.merch = 'null'
                  user.userId = 'null'
                  user.photo2 = 'null'
                  user.username = 'null'
                  user.username2 = username

                  
                  
                  user.password = user.encryptPassword(password)

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                      
                })
              }
            res.redirect('/add')
                    })
                  }
              
                 
                
                    
                    
                
                 
                  

                  
})


router.get('/userListing',isLoggedIn,function(req,res){
  var pro = req.user
User.find({},(err, docs) => {
       if (!err) {
           res.render("user/listing", {
              list:docs,pro:pro
             
           });
       }
   });
})



router.get('/notify',isLoggedIn, function(req,res){
var pro =req.user
  res.render('notifs',{pro:pro})
})

router.post('/notify',isLoggedIn, function(req,res){
                var m = moment()
                var year = m.format('YYYY')
                var numDate = m.valueOf()
                var date = m.toString()
                var subject = req.body.subject
                var message = req.body.message
                var role = req.user.role
                var recRole ='clerk'
                var user = req.user.fullname
           
                console.log(role,'role')
                req.check('subject','Enter Subject').notEmpty();
                req.check('message','Enter Message').notEmpty();
              
               
                    
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      res.render('notifs',{ errors:req.session.errors,})
                      
                    
                  }
                  else{

              User.find({recRole:recRole},function(err,docs){

                for(var i = 0; i<docs.length;i++){

                  let id = docs[i]._id
                  var not = new Note();
                  not.role = role
                  not.subject = subject;
                  not.message = message
                  not.status = 'not viewed';
                  not.status1 = 'new';
                  not.user = user;
                  not.type = 'null'
                  not.status2 = 'new'
                  not.status3 = 'new'
                  not.status4 = 'null'
                  not.date = date
                  not.dateViewed = 'null'
                  not.recId = docs[i]._id
                  not.recRole = recRole
                  not.numDate = numDate
                 

          
                  
                  
               

                  
                   
              
                   
          
                  not.save()
                    .then(user =>{
                      
                })


                }
              })
              
                 res.redirect('/notify')

              }
                              

                  
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




router.get('/update',isLoggedIn,function(req,res){
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


})



})

router.get('/nots',isLoggedIn, function(req,res){
  var m = moment();
var id = req.user._id
  Note.find({recId:id,status:'viewed'},function(err,docs){
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
  })


})


router.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if(err) return next(err);
    res.redirect("/");
  });
});

  
  
//add Shops imports

router.get('/importShop',function(req,res){
  var pro = req.user
  res.render('product/importShop',{pro:pro})
})



router.post('/importShop', upload.single('file'),  (req,res)=>{
 

  if(!req.file){
      req.session.message = {
        type:'errors',
        message:'Select File!'
      }     
        res.render('product/imports', {message:req.session.message}) 
      }else if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
          req.session.message = {
              type:'errors',
              message:'Upload Excel File'
            }     
              res.render('product/importShop', {message:req.session.message
                   
               }) 



      }
        
      else{
   

      
          const file = req.file.filename;
  
          
               var wb =  xlsx.readFile('./public/uploads/' + file)
       
               var sheets = wb.Sheets;
               var sheetNames = wb.SheetNames;
   
               var sheetName = wb.SheetNames[0];
   var sheet = wb.Sheets[sheetName ];
   
      for (var i = 0; i < wb.SheetNames.length; ++i) {
       var sheet = wb.Sheets[wb.SheetNames[i]];
   
       console.log(wb.SheetNames.length)
       var data =xlsx.utils.sheet_to_json(sheet)
           
       var newData = data.map(async function (record){
   
      let customer = record.customer
      let name = record.name
      let city = record.city
     
    
        
       


        
req.body.customer = record.customer
req.body.name = record.name     
req.body.city = record.city  
req.body.num = record.num

 
         

          
      
          try{
            req.check('customer','Enter Customer').notEmpty();
            req.check('name','Enter Name').notEmpty();
            req.check('city','Enter City').notEmpty();
           
           
         


            var errors = req.validationErrors();

            if (errors) {
              
              req.session.errors = errors;
              req.session.success = false;
              for(let x=0;x<req.session.errors.length;x++){
                throw new SyntaxError(req.session.errors[x].msg +" "+"on line"+record.num)
              }
            
        }


    
      
        var product = new Shop();
                product.name = name;
                product.city = city
                product.customer =customer;
             
          
              
               
                product.save()
                  .then(productId =>{

                 
                  })
           
                   
               
                   
                 
                  // .catch(err => console.log(err))
                }
                catch(e){
                  //res.send(e.message)
                  console.log(e.message)
                 }
                  })
                
                
       
                }
                
                
                  
                  
      
                 
      
                  
           
              }
    
      


})










router.get('/info', isLoggedIn,function(req,res){
  var pro = req.user
  Category.find({},function(err,docs){
    var arr1 = docs;
  res.render('product/addProduct',{pro:pro,arr1:docs})
  })
})



router.post('/info',isLoggedIn, upload.single('file'),function(req,res){
  var pro = req.user
  var name = req.body.name
  var category = req.body.category
  var unitCases = req.body.unitCases
  var barcodeNumber = req.body.barcodeNumber
  var arr1
  
        req.check('name','Enter Product Name').notEmpty();
            
               req.check('category','Enter Product Category').notEmpty();
               req.check('unitCases','Enter Case Units').notEmpty();
           
               req.check('barcodeNumber', 'Enter Product Barcode Number').notEmpty();
            
               var errors = req.validationErrors();
  
        
             
           if (errors) {
            
                     req.session.errors = errors;
                     req.session.success = false;
                     Category.find({},function(err,docs){
                      arr1 = docs;
                     res.render('product/addProduct',{ errors:req.session.errors,pro:pro, arr1:docs})
                     })
                 }

                 else
                 {
                  Product.findOne({'barcodeNumber':barcodeNumber})
                  .then(bk =>{
                      if(bk){ 
                    // req.session.errors = errors
                      //req.success.user = false;
                  
                     req.session.message = {
                       type:'errors',
                       message:'product/barcodeNumber already in the system'
                     }     
                     Category.find({},function(err,docs){
                       arr1 = docs;
                        res.render('product/addProduct', {
                            message:req.session.message, pro:pro, arr1:docs   }) 
                        })
                      
                }
                
                              else  {   
             

        
              
          
       
        
                var book = new Product();
                  book.barcodeNumber = barcodeNumber
                  book.category = category
                  book.name = name
                  book.unitCases = unitCases
                  book.cases = 0
                  book.rcvdQuantity = 0
                  book.openingQuantity = 0
                  book.quantity = 0
                 
             
                  book.rate = 0
                  book.zwl = 0
                  book.price = 0
                      
                       
                        book.save()
                          .then(title =>{
                          
                            req.session.message = {
                              type:'success',
                              message:'Product added'
                            }  
                            Category.find({},function(err,docs){
                             arr1 = docs;
                            res.render('product/addProduct',{message:req.session.message,pro:pro,arr1:docs});
                            })
                        
                        })
                         
                        
                      }
                        })
                      }
                        
                         });

  



                      

                         router.get('/viewStock',isLoggedIn, (req, res) => {
                          var pro = req.user
                          Stock.find({},(err, docs) => {
                              if (!err) {
                                  res.render("product/productList", {
                                     list:docs,pro:pro
                                    
                                  });
                              }
                          });
                          });



                          
router.post('/viewStock',isLoggedIn,function(req,res){
  var pro =req.user

  var date = req.body.date
  var arr = []
 
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')
  Stock.find({},(err, docs) => {
    for(var i = 0;i<docs.length;i++){
      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
arr.push(docs[i])
      }
    }
    console.log(arr,'arr')
        res.render("product/productList", {
           list:arr,pro:pro
          
        });
   
   
});
  })
  





                          router.get('/viewProducts',isLoggedIn, (req, res) => {
                            var pro = req.user
                            Product.find({},(err, docs) => {
                                if (!err) {
                                    res.render("product/listX", {
                                       list:docs,pro:pro
                                      
                                    });
                                }
                            });
                            });
  


router.get('/search',isLoggedIn,function(req,res){
  res.render('product/search')
})





router.get('/stockTrack',isLoggedIn, (req, res) => {
  var pro = req.user
  Dispatch.find({},(err, docs) => {
      if (!err) {
          res.render("admin/dispatchList", {
             list:docs,pro:pro
            
          });
      }
  });
  });

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
    
  

/*router.post('/salesX',isLoggedIn,function(req,res){
var customer = req.body.customer
var shop = req.body.shop
var category = req.body.category
var product = req.body.product
var date = req.body.date

var m = moment(date)
console.log(date.split('-')[0])
var startDate = date.split('-')[0]
var endDate = date.split('-')[1]
console.log(customer, shop, category,product,date,'output')
})*/
router.get('/viewSales',isLoggedIn,function(req,res){
  var pro = req.user
 Sales.find({},(err, docs) => {
      if (!err) {
          res.render("product/sales", {
             list:docs,pro:pro
            
          });
      }
  });
})


router.post('/viewSales',isLoggedIn,function(req,res){
  var pro =req.user
  var customer = req.body.customer
  var shop = req.body.shop
  var category = req.body.category
  var product = req.body.product
  var date = req.body.date
  var arr = []
  console.log(customer,shop,category,product,date,'variables')
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')
  Sales.find({customer:customer,shop:shop},(err, docs) => {
    for(var i = 0;i<docs.length;i++){
      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
arr.push(docs[i])
      }
    }
    console.log(arr,'arr')
        res.render("product/sales", {
           list:arr,pro:pro
          
        });
   
   
});
  })
  













router.get('/verify',isLoggedIn,function(req,res){
  res.render('product/verify')
})







 

  router.post('/verifyScan',function(req,res){
  
    var barcodeNumber = req.body.code
     Product.find({barcodeNumber:barcodeNumber},function(err,docs){
    if(docs == undefined){
      res.redirect('/verify')
    }else
    console.log(docs,'docs')
   
       res.send(docs[0])
     })
   })
   

   router.post('/verifyScanX',function(req,res){
  
    var barcodeNumber = req.body.code
     Stock.find({barcodeNumber:barcodeNumber},function(err,docs){
    if(docs == undefined){
      res.redirect('/verify')
    }else
    console.log(docs,'docs')
   
       res.send(docs[0])
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
 
//add Category
router.get('/addCategory',isLoggedIn,function(req,res){
  var pro = req.user
  res.render('product/catg',{pro:pro})
})



router.post('/addCategory',isLoggedIn,  function(req,res){
  var pro = req.user
var category = req.body.category;



   req.check('category','Enter Category').notEmpty();

 
   
   var errors = req.validationErrors();
        
   if (errors) {
   
     req.session.errors = errors;
     req.session.success = false;
     res.render('product/catg',{ errors:req.session.errors,pro:pro})
   
 }
 else{
   
     Category.findOne({'name':category})
     .then(dept =>{
         if(dept){ 

        req.session.message = {
         type:'errors',
          message:'Category already exists'
        }     
           res.render('product/catg', {
              message:req.session.message ,pro:pro
           })
         }else
 
   var cat = new Category();
 
   cat.name = category;
 
  

 
 
   cat.save()
     .then(dep =>{
      
       req.session.message = {
         type:'success',
         message:'Cateegory added'
       }  
       res.render('product/catg',{message:req.session.message,pro:pro});
   
 
   })
 
     .catch(err => console.log(err))
   
   
   })
 }
 
 
})



router.get('/viewCategories',isLoggedIn, function(req,res){
  var pro = req.user
  Category.find((err, doc) => {
   if (!err) {
   
       res.render("product/catgList", {
          
           list: doc,pro:pro
         
           
       });
     
   }
  });
  
  
})



//update category

router.get('/category/:id',isLoggedIn, function(req,res){
  var pro = req.user
Category.findById(req.params.id, (err, doc) => {
 if (!err) {
 
     res.render("product/catgUpdate", {
        
         doc: doc,pro:pro
       
         
     });
   
 }
});



})


router.post('/category/:id',isLoggedIn,   (req, res) => {
var pro = req.user
var m = moment()

var id = req.params.id;
var name = req.body.category;


req.check('name','Enter Category').notEmpty();



 
var errors = req.validationErrors();



if (errors) {

  
     req.session.errors = errors;
     req.session.success = false;
     res.render('product/catgUpdate',{ errors:req.session.errors,pro:pro})
  
 
 }

else
{

  Category.findByIdAndUpdate(id,{$set:{name:name}},function(err,locs){

  })


res.redirect('/viewCategories')
 
}

});



  // this route is for deleting a category
  router.get('/category/delete/:id',isLoggedIn, (req, res) => {

    Category.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
          res.redirect('/viewCategories');
      }
      else { console.log('Error in deleting subject :' + err); }
    });
    });

//add Customers

router.get('/addCustomer',isLoggedIn,function(req,res){
  var pro = req.user
  res.render('product/cust',{pro:pro})
})



router.post('/addCustomer',isLoggedIn,  function(req,res){
  var pro = req.user
var customer = req.body.customer;
var code = req.body.code

   req.check('customer','Enter Customer').notEmpty();
   req.check('code','Enter Code').notEmpty();
 
   
   var errors = req.validationErrors();
        
   if (errors) {
   
     req.session.errors = errors;
     req.session.success = false;
     res.render('product/cust',{ errors:req.session.errors,pro:pro})
   
 }
 else{
   
     Customer.findOne({'name':customer})
     .then(dept =>{
         if(dept){ 

        req.session.message = {
         type:'errors',
          message:'Customer already exists'
        }     
           res.render('product/cust', {
              message:req.session.message ,pro:pro
           })
         }else
 
   var cat = new Customer();
 
   cat.name = customer;
   cat.code = code
 
  

 
 
   cat.save()
     .then(dep =>{
      
       req.session.message = {
         type:'success',
         message:'Customer added'
       }  
       res.render('product/cust',{message:req.session.message,pro:pro});
   
 
   })
 
     .catch(err => console.log(err))
   
   
   })
 }
 
 
})



router.get('/viewCustomers',isLoggedIn, function(req,res){
  var pro = req.user
  Customer.find((err, doc) => {
   if (!err) {
   
       res.render("product/custList", {
          
           list: doc,pro:pro
         
           
       });
     
   }
  });
  
  
})



//update category

router.get('/customers/:id',isLoggedIn, function(req,res){
  var pro = req.user
Customer.findById(req.params.id, (err, doc) => {
 if (!err) {
 
     res.render("product/custUpdate", {
        
         doc: doc,pro:pro
       
         
     });
   
 }
});



})


router.post('/customers/:id',isLoggedIn,   (req, res) => {
var pro = req.user
var m = moment()

var id = req.params.id;
var name = req.body.customer;
var code = req.body.code


req.check('name','Enter Customer').notEmpty();



 
var errors = req.validationErrors();



if (errors) {

  
     req.session.errors = errors;
     req.session.success = false;
     res.render('product/custUpdate',{ errors:req.session.errors,pro:pro})
  
 
 }

else
{

  Category.findByIdAndUpdate(id,{$set:{name:name,code:code}},function(err,locs){

  })


res.redirect('/viewCustomers')
 
}

});



  // this route is for deleting a category
  router.get('/customer/delete/:id',isLoggedIn, (req, res) => {

    Customer.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
          res.redirect('/viewCustomers');
      }
      else { console.log('Error in deleting subject :' + err); }
    });
    });


//reverse stock received
router.get('/reverseRec',isLoggedIn, (req, res) => {
  var pro = req.user
  var m = moment()
var year = m.format('YYYY')
var dateValue = m.valueOf()
var mformat = m.format("L")
var date = m.toString()
Dispatch.find({mformat:mformat},(err, ocs) => {
if(ocs.length == 0){

  Stock.find({mformat:mformat},(err, docs) => {
      if (!err) {
          res.render("product/listChange", {
             list:docs,pro:pro
            
          });
      }
  });
}else{
  console.log('yes')
  res.render('product/listChange')
}
  })
  }); 





  
  
  router.post('/reverseRec/:id',isLoggedIn,function(req,res){
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
  



    
  router.get('/reverseDis',isLoggedIn, (req, res) => {
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


    router.post('/reverseDis/:id',isLoggedIn,function(req,res){
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
    
  //add Shop
           
router.get('/shopBatch',isLoggedIn,function(req,res){
  var pro = req.user
  res.render('product/batch2',{pro:pro})
})


  
  router.post('/shopBatch',isLoggedIn,  function(req,res){

    var customer = req.body.customer
   
    var id = req.user._id

    var pro = req.user
  
    

    req.check('customer','Enter Customer').notEmpty();
    
  
    
    var errors = req.validationErrors();
     
    if (errors) {
      req.session.errors = errors;
      req.session.success = false;
      res.render('product/batch2',{ errors:req.session.errors,pro:pro})
    
    }
    
    else 
    
    Customer.findOne({'name':customer})
    .then(grower =>{
    
      if(grower){

      
       
              User.findByIdAndUpdate(id,{$set:{customer:customer}}, function(err,coc){
            
          
      })

    }else{
      console.log('ma1')
      req.flash('success', 'Customer Does Not Exist!');
     
      req.session.cart = null;
      res.redirect('/shopBatch/');
     //res.render('product/update',{}) 
    }
      res.redirect('/addShop')
    
    
    })
    
    
    })



router.get('/addShop',isLoggedIn, function(req,res){
  var pro = req.user
  var id = req.user._id;

 User.findById(id,function(err,locs){


    if(locs.customer == 'null'){
      res.redirect('/shopBatch')
    }else
 
    var customer = locs.customer
  
  res.render('product/addShop2',{customer:customer,pro:pro})
 
  })
  })

router.post('/addShop',isLoggedIn, function(req,res){

  var customer = req.body.customer
  var shop  = req.body.shop
  var pro = req.user

  var m = moment()




    req.check('customer','Enter Customer').notEmpty();
    req.check('shop','Enter Shop').notEmpty();
   
    
  
    
    
    var errors = req.validationErrors();
     
    if (errors) {
  
      req.session.errors = errors;
      req.session.success = false;
      res.render('product/addShop2',{ errors:req.session.errors,pro:pro})
      
    
    }
    else{

    var book = new Shop();
    book.name = shop
    book.customer = customer

        
         
          book.save()
            .then(pro =>{
  
           
            
           
            
          
          })
        }
  res.redirect('/addShop')
  
  })


  router.get('/viewShops',isLoggedIn, function(req,res){
    var pro = req.user
    Shop.find((err, doc) => {
     if (!err) {
     
         res.render("product/shopList", {
            
             list: doc,pro:pro
           
             
         });
       
     }
    });
    
    
  })
  

  
router.get('/shop/:id',isLoggedIn, function(req,res){
  var pro = req.user
Shop.findById(req.params.id, (err, doc) => {
 if (!err) {
 
     res.render("product/shopUpdate", {
        
         doc: doc,pro:pro
       
         
     });
   
 }
});



})


router.post('/shop/:id',isLoggedIn,   (req, res) => {
var pro = req.user
var m = moment()

var id = req.params.id;
var name = req.body.name;
var customer = req.body.customer


req.check('name','Enter Shop').notEmpty();
req.check('customer','Enter Customer').notEmpty();


 
var errors = req.validationErrors();



if (errors) {

  
     req.session.errors = errors;
     req.session.success = false;
     res.render('product/shopUpdate',{ errors:req.session.errors,pro:pro})
  
 
 }

else
{

  Shop.findByIdAndUpdate(id,{$set:{name:name,customer:customer}},function(err,locs){

  })


res.redirect('/viewShops')
 
}

});



  // this route is for deleting a category
  router.get('/shop/delete/:id',isLoggedIn, (req, res) => {

    Shop.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
          res.redirect('/viewShops');
      }
      else { console.log('Error in deleting subject :' + err); }
    });
    });



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

   
    res.render('product/notList',{list:docs})

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

    
    res.render('product/notView',{message:message, subject:subject,status4:status4,user:user,date:date,senderPhoto:senderPhoto})
  })

})





//enter grower bales for contracted growers
router.get('/merchPreset',isLoggedIn,  function(req,res){
  var pro = req.user
  res.render('product/batch',{pro:pro})
  })
  
  
  
  

  router.get('/view2',isLoggedIn,function(req,res){
    var pro = req.user
    res.render("barcode/listing", {
    pro:pro
     
   });
  })

 
  
  router.post('/merchPreset',isLoggedIn,  function(req,res){
  var merchandiser = req.body.merchandiser;
  var customer = req.body.customer
  var photo = req.body.photo
  var id = req.user._id
  var userId = req.body.id
  var pro = req.user
  var email = req.body.email
  
  
  req.check('merchandiser','Enter Name of Merchandiser').notEmpty();
  req.check('customer','Enter Customer').notEmpty();
  

  
  var errors = req.validationErrors();
   
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
    res.render('product/batch',{ errors:req.session.errors,pro:pro})
  
  }
  
  else 
  
  User.findOne({'merchandiser':merchandiser})
  .then(grower =>{
  
    
     
            User.findByIdAndUpdate(id,{$set:{customer:customer,merch:merchandiser,userId:userId,photo2:photo,username:email}}, function(err,coc){
          
        
    })
    res.redirect('/set')
  
  
  })
  
  
  })


  // buying from contracted farmers
router.get('/set',isLoggedIn, function(req,res){
  var pro = req.user
  var id = req.user._id;

 User.findById(id,function(err,locs){


    if(locs.merch == 'null'){
      res.redirect('/merchPreset')
    }else
    var merch =locs.merch
    var customer = locs.customer
  
  res.render('product/addShop',{merch:merch,customer:customer,pro:pro})
 
  })
  })
  
  



  router.post('/set',isLoggedIn, function(req,res){
  var merchandiser = req.body.merchandiser
  var customer = req.body.customer
  var shop  = req.body.shop
  var userId = req.user.userId
  var pro = req.user
  var photo = req.user.photo2
  var username = req.user.username

  var m = moment()
  var year = m.format('YYYY')
  var dateValue = m.valueOf()


var date = m.format('L')
    req.check('merchandiser','Enter Merchandiser').notEmpty();
    req.check('customer','Enter Customer').notEmpty();
    req.check('shop','Enter Shop').notEmpty();
   
    
  
    
    
    var errors = req.validationErrors();
     
    if (errors) {
  
      req.session.errors = errors;
      req.session.success = false;
      res.render('product/addShop',{ errors:req.session.errors,pro:pro})
      
    
    }
    else{

    var book = new Preset();
    book.merchandiser = merchandiser
    book.customer = customer
    book.shop = shop
    book.dateAdded = date
    book.dateModified= date
    book.photo = photo
    book.username=username
    book.userId = userId

        
         
          book.save()
            .then(pro =>{
  
           
            
           
            
          
          })
        }
  res.redirect('/set')
  
  })


  router.get('/merchPreset/:id',function(req,res){
    var pro = req.user
    var successMsg = req.flash('success')[0];
 Preset.findById(req.params.id, (err, doc) => {
   if (!err) {
   
       res.render("product/update", {
          
           doc: doc,pro:pro,successMsg: successMsg, noMessages: !successMsg
         
           
       });
     
   }
});


  })






  
router.post('/merchPreset/:id',isLoggedIn,   (req, res) => {
  var pro = req.user
  var m = moment()
  var fullname = req.user.fullname
  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
  var _id = req.params.id;
  
  var merchandiser = req.body.merchandiser;
  var shop = req.body.shop
  var customer = req.body.customer
 

  req.check('merchandiser','Enter Merchandiser').notEmpty();
  req.check('customer','Enter Customer').notEmpty();
  req.check('shop','Enter Shop').notEmpty();

 
  
    
  var errors = req.validationErrors();
 
 
 
   if (errors) {
  
     
        req.session.errors = errors;
        req.session.success = false;
       // res.render('product/update',{ errors:req.session.errors,pro:pro})
      
        req.flash('success', req.session.errors[0].msg);
       
        
        res.redirect('/merchPreset/'+_id);
    
    }
  
 else
 {
   Shop.findOne({'customer':customer,'shop':shop})
    .then(loc=>{
     if(loc){
      Preset.findOne({'customer':customer,'shop':shop})
  .then(pre =>{
if(!pre){
  User.findOne({'fullname':merchandiser})
  .then(user =>{

    if(user){
      let username= user.email
      let photo = user.photo
      let userId = user._id


      Preset.findByIdAndUpdate(_id,{$set:{merchandiser:merchandiser,userId:userId,shop:shop,customer:customer,photo:photo, username:username, dateModified:date }},function(err,docs){

      })


    }
  

  })
}
else{
  console.log('ma1')
  req.flash('success', 'User Does Not Exist!');
 
  req.session.cart = null;
  res.redirect('/merchPreset/'+_id);
 //res.render('product/update',{}) 
}
})
     }
     else{
      console.log('ma1')
      req.flash('success', 'Customer Or Shop Does Not Exist!');
     
      req.session.cart = null;
      res.redirect('/merchPreset/'+_id);
     //res.render('product/update',{}) 
    }
   })
 
 
  

 

 
 res.redirect('/merchPreset')
    
 }

 
 });
 


 router.get('/viewAllocations',isLoggedIn,function(req,res){
  var pro = req.user
 Preset.find({},(err, docs) => {
      if (!err) {
          res.render("barcode/listing", {
             list:docs,pro:pro
            
          });
      }
  });
})

 

     //role admin
   //this routes autocompletes the fullname of the teacher to be allocated a lesson
   router.get('/autocompleteUser/',isLoggedIn, function(req, res, next) {

   
     var regex= new RegExp(req.query["term"],'i');
    
     var uidFilter =User.find({role:'merchant', fullname:regex},{'fullname':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
   
     
     uidFilter.exec(function(err,data){
    
   
   console.log('data',data)
   
   var result=[];
   
   if(!err){
      if(data && data.length && data.length>0){
        data.forEach(sub=>{
   
         
      
   
           
          let obj={
            id:sub._id,
            label: sub.fullname,
   
        
          /*  name:name,
            surname:surname,
            batch:batch*/
           
           
        
          
           
   
            
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
   router.post('/autoUser',isLoggedIn,function(req,res){
     var code = req.body.code
   
   
     User.find({fullname:code,role:'merchant'},function(err,docs){
    if(docs == undefined){
      res.redirect('/dash')
    }else
   
       res.send(docs[0])
     })
   
   
   })
   
   //////////////////
   router.get('/autocompleteShop/',isLoggedIn, function(req, res, next) {

   
    var regex= new RegExp(req.query["term"],'i');
    var customer = req.user.customer
   
    var uidFilter =Shop.find({ customer:customer,name:regex},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
    
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
  router.post('/autoShop',isLoggedIn,function(req,res){
    var code = req.body.code
  
  
    Shop.find({name:code},function(err,docs){
   if(docs == undefined){
     res.redirect('/dash')
   }else
  
      res.send(docs[0])
    })
  
  
  })
   





  router.get('/autocompleteCustomer/',isLoggedIn, function(req, res, next) {

   
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
  router.post('/autoCustomer',isLoggedIn,function(req,res){
    var code = req.body.code
  
  
    Shop.find({customer:code},function(err,docs){
   if(docs == undefined){
     res.redirect('/dash')
   }else
  
      res.send(docs[0])
    })
  
  
  })
   










  //cust
  
  router.get('/autocompleteCust/',isLoggedIn, function(req, res, next) {

   
    var regex= new RegExp(req.query["term"],'i');
    
   
    var uidFilter =Customer.find({ name:regex},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
    
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
  router.post('/autoCustomer',isLoggedIn,function(req,res){
    var code = req.body.code
  
  
   Customer.find({name:code},function(err,docs){
   if(docs == undefined){
     res.redirect('/dash')
   }else
  
      res.send(docs[0])
    })
  
  
  })
   







  router.get('/import',isLoggedIn,function(req,res){
    var pro = req.user
        var successMsg = req.flash('success')[0];
     res.render('product/imports',{pro:pro,successMsg: successMsg, noMessages: !successMsg})
   })
   
 
   
   router.post('/import', isLoggedIn,upload.single('file'),  (req,res)=>{
    var pro = req.user
   
     if(!req.file){
        /* req.session.message = {
           type:'errors',
           message:'Select File!'
         }     
           res.render('product/imports', {message:req.session.message}) */

           console.log('ma1')
           req.flash('success','Select File');
          
   
           res.redirect('/import');
         }else if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            /* req.session.message = {
                 type:'errors',
                 message:'Upload Excel File'
               }     
                 res.render('product/imports', {message:req.session.message,pro:pro
                      
                  }) */
                  console.log('ma1')
                  req.flash('success', 'Upload excel file');
                 
                
                  res.redirect('/import');
   
   
   
         }
           
         else{
      
 
         
             const file = req.file.filename;
     
             
                  var wb =  xlsx.readFile('./public/uploads/' + file)
          
                  var sheets = wb.Sheets;
                  var sheetNames = wb.SheetNames;
      
                  var sheetName = wb.SheetNames[0];
      var sheet = wb.Sheets[sheetName ];
      
         for (var i = 0; i < wb.SheetNames.length; ++i) {
          var sheet = wb.Sheets[wb.SheetNames[i]];
      
          console.log(wb.SheetNames.length)
          var data =xlsx.utils.sheet_to_json(sheet)
              
          var newData = data.map(async function (record){
      
         
        
       
           
          
 
 
           
 
 req.body.name = record.name     
 req.body.price = record.price  
 req.body.barcodeNumber = record.barcodeNumber
 req.body.zwl = record.zwl
 req.body.category = record.category  
 req.body.rate = record.rate
 req.body.quantity = record.quantity
 req.body.unitCases = record.unitCases
 req.body.cases = record.cases
 req.body.rcvdQuantity = record.rcvdQuantity
 req.body.openingQuantity = record.openingQuantity

            
 
             
         
            // try{
               req.check('price','Enter price').notEmpty();
               req.check('name','Enter Name').notEmpty();
               req.check('barcodeNumber','Enter Barcode Number').notEmpty();
               req.check('zwl','Enter ZWL').notEmpty();
               req.check('category','Enter Category').notEmpty();
            
               req.check('quantity','Enter Quantity').notEmpty();
               req.check('unitCases','Enter Case Units').notEmpty();
               req.check('rate','Enter Rate').notEmpty();
              
            
 
 
               var errors = req.validationErrors();
   
               if (errors) {
                 
                 req.session.errors = errors;
                 req.session.success = false;
                 for(let x=0;x<req.session.errors.length;x++){
                  // throw new SyntaxError(req.session.errors[x].msg +" "+"on line")
                   req.flash('success', req.session.errors[x].msg);
                    

                   res.redirect('/import');
                 }
               
           }
 
 
       else{

       
         
           var product = new Product();
                   product.name = req.body.name;
                   product.price = req.body.price
                   product.barcodeNumber = req.body.barcodeNumber;
                   product.quantity = req.body.quantity;
                   product.rate = req.body.rate;
                   product.category= req.body.category;
                   product.zwl = req.body.zwl;
                   product.cases = req.body.cases
                   product.unitCases = req.body.unitCases
                   product.rcvdQuantity = req.body.rcvdQuantity
                   product.openingQuantity = req.body.openingQuantity
                   
             
                 
                  
                   product.save()
                     .then(productId =>{
                      console.log('ma1')
                      /*req.flash('success', 'Upload Successfull');
                     
         
                      res.redirect('/import');*/
                       
                    
                     })
              
                      
                    
                   }  
                     // .catch(err => console.log(err))
                 //  }
                 /*  catch(e){
                     //res.send(e.message)

                  
                    }*/
                     })
                   
                    
          
                   }
                   
                   
                     
                     
         
                    
         
                   req.flash('success', 'Upload Successfull');
                     
         
                   res.redirect('/import');                  
              
                 }
       
         
   
   
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
  
    
    