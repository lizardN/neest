"use strict";
var KTPricingGeneral=function(){
    var n,t,e,a=function(t)
    {
        [].slice.call(n.querySelectorAll("[data-kt-plan-price-month]")).map((
            function(n){
                var e=n.getAttribute("data-kt-plan-price-month"),a=n.getAttribute("data-kt-plan-price-annual");"month"===t?n.innerHTML=e:"annual"===t&&(n.innerHTML=a)
            }
            ))};
            return{
                init:function(){
                
                    n=document.querySelector("#kt_pricing"),t=n.querySelector('[data-kt-plan="month"]'),e=n.querySelector('[data-kt-plan="annual"]'),t.addEventListener("click",(
                        function(n){
                            n.preventDefault(),a("month")
          
             document.getElementById('a2').hidden = true 
             document.getElementById('a1').hidden = false

           
             
                        })),e.addEventListener("click",(
                            function(n){
                                n.preventDefault(),a("annual")
                                document.getElementById('a2').hidden = false 
                                document.getElementById('a1').hidden = true 

                                
                            }))
                        }
                    }
                }();KTUtil.onDOMContentLoaded((function(){KTPricingGeneral.init()}));