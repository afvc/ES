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

$(".showAlerts").on("click", showAllerts);

function showAllerts() {
    if ($(".alerts").css("display") == "none") {
        $(".alerts").css("display", "block");
        $(".userAllerts").css("color", "red");

    } else {
        $(".alerts").css("display", "none");
        $(".userAllerts").css("color", "#171719");
    }
}