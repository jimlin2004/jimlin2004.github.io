//解析login form的資料
function parseFormData() 
{
    let formData = new FormData(document.getElementById("login_form"));
    return formData;
}

//向後端傳送資料並接收資料
function uploadData(formData)
{
    fetch("https://api-steel-sigma.vercel.app/api/login.php", {
        method: "POST",
        body: formData,
        headers: {"Content-Type": "multipart/form-data"}
    })
    .then((res) => res.json())
    .then((json) => {
        console.log(json);
    })
}

const loginForm = document.getElementById("login_form");
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    uploadData(parseFormData());
});