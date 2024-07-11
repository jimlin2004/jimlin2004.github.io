import { MarkdownPreviewer } from "../js/MarkdownPreviewer.js";

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
}
