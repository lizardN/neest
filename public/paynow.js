

var button = document.getElementById('pay').addEventListener('click', function(){



    $.ajax({
   
        dataType: 'json',
        type: 'GET',
        data: {
            fees: 100,
            
        },
        url: "/student/onlinePayment",
        success: function(data) {
           console.log('ma1')
        }

    })


})





var buttonX = document.getElementById('pay2').addEventListener('click', function(){



    $.ajax({
   
        dataType: 'json',
        type: 'GET',
        data: {
            fees: 100,
            
        },
        url: "/student/onlinePayment2",
        success: function(data) {
           console.log('ma1')
        }

    })


})