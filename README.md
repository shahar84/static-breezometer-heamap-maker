# Static Heat-map generator

A server side generator for static maps using the BreezoMeter AQI Heat-map tile server  

## Getting Started

Clone the repo to your machine.

Run `npm install`

Update in the index file you BreezoMeter API key and MapBox Token.

Update the lat, lon and zoom level.

Run the script `node index.js`


### Prerequisites

You need to have Node >=8 in order to run the script.


## Deployment

At the moment this is just the first version.
In  the next version, add an option to run express server to create an api to generate maps.

## Built With

* [puppeteer](https://github.com/GoogleChrome/puppeteer) - Puppeteer is a Node library which provides a high-level API to control headless Chrome

## Authors

* **Shahar Polak** 
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
