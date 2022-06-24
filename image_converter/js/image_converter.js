async function add_to_form() {
    let files = document.getElementById("image_files").files;
    let form = new FormData();
    for (let file of files)
        form.append("img", file);
    return form;
}

$(function() {
    $("#submit").on("click", () => {
        add_to_form()
            .then((form) => {
                fetch("https://jimlinapi.jimlin3.repl.co/image_converter", {
                    method: "POST",
                    body: form
                });
            });
    });
});