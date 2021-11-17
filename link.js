#!/usr/bin/env node

var request = require('request');
var env = require('dotenv');
var fs = require('fs'); 
var parse = require('csv-parse');
var csv = require('fast-csv');
var path = require('path');
const { createSecureServer } = require('http2');


const appendFile = fs.appendFile;

//adding checkout link commander CLI
const program  = require ("commander");
const package  = require ("./package.json");

program.version(package.version);



process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
/**
 * To configure your system please run 
 *  ruby -ropenssl -e "p OpenSSL::X509::DEFAULT_CERT_FILE"
 *  Export your result though the variable SSL_CERT_FILE at the .env file 
 */
let csvStream = csv.format({ headers: true });



const createLink = async function (data){
    let request_body  = { 
        device_id : data["device_id"],
        coupon_code : data["cupon"], 
        query_params : {
            utm_coupon : data["utm_coupon"] ,
            utm_campaign :data["utm_campaign"], 
            utm_source : data["utm_source"], 
            utm_seller : data["utm_seller"]
        } 
    };

    request({
        url: "https://internal-api.mercadopago.com/tlv-chop-checkout/api/checkout",
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'User-Agent': 'TLV-Point / Darwin BR0C02FJ9B9MD6M 20.6.0 / Darwin Kernel Version 20.6.0',
            Host: 'TEST'
          },
         body: request_body,
         json: true
    },
    async function(error, response, body){
        if (error) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
           return console.error(error);
        }
        else {
            //Showing short url 
            console.log("Result Short URL: "+body.short_url);
            //Showing short url 
            console.log("Result Long URL: "+body.long_url);
        }
    });
}



const createCSV = async function (file_name){

 
var stream = fs.createReadStream(file_name);   
csv
 .parseStream(stream, {headers : true})
 .on("data", function(data){

     console.log('I am one line of data', data);
     let request_body  = { 
            device_id : data["Device_ID"],
            coupon_code : data["Cupon Link"], 
            query_params : {
                utm_coupon : data["utm_coupon"] ,
                utm_campaign :data["utm_campaign"], 
                utm_source : data["utm_source"], 
                utm_seller : data["utm_seller"]
            } 
        };
    console.log("creating link for device:"+ JSON.stringify(request_body));
    request({
        url: "https://internal-api.mercadopago.com/tlv-chop-checkout/api/checkout",
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'User-Agent': 'TLV-Point / Darwin BR0C02FJ9B9MD6M 20.6.0 / Darwin Kernel Version 20.6.0',
            Host: 'TEST'
          },
         body: request_body,
         json: true
    },
    async function(error, response, body){
        if (error) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
           return console.error(error);
        }
        else {
            //var parsedLink = JSON.parse(response.body);
            console.log('Short-link:' + JSON.stringify(body)); 
            console.log(body);
            data['Link'] = body.long_url; 
            data['Short URL'] = body.short_url; 
            console.log("Result : "+JSON.stringify(data));
                  appendFile('./result-data.csv',  JSON.stringify(data)+ "\r\n", 'UTF-8', (err) => {
                    if(err) {
                        console.log(err); // Log
                    }
                    console.log('Success!');
                });
             
        }
    });
 }).on("end", function(){
     console.log("done");
 })
}


program
    .command('csv').description('Adicionar um to-do').action((args)=>{
        console.log("Exit:"+ todo);
        // let utm_campaign; 
        // if (!args) {
        //     utm_campaign = await inquirer.prompt([
        //         {
        //             type: 'input',
        //             name: 'utm_campaign',
        //             message: 'What is the utm_campaning?',
        //             validate: value => value ? true : 'Field is required'
        //         }
        //     ]);
        // }

        // createCSV();
    });
program
    .version('1.0.0')
    .command('chop').description('Create a CHOP Link solo')
    .argument('<device_id>', 'utm campaign')
    .argument('<cupon>', 'utm campaign')
    .argument('<utm_coupon>', 'utm campaign')
    .argument('<utm_campaign>', 'utm campaign')
    .argument('<utm_source>', 'utm source')
    .argument('<utm_seller>', 'utm seller')
    .action(async (device_id, cupon, utm_coupon, utm_campaign, utm_source,utm_seller)=>{

        var link = {
            "device_id" : device_id,
            "cupon" : cupon,
            "utm_cupon" : utm_coupon,
            "utm_campaign": utm_campaign,
            "utm_source": utm_source,
            "utm_seller":utm_seller
        }
        console.log(`here is your configuration ${JSON.stringify(link)}`);
        await createLink(link);

    });  

program.parse(process.argv);