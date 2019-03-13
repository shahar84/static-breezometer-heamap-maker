const puppeteer = require('puppeteer');
const axios = require('axios');

const breezometerAPIKey = `<Your breezometer API key>`;
const mapboxAccessToken = '<Your MapBox access token>';

const localFile = (filePath) => `file://${process.cwd()}/${filePath}`;
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const getArgs  = () =>{
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
            // long arg
            if (arg.slice(0,2) === '--') {
                const longArg = arg.split('=')
                args[longArg[0].slice(2,longArg[0].length)] = longArg[1]
            }
            // flags
            else if (arg[0] === '-') {
                const flags = arg.slice(1,arg.length).split('')
                flags.forEach(flag => {
                    args[flag] = true
                })
            }
        });
    return args
}



const getAqi = async (lat, lon) => {
    const url = `https://api.breezometer.com/air-quality/v2/current-conditions?lat=${lat}&lon=${lon}&key=${breezometerAPIKey}`;
    return axios.get(url)
        .then(response => {
            const {data} = response;
            return data.data.indexes.baqi.aqi
        })
        .catch(error => {
            console.log(error);
        });
};

const encodeQueryData = (data) => {
    const ret = [];
    for (let d in data) {
        if (data.hasOwnProperty(d)) {
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        }
    }
    return ret.join('&');
};

const params = {
    lat: null,
    lon: null,
    zoom: 11,
    width: 800,
    height: 600,
    mapboxAccessToken: mapboxAccessToken,
    breezometerAPIKey: breezometerAPIKey
};

const makeImage = async (data) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({width: data.width, height: data.height});
    const url = `/public/map.html?${encodeQueryData(data)}`;
    console.log(url);
    await page.goto(localFile(url));
    await delay(100);
    await page.screenshot({path: 'map.jpg'});
    await browser.close();
};

const run = async () => {
    const args = getArgs();
    const data = {...params, ...args};
    if (!data.lat || !data.lon) throw new Error('Lat and Lon params are mandatory');
    data.aqi = await getAqi(data.lat, data.lon);
    await makeImage(data)
};
run();
