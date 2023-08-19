$(document).ready( function () {
    $('table#example').DataTable({
		dom: 'Bfrtip',
		"searching": true,
		"paging": true,
		"order": [[ 0, "asc" ]],
		"ordering": true,
		"columnDefs": [{
			"targets": [1], /* column index */
			"orderable": true
		},
		{
			"targets": [ 0 ],
			"visible": true,
			"searchable": true
		}],
		buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
	});
});