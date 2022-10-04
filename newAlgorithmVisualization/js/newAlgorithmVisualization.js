//execute part
let switch_p = document.querySelector("#user_control_platform .platform_switch p");
let UCP = document.querySelector("#user_control_platform");

document.querySelector("#user_control_platform .platform_switch .cover").addEventListener("click", () => {
    if (switch_p.innerHTML === "▲")
        switch_p.innerHTML = "▼";
    else
        switch_p.innerHTML = "▲";
    if (UCP.classList.contains("active"))
        UCP.classList.remove("active");
    else
        UCP.classList.add("active")
});