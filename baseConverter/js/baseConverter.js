class BaseConverter
{
    constructor()
    {
        this.base_2_input = document.getElementById("base_2_input");
        this.base_8_input = document.getElementById("base_8_input");
        this.base_10_input = document.getElementById("base_10_input");
        this.base_16_input = document.getElementById("base_16_input");
    }

    converter_2To10(data)
    {
        return parseInt(data, 2).toString(10);
    }

    converter_8To10(data)
    {
        return parseInt(data, 8).toString(10);
    }

    converter_16To10(data)
    {
        return parseInt(data, 16).toString(10);
    }

    converter_10To2(data)
    {
        return parseInt(data, 10).toString(2);
    }

    converter_10To8(data)
    {
        return parseInt(data, 10).toString(8);
    }

    converter_10To16(data)
    {
        return parseInt(data, 10).toString(16);
    }

    converter(data, input_base)
    {
        let decimal = parseInt(data, input_base).toString(10);
        this.base_2_input.value = this.converter_10To2(decimal);
        this.base_8_input.value = this.converter_10To8(decimal);
        this.base_10_input.value = decimal;
        this.base_16_input.value = this.converter_10To16(decimal);
    }
};

//execute part

let user_input = document.getElementById("user_input");
let select_base_type = document.getElementById("select_base_type");
let baseConverter = new BaseConverter();
user_input.addEventListener("input", () => {
    baseConverter.converter(user_input.value, select_base_type.value);
});