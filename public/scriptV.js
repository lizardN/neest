var initDaterangepicker = function() {
    // Check if jQuery included
    if (typeof jQuery == 'undefined') {
        return;
    }

    // Check if daterangepicker included
    if (typeof $.fn.daterangepicker === 'undefined') {
        return;
    }

    var elements = [].slice.call(document.querySelectorAll('[data-kt-daterangepicker="true"]'));
    var start = moment().subtract(29, 'days');
    var end = moment();
    
    elements.map(function (element) {
        var display = element.querySelector('div');
        var attrOpens  = element.hasAttribute('data-kt-daterangepicker-opens') ? element.getAttribute('data-kt-daterangepicker-opens') : 'left';

        var cb = function(start, end) {
            if (display) {
                display.innerHTML = start.format('D MMM YYYY') + ' - ' + end.format('D MMM YYYY');
            }
        }

        $(element).daterangepicker({
            startDate: start,
            endDate: end,
            opens: attrOpens,
            ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

        cb(start, end);
    });
}