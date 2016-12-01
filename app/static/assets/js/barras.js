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

$(".view").css("display", "none");

$(".view").css("background-color","transparent");
$(".view").css('color', 'black');



console.log("testa la isso open black");

$( ".open" ).click(function() {
  $(".view").css("display", "block");
});


