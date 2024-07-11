# Markdown Previewer

> 用於html中嵌入Markdown文件渲染

## How to use

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel = "stylesheet" href = "./css/MarkdownPreviewer.css">
        <link rel = "stylesheet" href = "./lib/prism/prism.css">
        <link  rel = "stylesheet" href = "./lib/katex/katex.min.css">
        <link rel = "stylesheet" href = "./lib/markdown-it-texmath/css/texmath.css">
        <script src = "./lib/katex/katex.min.js" defer></script>
        <script src = "./lib/prism/prism.js" defer></script>
        <script src = "./lib/markdown-it.min.js" defer></script>
        <script src = "./lib/markdown-it-texmath/texmath.js"></script>

        <script type = "module" src = "./js/MarkdownPreviewer.js" defer></script>
    </head>
    <body>
        <div class = "markdown-previewer-body"></div>
    </body>
</html>
```

如此```<div class = "markdown-previewer-body"></div>```將會作為渲染markdown的div

## Dependencies

+ [Markdown-it]("https://github.com/markdown-it/markdown-it")
+ [Markdown-it-texmath]("https://github.com/goessner/markdown-it-texmath")
+ [Prismjs]("https://prismjs.com/")
+ [KaTeX]("https://github.com/KaTeX/KaTeX")
