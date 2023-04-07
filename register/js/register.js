//解析login form的資料
function parseFormData() 
{
    let formData = new FormData(document.getElementById("register_form"));
    return formData;
}

//向後端傳送資料並接收資料
function uploadData(formData)
{
    // "http://localhost:8000/api/register.php"
    // "https://api-steel-sigma.vercel.app/api/register.php"
    fetch("https://api-steel-sigma.vercel.app/api/register.php", {
        method: "POST",
        body: formData,
        headers: {
            "Methods": "POST"
        }
    })
    .then((res) => res.json())
    .then((json) => {
        if (json["state"] === 400)
        {
            alert("帳號已存在，請前往登入");
        }
        else if (json["state"] === 200)
        {
            alert("帳號創建成功，請前往登入");
        }
        window.location.replace(`${window.location.protocol}//${window.location.host}/login/login.html`);
    });
}

const registerForm = document.getElementById("register_form");
registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (document.getElementById("input_password").value !== document.getElementById("input_password_again").value)
    {
        alert("密碼不一致");
        document.getElementById("input_password").value = "";
        document.getElementById("input_password_again").value = "";
    }
    else
        uploadData(parseFormData());
});