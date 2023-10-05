import { Cookie } from "../../js/Cookie.js";

//解析login form的資料
function parseFormData() 
{
    let formData = new FormData(document.getElementById("login_form"));
    return formData;
}

//向後端傳送資料並接收資料
function uploadData(formData)
{
    // "http://localhost:8000/api/login.php"
    // "https://api-steel-sigma.vercel.app/api/login.php"
    fetch("https://api-steel-sigma.vercel.app/api/login.php", {
        method: "POST",
        body: formData,
        headers: {
            "Methods": "POST"
        }
    })
    .then((res) => res.json())
    .then((json) => {
        Cookie.set("username", json["username"]);
        Cookie.set("email", json["email"]);

        window.location.replace(`${window.location.protocol}//${window.location.host}/index/index.html`);
    })
    .catch((error) => {
        // Todo: 後端的帳號或密碼不對的ErrorCode
        alert("帳號或密碼錯誤");
    });
}

const loginForm = document.getElementById("login_form");
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    uploadData(parseFormData());
});