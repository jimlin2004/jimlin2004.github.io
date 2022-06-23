async function add_to_form() {
    let files = document.getElementById("image_files").files;
    let form = new FormData();
    for (let i = 0; i < files.length; i++)
    {
        form.append(`img_${i}`, files[i]);
    }
        
    return form;
}

$(function() {
    $("#submit").on("click", () => {
        add_to_form()
            .then((form) => {
                console.log(form);
            });
    });
});