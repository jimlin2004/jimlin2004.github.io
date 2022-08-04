class Github_processor
{
    constructor() 
    {
        this.user_data = {};
        this.repos_img = new Map();
        this.github_url_prefix = "https://raw.githubusercontent.com/jimlin2004";
    }

    async get_user_data()
    {
        let response = await fetch("https://api.github.com/users/jimlin2004/repos");
        this.user_data = await response.json();
    }

    add_log_data() 
    {
        for (let i = 0; i < this.user_data.length; i++)
        {
            $("#s_github").append(new Option(this.user_data[i].name, i.toString()));
        }
    }

    async init()
    {
        await this.get_user_data();
        await this.add_log_data();
        await this.get_repos_readme()
        await this.add_image_into_slideshow();
    }

    print_description() 
    {
        let des = this.user_data[parseInt($("#s_github").val())].description;
        if (des == null)
            $("#description").html("沒有敘述");
        else
            $("#description").html(des);
    }

    parse_readme(txt, repo_name)
    {
        for (let line of txt.split('\n'))
        {
            if (line.includes("![image]"))
            {   
                if (!this.repos_img.has(repo_name))
                    this.repos_img.set(repo_name, new Array());
                let img_path = line.substring(line.indexOf("http"), line.length - 2);
                img_path = img_path.replace("/blob", "");
                img_path = img_path.replace("github.com", "raw.githubusercontent.com");
                this.repos_img.get(repo_name).push(img_path);
            }
        }
    }

    async get_repos_readme()
    {
        for (let repo of this.user_data)
        {
            let response = await fetch(`${this.github_url_prefix}/${repo.name}/${repo.default_branch}/README.md`);
            let txt = await response.text();
            await this.parse_readme(txt, repo.name);
        }
    }

    add_image_into_slideshow()
    {
        this.repos_img.forEach((arr, key) => {
                arr.forEach((img_path) => {
                    $(".swiper .swiper-wrapper").append(
                        `<div class = "swiper-slide">
                            <img src = ${img_path}>
                        </div>`
                    );
                })
        });
    }
}


$(function() {
    var github_processor = new Github_processor();
    github_processor.init()
    .then(() => {
            const swiper = new Swiper(
            ".swiper", {
                loop: true,
                pagination: {
                    el: ".swiper-pagination"
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                },
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false
                }
            });
        }
    );

    

    $("#b_selected").on("click", function (){
        github_processor.print_description();
    });
});