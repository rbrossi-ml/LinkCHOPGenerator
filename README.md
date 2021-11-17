# CHOP Link Generator CLI 

This app generates Links from CHOP Checkout APP based on a CSV file. 

## Installation process 

Select some place in your machine and them clone the repository application. 

using HTTPs:  
```kotlin 
    git clone https://github.com/rbrossi-ml/LinkCHOPGenerator.git
```
or using SSH: 
```kotlin 
    git clone https://github.com/rbrossi-ml/LinkCHOPGenerator.git
```
run npm install inside the product folder.

```kotlin 
    npm install
```
to link the application to your operational system, inside de application golder run. 

```kotlin 
    npm link
```

Now you can start use the CHOP Link Generator CLI

## How to? 

### Through a CSV file.
Select some folder were you can donwload your CSV File. 

The structure of this file have to follow the rules bellow in terms of hearder's name. 

| Field/Header name | Description | 
|-------------------|:------------| 
| Device_Name |        `Device name` 	|
| Device_ID	   |     `Device ID`
| Cupon Origen	|    `Cupon origim (Marketing tools)`|
| Cupon Link	|        `Cupon Link (Marketing tools)`|
| utm_campaign	 |   `Marketing campaign that this link will be associated`|
| utm_source      |    `Source of this link come from`	|
| utm_seller	  |      `Agency or EPS associated to it`|    
| Link	          |  `Empty field`  |  
| Short URL       |    `Empty field`|

Example of a Excel file, source of this tool inputs
![plot](./images/sample1.png)

Export it into a <code>CSV</code> file

and then run the command 

````
# link csv <src_folder>/<src_file>.csv <dest_folder>/<dest_file>.csv
````
The result is an CSV file with file containing fields Link and Short URL present.   

*NOTE: This is under construction in yet and might be necessary some interaction to copy it back to the original excel* 

### Through a CSV file.

To run this tool to generate only one file please do the follow 

````
# link chop <device_id> <cupon> <utm_coupon> <utm_campaign> <utm_source> <utm_seller> 
````
Mandatory parameters:

| Parameter name | Description | 
|-------------------|:------------| 
| device_id	   |     `Device ID`
| cupon	|    `Cupon origim (Marketing tools)`|
| utm_campaign	 |   `Marketing campaign that this link will be associated`|
| utm_source      |    `Source of this link come from`	|
| utm_seller	  |      `Agency or EPS associated to it`|    

The result will be the short url and long url displaied in your console client.

## This project strucutre

|Folder name| Description|
|-----------| :----------:|
|EXAMPLE| Example of CSV generation |
|images| Documentation's image repository| 


## In case of any doubt
pleade let us know 
ayuda-point-tlv@mecadolivre.com