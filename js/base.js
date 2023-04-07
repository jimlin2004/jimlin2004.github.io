function update_path() {
    fetch("../component/path_config.json")
        .then((res) => res.json())
        .then((json) => {
            for (let obj in json)
            {
                for (let key in json[obj])
                {
                    if ($(key).attr("href") !== undefined)
                        $(key).attr("href", json[obj][key]);
                    else
                        $(key).attr("src", json[obj][key]);
                }
            }
        });
}

//<execute>
update_path();
//</execute>