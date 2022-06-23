function update_path() {
    fetch("./path_config.json")
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            for (let obj in json)
            {
                for (let key in json[obj])
                {
                    if ($(key).attr("href") !== undefined)
                        $(key).attr("href", json[obj][key]);
                    else
                        $(key).attr("src", json[obj][key]);
                }
            }
        });
}

async function load_all() {
    await new Promise((resolve, reject) => {
        $("header").load("../header.html", () => {
            $("#burger").on("click", function() {
                $("#side_menu").toggleClass("active");
                if ($("#burger").hasClass("fa fa-fw fa-navicon"))
                    $("#burger").removeClass("fa fa-fw fa-navicon").addClass("fa-solid fa-fw fa-xmark");
                else
                    $("#burger").removeClass("fa-solid fa-fw fa-xmark").addClass("fa fa-fw fa-navicon");
            });
            resolve("ok");
        });
    });
    await new Promise((resolve, reject) => {
        $("#side_menu").load("../side_menu.html", () => {
            resolve("ok");
        });
    });
    update_path();
}

load_all();