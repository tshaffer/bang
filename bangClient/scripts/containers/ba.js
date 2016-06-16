/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MediaLibrary from '../containers/mediaLibrary';
import Playlist from '../containers/playlist';

import axios from 'axios';

import BAUI from '../platform/baUI';

import { getAllThumbs, createDefaultSign, selectMediaFolder, updateMediaFolder } from '../actions/index';

// these should be mutually exclusive
import { saveBSNPresentation } from '../actions/index';
import { fetchSign }  from '../actions/index';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bsnPresentations: []
        };

        this.baUI = new BAUI(this);

        this.db = null;
        this.dbName = "BADatabase-0";
    }

    componentWillMount() {

        // indexedDB tests
        var request = window.indexedDB.open(this.dbName, 4);

        request.onerror = function(event) {
            // Do something with request.errorCode!
            alert("Database error: " + event.target.errorCode);
        };
        request.onupgradeneeded = function(event) {
            console.log("openDB.onupgradeneeded invoked");
            this.db = event.target.result;

            var store = this.db.createObjectStore("thumbFiles");

            store.transaction.oncomplete = function(event) {
                console.log("createObjectStore transaction complete");
                console.log("poop1");
                console.log("poop2");
                // // Store values in the newly created objectStore.
                // var transaction = this.db.transaction(["thumbFiles"], "readwrite");
                //
                // var request = objectStore.add();
                // request.onsuccess = function(event) {
                //     // event.target.result == customerData[i].ssn;
                // };
                // var thumbFilesObjectStore = this.db.transaction("thumbFiles", "readwrite").objectStore("thumbFiles");
                // thumbFilesObjectStore.add("thumb1.jpg", "/users/tedshaffer/Projects/thumb1.jpg");
                // thumbFilesObjectStore.add("thumb2.jpg", "/users/tedshaffer/Projects/thumb2.jpg");
            };
        };
        request.onsuccess = function(event) {
            // Do something with request.result!
            console.log("request.onsuccess invoked");
            console.log("poop1");
            console.log("poop2");
            this.db = event.target.result;

            // var tx = this.db.transaction("thumbFiles", "readwrite");
            // let objectStore = tx.objectStore("thumbFiles");
            // var request = objectStore.add("/users/tedshaffer/Projects/thumb3.jpg", "thumb3");
            // request.onsuccess = function(event) {
            //     console.log("add success 1");
            //     console.log("add success 2");
            //     var returnedKey = event.target.result;
            //     console.log("returnedKey=", returnedKey);
            // };

            var objectStore = this.db.transaction("thumbFiles").objectStore("thumbFiles");

            objectStore.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    console.log("Item " + cursor.key + " is " + cursor.value);
                    cursor.continue();
                }
                else {
                    console.log("No more entries!");
                }
            };
        };



        this.props.getAllThumbs();
    }

    componentDidMount() {

        console.log("ba.js::componentDidMount invoked");

        this.props.createDefaultSign();

        this.baUI.init();
    }

    render () {

        console.log("ba.js::render invoked");

        let signName = <p>No sign yet</p>;
        if (this.props.sign) {
            signName = this.props.sign.name;
        }
        
        const openSavePresentationJSX = this.baUI.getOpenSavePresentationJSX(this.state.bsnPresentations);
        
        return (

            <div>
                <div>
                    <p>{signName}</p>
                </div>

                {openSavePresentationJSX}

            <div className="bangPageContainer">
                    <div>
                        <MediaLibrary
                            onBrowseForMediaLibrary={this.baUI.handleBrowseForMediaLibrary.bind(this.baUI)}
                        />
                        <Playlist />
                    </div>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sign: state.sign
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAllThumbs, fetchSign, saveBSNPresentation, createDefaultSign: createDefaultSign, selectMediaFolder, updateMediaFolder: updateMediaFolder }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BA);
