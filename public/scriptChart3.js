
var button = document.getElementById('buttonC').addEventListener('click', function(){
 

    /*  var id = document.getElementsByClassName('h-400px min-h-auto')[0].id;
      var uid = 	document.getElementById('uid').value
      
      var name = id+uid
      document.getElementById(id).id = name*/
      
      let customer = document.getElementById('customer2').value
      let shop = document.getElementById('shop2').value
    
      let date = document.getElementById('dateXC').textContent

      console.log(date,'date')
  
      const labels1= []
      const labels2= []
   
    let labelsX=[]
      
    
    
          let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#FFA07A','#FFFF00'];
      
      //contractQty
     const  element = document.getElementById('myChartCS');
  
      const height = parseInt(KTUtil.css(element, 'height'));
    
      const labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
      const borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color'); 
   
      const options = {
          series:[],
          chart: {
              fontFamily: 'inherit',
              type: 'bar',
              height: height,
              toolbar: {
                  show: false
              }              
          },
          plotOptions: {
              bar: {
                  horizontal: false,
                  columnWidth: ['28%'],
                  borderRadius: 5,                     
                  dataLabels: {
                      position: "top" // top, center, bottom
                  },
                  startingShape: 'flat'
              },
          },
          legend: {
              show: false
          },
          dataLabels: {
              enabled: true, 
              offsetY: -28,                                             
              style: {
                  fontSize: '13px',
                  colors: [labelColor]
              }                         
          },
          stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
          },
          xaxis: {
              categories:labels2,
              axisBorder: {
                  show: false,
              },
              axisTicks: {
                  show: false
              },
              labels: {
                  style: {
                      colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                      fontSize: '13px'
                  }                    
              },
              crosshairs: {
                  fill: {         
                      gradient: {         
                          opacityFrom: 0,
                          opacityTo: 0
                      }
                  }
              }
          },
          yaxis: {
              labels: {
                  style: {
                      colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                      fontSize: '13px'
                  },
                  formatter: function (val) {
                      return  parseInt(val)
                  }
              }
          },
          fill: {
              opacity: 1
          },
          states: {
              normal: {
                  filter: {
                      type: 'none',
                      value: 0
                  }
              },
              hover: {
                  filter: {
                      type: 'none',
                      value: 0
                  }
              },
              active: {
                  allowMultipleDataPointsSelection: false,
                  filter: {
                      type: 'none',
                      value: 0
                  }
              }
          },
          tooltip: {
              style: {
                  fontSize: '12px'
              },
              y: {
                  formatter: function (val) {
                      return  val 
                  }
              }
          },
          colors: [KTUtil.getCssVariableValue('--bs-primary'), KTUtil.getCssVariableValue('--bs-light-primary')],
          grid: {
              borderColor: borderColor,
              strokeDashArray: 4,
              yaxis: {
                  lines: {
                      show: true
                  }
              }
          }
      };
  
  
  
   
  
  
  
  
  
  
    const chart = new ApexCharts(element, options);
   chart.render()
  
      // Set timeout to properly get the parent elements width
     /*setTimeout(function() {
                chart.render(); 
               
      }, 400); */
      
      
      
      
      $.ajax({
         
          dataType: 'json',
          type: 'POST',
          data:{customer:customer, shop:shop, date:date},
          url: "/dashChartC",
          success: function(data) {
      console.log(data,'data')
      let labels3=[]
      let labels4=[]
      for (var i = 0;i<data.length;i++){
          labels3.push({"x":data[i].category,"y":data[i].qty})
          // labels3.push(data[i].qty)
           }
      
           console.log(labels3,'labels')
           chart.updateSeries([{
              name: 'Sales',
              data: labels3,
              
          
            }])
  
      
      
          }
      
          })
      })  
      
          
   
   

    
    
  