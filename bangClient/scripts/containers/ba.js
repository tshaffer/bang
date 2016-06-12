/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MediaLibrary from '../containers/mediaLibrary';
import Playlist from '../containers/playlist';

// electron only
const {remote} = require('electron');
const {Menu, MenuItem, dialog} = remote;
const fs = require('fs');
const path = require('path');

// import { Sign } from '../badm/sign';

import { createDefaultSign, updateMediaFolder } from '../actions/index';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // electron only
    handleOpenPresentation() {

        var self = this;

        const options = {
            title: 'Open Presentation',
            filters: [
                { name: 'Presentations', extensions: ['bpf'] }
            ]
        }
        dialog.showOpenDialog(options, filenameDir => {
            self.openPresentation(filenameDir[0]);
        })
    }

    handleSavePresentation() {

        var self = this;

        const options = {
            title: 'Save Presentation',
            filters: [
                { name: 'Presentations', extensions: ['bpf'] }
            ]
        }
        dialog.showSaveDialog(options, filename => {
            self.savePresentation(filename);
        })
    }

    // TODO - move these functions somewhere, but not sure where
    openPresentation(filePath) {
        console.log("openPresentation, filePath=", filePath);

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                throw err;
                return;
            }
            console.log("fs.ReadFile successful");
            var sign = JSON.parse(data);
        })
    }


    savePresentation(filePath) {

        const presentation = JSON.stringify(this.props.sign, null, 2);

        fs.writeFile(filePath, presentation, () => {
            console.log("writeFile successful");
        })
    }

    handleBrowseForMediaLibrary() {

        var self = this;

        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, function (directories) {
            if (directories) {
                const mediaFolder = directories[0];
                self.props.updateMediaFolder(mediaFolder);
            }
        })
    }
    
    componentDidMount() {

        console.log("ba.js::componentDidMount invoked");

        // const sign = new Sign();
        this.props.createDefaultSign();
        
        // electron only
        var self = this;

        const menuTemplate = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Open Presentation',
                        click: function() {
                            self.handleOpenPresentation();
                        }
                    },
                    {
                        label: 'Save Presentation',
                        click: function() {
                            self.handleSavePresentation();
                        }
                    },
                    {
                        label: 'Open Media Library',
                        click: function() {
                            self.handleBrowseForMediaLibrary();
                        }
                    }
                ]
            }
        ];

        if (process.platform === 'darwin') {
            const name = remote.app.getName();
            menuTemplate.unshift({
                label: name,
                submenu: [
                    {
                        label: 'About ' + name,
                        role: 'about'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Services',
                        role: 'services',
                        submenu: []
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Hide ' + name,
                        accelerator: 'Command+H',
                        role: 'hide'
                    },
                    {
                        label: 'Hide Others',
                        accelerator: 'Command+Alt+H',
                        role: 'hideothers'
                    },
                    {
                        label: 'Show All',
                        role: 'unhide'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Quit',
                        accelerator: 'Command+Q',
                        click: function() {
                            remote.app.quit();
                        }
                    },
                ]
            });
        }

        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
    }


    render () {

        let signName = <p>No sign yet</p>;
        if (this.props.sign) {
            signName = this.props.sign.name;
        }

        return (
            <div className="bangPageContainer">
                <p>{signName}</p>
                <div>
                    <MediaLibrary
                        onBrowseForMediaLibrary={this.handleBrowseForMediaLibrary.bind(this)}
                    />
                    <Playlist />
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
    return bindActionCreators({ createDefaultSign: createDefaultSign, updateMediaFolder: updateMediaFolder }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BA);
