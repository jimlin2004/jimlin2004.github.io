var git_data;

function log_data() {
    for (let i = 0; i < git_data.length; i++)
    {
        $("#s_github").append(new Option(git_data[i].name, i.toString()));
    }
}

function print_description() {
    let des = git_data[parseInt($("#s_github").val())].description;
    if (des == null)
        $("#description").html("沒有敘述");
    else
        $("#description").html(des);
}

$(document).ready(function(){    
    $.ajax({
        url: "https://api.github.com/users/jimlin2004/repos",
        dataType: "json",
        success: function(res) {
            git_data = res;
            console.log(git_data);
            log_data();
        },
        error: function() {
            alert("Error");
        }
    });
    $("#b_selected").click(function (){
        print_description();
    });
});