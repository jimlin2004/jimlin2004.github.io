
class MarkdownPreviewer
{
    static getCodeLang(lang)
    {
        switch (lang)
        {
            case "cpp":
                return Prism.languages.cpp;
            case "py":
                return Prism.languages.py;
            default:
                throw new Error(`Unkonw language ${lang}`);
        }
    }

    //params:
    //  markdown: markdown原文
    //  workspace: 設定markdown的workspace，使相對路徑正確顯示
    renderMarkdown(markdown, workspace = null) 
    {
        let md = window.markdownit({
            html: true, // Enable HTML tags in source
            xhtmlOut: false, // Use '/' to close single tags (<br />)
            breaks: true, // Convert '\n' in paragraphs into <br>
            langPrefix: "language-", // CSS language prefix for fenced blocks
            linkify: true, // autoconvert URL-like texts to links
            typographer: true, // Enable smartypants and other sweet transforms
            // options below are for demo only
            _highlight: true,
            _strict: false,
            _view: "html", // html / src / debug
            highlight: function (code, lang) {
                if (lang)
                {
                    MarkdownPreviewer.getCodeLang(lang);
                    return Prism.highlight(code, MarkdownPreviewer.getCodeLang(lang), lang);
                }
                else
                    return "";
            }
        })
        .use(texmath, { engine: katex,
            delimiters: 'dollars',
            katexOptions: { macros: {"\\RR": "\\mathbb{R}"} } } );

        document.querySelectorAll(".markdown-previewer-body").forEach((markdownDiv) => {
            markdownDiv.innerHTML = md.render(markdown);
        });
        
        if (workspace != null)
        {
            console.log(workspace)
            document.querySelectorAll(".markdown-previewer-body img").forEach((img) => {
                if (!img.src.includes("https"))
                {
                    let imgFilename = img.src.substring(img.src.lastIndexOf('/') + 1);
                    img.src = workspace + '/' + imgFilename;
                }
            });
        }
    };
};

export { MarkdownPreviewer };