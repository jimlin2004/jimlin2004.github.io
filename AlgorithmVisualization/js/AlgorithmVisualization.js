$(function() {
    const canvas = document.getElementById("main_canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = $("#main").width();
    canvas.height = $("#main").height() * 0.6;
});