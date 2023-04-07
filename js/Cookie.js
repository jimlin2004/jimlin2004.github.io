class Cookie
{
    static get(key)
    {
        let keyIndex = document.cookie.indexOf(key);
        if (keyIndex === -1)
            return "";
        let endIndex = document.cookie.indexOf(";", keyIndex);
        if (endIndex === -1)
            endIndex = document.cookie.length;
        let subStr = document.cookie.substring(keyIndex, endIndex);
        return subStr.substring(subStr.indexOf("=") + 1, subStr.length);
    }

    static deleteAll()
    {
        let cookies = document.cookie.split("; ");
        let key = "";
        for (let cookie of cookies)
        {
            key = cookie.substring(0, cookie.indexOf("="));
            document.cookie = `${key}=;path=/`;
        }
    }

    static set(key, value, path = "path=/")
    {
        document.cookie = `${key}=${value};${path}`;
    }
};

export {Cookie};