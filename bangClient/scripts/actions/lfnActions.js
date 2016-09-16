var request = require('request');
const xml2js = require('xml2js');

function invokeLFNGet(endPoint) {

    return new Promise( (resolve, reject) => {

        var parser = new xml2js.Parser();
        // var parser = new xml2js.Parser( { explicitArray: false } );

        var propertiesObject = { };

        var options = {
            url: endPoint,
            qs: propertiesObject,
        };

        function callback(error, bsResponse, data) {
            if (!error && bsResponse.statusCode == 200) {

                parser.parseString(data, function (err, result) {
                    resolve(result);
                });
            }
            if (error) {
                reject(error);
            }
            else if (bsResponse.statusCode != 200) {
                reject(bsResponse.statusCode);
            }
        }

        request(options, callback);
    });
}


export function getCurrentBrightSignStatus(ipAddress) {

    ipAddress = "10.1.0.155";

    return function(dispatch, getState) {

        console.log("actions/lfnActions.js::getCurrentBrightSignStatus invoked");


        let state = getState();

        invokeLFNGet("http://" + ipAddress + ":8080/GetCurrentStatus").then((response)=> {
            debugger;

            // interesting conversion, e.g.:
            // unitName = response.BrightSignStatus.unitName[0]._
            // modelName = response.BrightSignStatus.model[0]._
        });
    };
}

export function getBrightSignId(ipAddress) {

    ipAddress = "10.1.0.155";

    return function(dispatch, getState) {

        console.log("actions/lfnActions.js::getBrightSignId invoked");


        let state = getState();

        invokeLFNGet("http://" + ipAddress + ":8080/GetID").then((response)=> {
            debugger;
        });
    };
}
