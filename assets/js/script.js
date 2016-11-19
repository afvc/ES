//(function ($) {
//    $.fn.toggleDisabled = function () {
//        return this.each(function () {
//            this.disabled = !this.disabled;
//        });
//    };
//})(jQuery);


//$(".editar").toggleDisabled();


//$("#btn").on("click", function () {
    //alert("Está prestes a alterar as suas informações da aplicação, contudo não serão atualizadas no git. Deseja continuar?");
    //console.log($(this).text());
//    $(".editar").toggleDisabled();
//});


$('.edit').prop('readonly', true);
//$('.change').css("border", "2px solid light");
$('.change').css({ 'background': '#f0f0f0' });

$('#algo').change(function(e){
    var selectedValue = $(this).val();
    $('.change').prop('readonly', false);
    $('.change').css({ 'background': '#ffffff' }); 
});

$('#algo1').change(function(e){
    var selectedValue = $(this).val();
    $('.change').prop('readonly', true);
    $('.change').css({ 'background': '#f0f0f0' });
});


//function myFunction() {
//    confirm("Não pode alterar as informações do GIT");
//}