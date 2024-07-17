import { MarkdownPreviewer } from "../js/MarkdownPreviewer.js";

function headTagToPriority(tag) 
{
    tag = tag.toLowerCase();
    if (tag == "h1")
        return 5;
    else if (tag == "h2")
        return 4;
    else if (tag == "h3")
        return 3;
    else if (tag == "h4")
        return 2;
    else if (tag == "h5")
        return 1;
}

function processOutline() 
{
    let markdownBody = document.querySelector(".markdown-previewer-body");
    let heads = markdownBody.querySelectorAll("h1, h2, h3, h4, h5");
    let outline = document.querySelector(".outline .outline-list-body");
    let li_list = [];
    for (let i = 0; i < heads.length; ++i)
    {
        //建立每一個head成li
        let element = heads[i];
        let new_li = document.createElement("li");
        let new_a = document.createElement("a");
        new_a.textContent = element.textContent;
        
        //currying function
        //為了保持target這個不在lambda scope的變數
        let onClick = (target) => {
            return () => {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        };
        new_a.addEventListener("click", onClick(element));
        new_li.appendChild(new_a);
        li_list.push(new_li);
        
        // 找前面第一個大於我的head在哪個O(n^2)
        // 應該可以用演算法優化，如二分搜或left[]利用前面資訊快速找，應可壓到O(nlogn)，暫時不做
        let parent;
        for (parent = i - 1; parent >= 0; --parent)
        {
            if (headTagToPriority(heads[parent].tagName) > headTagToPriority(heads[i].tagName))
                break;
        }
        //是不是已經是最上層了
        if (parent < 0)
        {
            outline.appendChild(li_list[i]);
        }
        else
        {
            li_list[parent].appendChild(li_list[i]);
        }
    }
}

// main

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has("path"))
{
    let path = urlParams.get("path").split("-");
    //get current url without file name
    let currURL = window.location.href;
    let workspace = currURL.substring(0, currURL.lastIndexOf('/'));
    for (let i = 0; i < path.length - 1; ++i)
        workspace += `/${path[i]}`;
    
    // fetch("../Notes/SG/SG.md")
    fetch(`${workspace}/${path[path.length - 1]}.md`)
    .then((res) => {
        return res.text()
    })
    .then((markdown) => {
        let previewer = new MarkdownPreviewer();
        previewer.renderMarkdown(markdown, workspace);
    })
    .then(() => {
        processOutline()
    })
}

document.querySelector(".outline .expand-btn").addEventListener("click", (e) => {
    e.target.closest(".outline").classList.toggle("expanded");
});