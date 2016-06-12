/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MediaLibrary from '../containers/mediaLibrary';
import Playlist from '../containers/playlist';

// electron only
// const {remote} = require('electron');
// const {Menu, MenuItem, dialog} = remote;
// const fs = require('fs');
// const path = require('path');

import { createDefaultSign, updateMediaFolder } from '../actions/index';
import { saveBSNPresentation } from '../actions/index';

// import { fetchSign }  from '../actions/index';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // electron only
    // handleOpenPresentation() {
    //
    //     var self = this;
    //
    //     const options = {
    //         title: 'Open Presentation',
    //         filters: [
    //             { name: 'Presentations', extensions: ['bpf'] }
    //         ]
    //     }
    //     dialog.showOpenDialog(options, filenameDir => {
    //         self.props.fetchSign(filenameDir[0]);
    //     })
    // }
    //
    // handleSavePresentation() {
    //
    //     var self = this;
    //
    //     const options = {
    //         title: 'Save Presentation',
    //         filters: [
    //             { name: 'Presentations', extensions: ['bpf'] }
    //         ]
    //     }
    //     dialog.showSaveDialog(options, filename => {
    //         self.savePresentation(filename);
    //     })
    // }
    //
    // // TODO - move these functions somewhere, but not sure where
    // savePresentation(filePath) {
    //
    //     const presentation = JSON.stringify(this.props.sign, null, 2);
    //
    //     fs.writeFile(filePath, presentation, () => {
    //         console.log("writeFile successful");
    //     })
    // }
    //
    // handleBrowseForMediaLibrary() {
    //
    //     var self = this;
    //
    //     dialog.showOpenDialog({
    //         properties: ['openDirectory']
    //     }, function (directories) {
    //         if (directories) {
    //             const mediaFolder = directories[0];
    //             self.props.updateMediaFolder(mediaFolder);
    //         }
    //     })
    // }
    
    componentDidMount() {

        console.log("ba.js::componentDidMount invoked");

        // const sign = new Sign();
        this.props.createDefaultSign();
        
        // electron only
        // var self = this;
        //
        // const menuTemplate = [
        //     {
        //         label: 'File',
        //         submenu: [
        //             {
        //                 label: 'Open Presentation',
        //                 click: function() {
        //                     self.handleOpenPresentation();
        //                 }
        //             },
        //             {
        //                 label: 'Save Presentation',
        //                 click: function() {
        //                     self.handleSavePresentation();
        //                 }
        //             },
        //             {
        //                 label: 'Open Media Library',
        //                 click: function() {
        //                     self.handleBrowseForMediaLibrary();
        //                 }
        //             }
        //         ]
        //     }
        // ];
        //
        // if (process.platform === 'darwin') {
        //     const name = remote.app.getName();
        //     menuTemplate.unshift({
        //         label: name,
        //         submenu: [
        //             {
        //                 label: 'About ' + name,
        //                 role: 'about'
        //             },
        //             {
        //                 type: 'separator'
        //             },
        //             {
        //                 label: 'Services',
        //                 role: 'services',
        //                 submenu: []
        //             },
        //             {
        //                 type: 'separator'
        //             },
        //             {
        //                 label: 'Hide ' + name,
        //                 accelerator: 'Command+H',
        //                 role: 'hide'
        //             },
        //             {
        //                 label: 'Hide Others',
        //                 accelerator: 'Command+Alt+H',
        //                 role: 'hideothers'
        //             },
        //             {
        //                 label: 'Show All',
        //                 role: 'unhide'
        //             },
        //             {
        //                 type: 'separator'
        //             },
        //             {
        //                 label: 'Quit',
        //                 accelerator: 'Command+Q',
        //                 click: function() {
        //                     remote.app.quit();
        //                 }
        //             },
        //         ]
        //     });
        // }
        //
        // const menu = Menu.buildFromTemplate(menuTemplate);
        // Menu.setApplicationMenu(menu);
    }


    onSavePresentation() {
        console.log("save presentation, name it ", this.refs.presentationName.value);

        const presentation = JSON.stringify(this.props.sign, null, 2);
        // const presentation = JSON.stringify(this.props.sign);

        this.props.saveBSNPresentation(this.refs.presentationName.value, presentation);
    }

    render () {

        let signName = <p>No sign yet</p>;
        if (this.props.sign) {
            signName = this.props.sign.name;
        }

        // onBrowseForMediaLibrary={this.handleBrowseForMediaLibrary.bind(this)}

        return (

            <div>
                <div>
                    <p>{signName}</p>
                </div>

                <div>
                    <button onClick={this.onSavePresentation.bind(this)}>Save Presentation</button>
                </div>

                <div>
                    <input
                        type="text"
                        id="bsnPresentationName"
                        ref="presentationName"/>
                </div>

            <div className="bangPageContainer">
                    <div>
                        <MediaLibrary
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
    return bindActionCreators({ saveBSNPresentation, createDefaultSign: createDefaultSign, updateMediaFolder: updateMediaFolder }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BA);
