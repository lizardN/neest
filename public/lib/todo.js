

    var labels1= []
    var labels2= []
    var labels3= []
    var labels4= []






   

  document.addEventListener('DOMContentLoaded', function() {


     
    var calendarE1 = document.getElementById('calendar');

    $.ajax({
   
        dataType: 'json',
        type: 'POST',
        url: "/records/calendarChart",
        success: function(data) {
  draw(data.map(obj=>{
      return{
          title:obj.title,
          start:obj.start,
          end:obj.end
          
        
      }
  }))
       
  
    }
})
  
        });

function draw(data){
    var calendarE1 = document.getElementById('calendar');
    var todayDate = moment().startOf('day');
    var YM = todayDate.format('YYYY-MM');
    var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
    var TODAY = todayDate.format('YYYY-MM-DD');
    var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');
    
    var calendar = new FullCalendar.Calendar(calendarE1,
        {
          initialView:'dayGridMonth',
          initialDate:Date.now(),
          headerToolbar: {
            left:'prev, next today',
            center:'title',
            right:'dayGridMonth, timeGridWeek, timeGridDay,listMonth'
          },
          height: 800,
          contentHeight: 780,
          aspectRatio: 3,  // see: https://fullcalendar.io/docs/aspectRatio

          nowIndicator: true,
      // just for demo

          views: {
              dayGridMonth: { buttonText: 'month' },
              timeGridWeek: { buttonText: 'week' },
              timeGridDay: { buttonText: 'day' }
          },

          initialView: 'dayGridMonth',
          initialDate: TODAY,

          editable: true,
          dayMaxEvents: true, // allow "more" link when too many events
          navLinks: true,
          events:data
    
      });
      calendar.render();

  
          
}