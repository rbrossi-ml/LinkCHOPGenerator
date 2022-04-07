#!/usr/bin/env node

var request = require('request');
var sleep = require('sleep');
var env = require('dotenv');
var fs = require('fs');
var parse = require('csv-parse');
var csv = require('fast-csv');
var path = require('path');
//Configure environment variables
env.config();
// Trying secure connection

//const { createSecureServer } = require('http2');
const appendFile = fs.appendFile;

//adding checkout link commander CLI
const program = require("commander");
const package = require("./package.json");

//Set program version
program.version(package.version);

//get API url 
let api_url = process.env.API_URL;

console.log(`API: ${api_url}`);

//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

/**
 * To configure your system please run 
 *  ruby -ropenssl -e "p OpenSSL::X509::DEFAULT_CERT_FILE"
 *  Export your result though the variable SSL_CERT_FILE at the .env file 
 */

let csvStream = csv.format({ headers: true });



const createLink = async function (data) {
    let request_body = {
        device_id: data["device_id"],
        coupon_code: data["cupon"],
        origin: data["origin"],
        query_params: {
            utm_coupon: data["utm_coupon"],
            utm_campaign: data["utm_campaign"],
            utm_source: data["utm_source"],
            utm_seller: data["utm_seller"]
        }
    };

    request({
        url: api_url,
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'User-Agent': 'TLV-Point / Darwin BR0C02FJ9B9MD6M 20.6.0 / Darwin Kernel Version 20.6.0',
            Host: 'TEST'
        },
        body: request_body,
        json: true
    },
        async function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                return console.error(error);
            }
            else {
                //Showing short url 
                console.log("Result Short URL: " + body.short_url);
                //Showing short url 
                console.log("Result Long URL: " + body.long_url);
            }
        });
}



const createCSV = async function (input_file, output_file) {

    //CSV Headers list 
    let header = "Device_Name,Device_ID,Origin,Cupon Link,utm_campaign,utm_source,utm_seller,Long url,Short URL";

    appendFile(output_file, header + "\r\n", 'UTF-8', (err) => {
        if (err) {
            console.log(err); // Log
        }
        console.log('Headers created suscessfully');
    });

    var stream = fs.createReadStream(input_file);
    csv
        .parseStream(stream, { headers: true })
        .on("data", function (data) {
            console.log('I am one line of data', data);
            let request_body = {
                device_id: data["Device_ID"],
                coupon_code: data["Cupon Link"],
                origin: data["Origin"],
                query_params: {
                    utm_coupon: data["utm_coupon"],
                    utm_campaign: data["utm_campaign"],
                    utm_source: data["utm_source"],
                    utm_seller: data["utm_seller"]
                }
            };
            //console.log("creating link for device:" + JSON.stringify(request_body));
            sleep.msleep(50); 
            request({
                url: api_url,
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'User-Agent': 'TLV-Point / Darwin BR0C02FJ9B9MD6M 20.6.0 / Darwin Kernel Version 20.6.0',
                    Host: 'TEST'
                },
                body: request_body,
                json: true
            },
                async function (error, response, body) {
                    if (error) {
                        console.log('error:', error); // Print the error if one occurred
                        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        return console.error(error);
                    }
                    else {
                        //var parsedLink = JSON.parse(response.body);
                        //console.log('Short-link:' + JSON.stringify(body));
                        //console.log(body);
                        data['Link'] = body.long_url;
                        data['Short URL'] = body.short_url;
                        //console.log("Result : " + JSON.stringify(data));

                        let line = `${data["Device_Name"]},${data["Device_ID"]},${data["Origin"]},${data["Cupon Link"]},${data["utm_campaign"]},${data["utm_source"]},${data["utm_seller"]},${data["Link"]},${data["Short URL"]}`;

                        appendFile(output_file, line+ "\r\n", 'UTF-8', (err) => {
                            if (err) {
                                console.log(err); // Log
                            }
                            console.log('New line added! Success!');
                        });

                    }
                });
        }).on("end", function () {
            console.log("done");
        })
}

// CSV read a csv file and generates another one within the links as output. 
program
    .command('csv').description('Create a link based on a CSV file')
    .argument('<input_file>')
    .argument('<output_file>')
    .action((input_file, output_file) => {
        console.log("Starting generating CSV links");
        createCSV(input_file, output_file);
    });
// CHOP Link generates only one link     
program
    .command('chop').description('Create one chop link only')
    .argument('<device_id>', 'device id')
    .argument('<origin>', 'origin chanel')
    .argument('<cupon>', 'utm cupon')
    .argument('<utm_coupon>', 'utm campaign')
    .argument('<utm_campaign>', 'utm campaign')
    .argument('<utm_source>', 'utm source')
    .argument('<utm_seller>', 'utm seller')
    .action(async (device_id, origin, cupon, utm_coupon, utm_campaign, utm_source, utm_seller) => {

        var link = {
            "device_id": device_id,
            "cupon": cupon,
            "origin": origin,
            "utm_cupon": utm_coupon,
            "utm_campaign": utm_campaign,
            "utm_source": utm_source,
            "utm_seller": utm_seller
        }
        console.log(`here is your configuration ${JSON.stringify(link)}`);
        await createLink(link);

    });

program.parse(process.argv);