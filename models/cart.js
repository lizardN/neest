module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.totalPrice2 = oldCart.totalPrice2 || 0;

    this.add = function(item, id,qty, date, ) {

      console.log(item,'itm')
        let reg = /\d+\.*\d*/g;

        let result = qty.match(reg)
        let quan = Number(result)
        
        var storedItem = this.items[id];
        
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0, price2:0,qty:quan,   status:'pending', date:date};
        }
      
 /*else if(storedItem.qty >= pqty){
    console.log(storedItem.qty,'storedItem2')
        console.log(pqty,'product quantity2')
    storedItem.qty;
    storedItem.price = storedItem.item.price * storedItem.qty;
    storedItem.price2 = storedItem.item.price2 * storedItem.qty;
    this.totalQty;
    this.totalPrice = storedItem.item.price;
    this.totalPrice2 = storedItem.item.price2;
 } else */
        storedItem.qty = quan;
        storedItem.price = storedItem.item.price * storedItem.qty;
        storedItem.price2 = storedItem.item.price2 * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
        console.log(this.totalPrice,'totalPrice 4')
        this.totalPrice2 += storedItem.item.price2;
        console.log(storedItem.qty,'storedItem4')

    };

    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};