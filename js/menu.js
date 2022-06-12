$(function() {    
    $("#burger").on("click", function() {
        $("#side_menu").toggleClass("active");
        if ($("#burger").hasClass("fa fa-fw fa-navicon"))
            $("#burger").removeClass("fa fa-fw fa-navicon").addClass("fa-solid fa-fw fa-xmark");
        else
        $("#burger").removeClass("fa-solid fa-fw fa-xmark").addClass("fa fa-fw fa-navicon");
    });
});