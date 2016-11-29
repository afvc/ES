$('#formEdit').load(function() {
    if ($('#radioSync').val()) {
        $('.edit').prop('readonly', true);
        $('.change').css({ 'background': '#f0f0f0' });
    } else {
        $('.edit').prop('readonly', false);
        $('.change').css({ 'background': '#ffffff' });
    }
    
    $('#radioNoSync').change(function(e) {
        var selectedValue = $(this).val();
        $('.change').prop('readonly', false);
        $('.change').css({ 'background': '#ffffff' }); 
    });

    $('#radioSync').change(function(e) {
        var selectedValue = $(this).val();
        $('.change').prop('readonly', true);
        $('.change').css({ 'background': '#f0f0f0' });
    });
});



