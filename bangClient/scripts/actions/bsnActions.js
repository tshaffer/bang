var https = require('https');
var request = require('request');

import { fetch } from '../helpers/fetch';

function serialize(obj) {
    return Object.keys(obj).map(function(key) {
        return key + '=' + encodeURIComponent(obj[key]);
    }).join('&');
}

export const SET_BSN_AUTH_DATA = 'SET_BSN_AUTH_DATA';
export function setBSNAuthData(bsnAuthData) {
    return {
        type: SET_BSN_AUTH_DATA,
        payload: bsnAuthData
    };
}


export function getBSNAuthToken() {

    return function (dispatch, getState) {

        var postData = {};

        postData.username = "ted/ted@brightsign.biz";
        postData.scope = "full";
        postData.client_secret = "no";
        postData.grant_type = "password";

        postData.password = "admin";
        postData.client_id = 'BSN';

        var postDataStr = serialize(postData);

        var options = {
            hostname: 'ast.brightsignnetwork.com',
            port: 443,
            path: '/2017/01/REST/Token',
            method: 'POST',
            headers: {
                'Content-Type':'application/x-www-form-urlencoded',
            }
        };

        var str = "";

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                str += chunk;
            });
            res.on('end', function () {
                console.log(str);
                const authData = JSON.parse(str);
                dispatch(setBSNAuthData(authData));

                const state = getState();
            });
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });

        // write data to request body
        req.write(postDataStr);
        req.end();

    };
}


function invokeBSNGet(endPoint, bsnAuthData) {

    return new Promise( (resolve, reject) => {

        // let state = getState();
        //
        // const bsnAuthData = state.bsnAuthData;
        //
        // if (!bsnAuthData.userId) {
        //     return;
        // }

        // var options = {
        //     hostname: 'ast.brightsignnetwork.com',
        //     port: 443,
        //     path: '/2017/01/REST/' + endPoint,
        //     headers: {
        //         'Authorization': 'Bearer ' + bsnAuthData.access_token
        //     }
        // };
        //
        // var str = "";
        //
        // https.get(options, function (res) {
        //     res.on('data', function (d) {
        //         str += d;
        //     });
        //     res.on('end', function () {
        //         const data = JSON.parse(str);
        //         resolve(data);
        //     });
        //
        // }).on('error', function (err) {
        //     console.log('Caught exception: ' + err);
        //     reject(err);
        // });


        // var request = require('request');
        // var propertiesObject = { field1:'test1', field2:'test2' };
        //
        // request({url:url, qs:propertiesObject}, function(err, response, body) {
        //     if(err) { console.log(err); return; }
        //     console.log("Get response: " + response.statusCode);
        // });


        // var propertiesObject = { field1:'test1', field2:'test2' };
        var propertiesObject = { };

        var options = {
            url: 'https://ast.brightsignnetwork.com/2017/01/REST/' + endPoint,
            // qs: propertiesObject,
            headers: {
                'Authorization': 'Bearer ' + bsnAuthData.access_token
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                resolve(info);
            }
            if (error) {
                reject(error);
            }
        }

        console.log(options);

        // request(options, callback);

        request.get(options, callback);

    });
}


export function getBSNSelf() {

    return function(dispatch, getState) {

        console.log("actions/bsnActions.js::getBSNSelf invoked");

        let state = getState();

        const bsnAuthData = state.bsnAuthData;

        if (!bsnAuthData.userId) {
            return;
        }

        invokeBSNGet('self/', bsnAuthData).then((selfData)=> {
            debugger;
        });
    };
}

export function getBSNProfile() {

    return function(dispatch, getState) {

        console.log("actions/bsnActions.js::getBSNProfile invoked");

        let state = getState();

        const bsnAuthData = state.bsnAuthData;

        if (!bsnAuthData.userId) {
            return;
        }

        invokeBSNGet('self/Users/' + bsnAuthData.userId.toString() + '/Profile', bsnAuthData).then((bsnProfileData)=> {
            debugger;
        });
    };
}

export function getBSNNetworks() {

    return function(dispatch, getState) {

        console.log("actions/bsnActions.js::getBSNNetworks invoked");

        let state = getState();

        const bsnAuthData = state.bsnAuthData;

        if (!bsnAuthData.userId) {
            return;
        }

        invokeBSNGet('self/networks/', bsnAuthData).then((bsnNetworks)=> {
            debugger;
        });
    };
}

export function getMyBSNUsers() {

    return function(dispatch, getState) {

        console.log("actions/bsnActions.js::getMyBSNUsers invoked");

        let state = getState();

        const bsnAuthData = state.bsnAuthData;

        if (!bsnAuthData.userId) {
            return;
        }

        invokeBSNGet('self/users/', bsnAuthData).then((bsnUsers)=> {
            debugger;
        });
    };
}

// id = 12650 or 1540
export function getBSNUser(userId) {

    return function(dispatch, getState) {

        console.log("actions/bsnActions.js::getBSNUser invoked");

        let state = getState();

        const bsnAuthData = state.bsnAuthData;

        if (!bsnAuthData.userId) {
            return;
        }

        invokeBSNGet('self/users/' + userId.toString() + '/', bsnAuthData).then((bsnUser)=> {
            debugger;
        });
    };
}

export function getBSNAccountUsers() {

    return function(dispatch, getState) {

        console.log("actions/bsnActions.js::getAccountBSNUsers invoked");

        let state = getState();

        const bsnAuthData = state.bsnAuthData;

        if (!bsnAuthData.userId) {
            return;
        }

        invokeBSNGet('users/', bsnAuthData).then((bsnUsers)=> {
            debugger;
        });
    };
}


export function getBSNContent() {

    // {marker | pageIndex}, [pageSize], [filter], [sort]

    return function (dispatch, getState) {

        console.log("actions/bsnActions.js::getBSNContent invoked");

        let state = getState();

        const bsnAuthData = state.bsnAuthData;

        if (!bsnAuthData.userId) {
            return;
        }

        const marker = '';
        invokeBSNGet("content?marker=" + marker, bsnAuthData).then((bsnContent)=> {
        // invokeBSNGet("content/", bsnAuthData).then((bsnContent)=> {
            debugger;
        });
    };
}

export function getBSNGroups() {

    // {marker | pageIndex}, [pageSize], [filter], [sort]

    return function(dispatch, getState) {

        console.log("actions/bsnActions.js::getBSNGroups invoked");

        let state = getState();

        const bsnAuthData = state.bsnAuthData;

        if (!bsnAuthData.userId) {
            return;
        }

        // invokeBSNGet('groups?marker=0', bsnAuthData).then((bsnGroups)=> {
        // invokeBSNGet("content/?marker=" + marker, bsnAuthData).then((bsnContent)=> {
        // const marker = '';
        // invokeBSNGet("groups/?marker=" + marker, bsnAuthData).then((bsnGroups)=> {
        invokeBSNGet("groups/", bsnAuthData).then((bsnGroups)=> {
            debugger;
        });
    };
}

export function getBSNDevices() {

    // {marker | pageIndex}, [pageSize], [filter], [sort]

    return function(dispatch, getState) {

        console.log("actions/bsnActions.js::getBSNDevices invoked");

        let state = getState();

        const bsnAuthData = state.bsnAuthData;

        if (!bsnAuthData.userId) {
            return;
        }

        // debugger;
        // fetch('https://ast.brightsignnetwork.com/2017/01/REST/devices', {
        //     method: 'get'
        // }, dispatch, getState)
        //     .then(json => {
        //         debugger;
        //         // if(json.error) return dispatch(failLoadDevices(json.error_description))
        //         // dispatch(successLoadDevices(json))
        //     }, (statusText) => console.log(statusText))


        invokeBSNGet('devices/', bsnAuthData).then((bsnDevices)=> {
            debugger;
        });
    };
}

export function getBSNPresentations() {

    // {marker | pageIndex}, [pageSize], [filter], [sort]

    return function (dispatch, getState) {

        console.log("actions/bsnActions.js::getBSNPresentations invoked");

        let state = getState();

        const bsnAuthData = state.bsnAuthData;

        if (!bsnAuthData.userId) {
            return;
        }

        // const marker = '';
        // invokeBSNGet("presentations?marker=" + marker, bsnAuthData).then((bsnContent)=> {
        invokeBSNGet("presentations/", bsnAuthData).then((bsnContent)=> {
            debugger;
        });
    };
}

