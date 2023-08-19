function formClick(){

    var barcodeNumber = document.getElementById('barcodeNumber').value
    var name = document.getElementById('name').value
    var category = document.getElementById('category').value
    var quantity = document.getElementById('quantity').value
    var shopName =document.getElementById('shopName').value
    var customer = document.getElementById('customer').value
    var dispatchedQty = document.getElementById('dispatchedQty').value
    console.log(barcodeNumber,'barcodeNumber')

    $.ajax({
url: '/dispatch',
data:{
barcodenumber:barcodeNumber,
name:name,
category:category,
quantity:quantity,
shopName:shopName,
customer:customer,
dispatchedQty:dispatchedQty
},
type: 'POST',
contentType: "application/json",


  success: function(data) {
 
window.location = 'http://localhost:9000/dispatch'
console.log('success')
    
  
}


});
}