class MapParser
{
    constructor()
    {
        this.cities = null;
    }

    async parseTopoJson()
    {
        return new Promise((resolve, reject) => {
            d3.json("./assets/Taiwan_topo.json")
            .then((data) => {
                this.cities = topojson.feature(data, data.objects.COUNTY_MOI_1090820);
                console.log(this.cities)
            })
            .then(() => {
                resolve();
            });
        })
    }

    getCityName(location)
    {
        let point = [location.coords.longitude, location.coords.latitude];

        for (let city of this.cities.features)
        {
            if (d3.geoContains(city, point))
                return city.properties.COUNTYNAME; //中文
        }

        throw new Error("unkonw location");
    }
};

export {MapParser};