$("#feed").on("click", showHiddenFeed);

function showHiddenFeed() {
    if ($("#hiddenFeed").css("display") == "none") {
        $("#hiddenFeed").css("display", "block");
    } else {
        $("#hiddenFeed").css("display", "none");

    }
}
