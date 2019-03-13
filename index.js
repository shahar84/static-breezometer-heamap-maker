const puppeteer = require('puppeteer');
const axios = require('axios');

const breezometerAPIKey = `<Your breezometer API key>`;
const mapboxAccessToken = '<Your MapBox access token>';

const localFile = (filePath) => `file://${process.cwd()}/${filePath}`;
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

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
    lat: 51.49634719159713,
    lon: -0.1421356201171875,
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
    params.aqi = await getAqi(params.lat, params.lon);
    await makeImage(params)
};
run();
