$(".showFeed").on("click", showHiddenFeed);

function showHiddenFeed() {
    if ($(".feedCol").css("display") == "none") {
        $(".feedCol").css("display", "block");
        $(".centerSection").removeClass("col-xs-10");
        $(".centerSection").addClass("col-xs-7");
    } else {
        $(".feedCol").css("display", "none");
        $(".centerSection").removeClass("col-xs-7");
        $(".centerSection").addClass("col-xs-10");
        $(".section-resized").css("padding-right", "5vw");
    }
}


$(".pr-btn").on("click", prbtn);

function prbtn() {
    if ($(".pr-content").css("display") == "none") {
        $(".pr-content").css("display", "block");
        $(".pr-btn").css("background-color", "#4ca7af");

    } else {
        $(".pr-content").css("display", "none");
        $(".pr-btn").css("background-color", "#000000");

    }


}



//———————————————————— BOTOES


//———————————————————— Processes


$(".viewpro").css("display", "none");

$(".viewpro").css("background-color", "transparent");
$('.viewpro').css('color', 'black');
$(".viewpro").css("font-size", "10pt");
$(".viewpro").css("font-weight", "semibold");

console.log("testa la isso % 12");

//var pro = 2;

$(".openpro").click(function () {
    $(".viewwork").css("display", "none");
    $(".viewproj").css("display", "none");
    $(".viewart").css("display", "none");
    
    $(".viewpro").toggle();

});


//———————————————————— works


$(".viewwork").css("display", "none");

$(".viewwork").css("background-color", "transparent");
$(".viewwork").css('color', 'black');
$(".viewwork").css("font-size", "10pt");
$(".viewwork").css("font-weight", "semibold");


$(".openwork").click(function () {
    $(".viewpro").css("display", "none");
    $(".viewproj").css("display", "none");
    $(".viewart").css("display", "none");

    $(".viewwork").toggle();
});


//———————————————————— Project


$(".viewproj").css("display", "none");

$(".viewproj").css("background-color", "transparent");
$(".viewproj").css('color', 'black');
$(".viewproj").css("font-size", "10pt");
$(".viewproj").css("font-weight", "semibold");


$(".openproj").click(function () {
    $(".viewpro").css("display", "none");
    $(".viewwork").css("display", "none");
    $(".viewart").css("display", "none")

    $(".viewproj").toggle();
});


//———————————————————— Artifacts


$(".viewart").css("display", "none");

$(".viewart").css("background-color", "transparent");
$(".viewart").css('color', 'black');
$(".viewart").css("font-size", "10pt");
$(".viewart").css("font-weight", "semibold");


$(".openart").click(function () {
    $(".viewpro").css("display", "none");
    $(".viewwork").css("display", "none");
    $(".viewproj").css("display", "none");

    $(".viewart").toggle();
});