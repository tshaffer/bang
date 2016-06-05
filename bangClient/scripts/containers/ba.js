/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import { setMediaLibraryContents } from '../actions/index';
import { getThumbs } from '../actions/index';

import MediaLibrary from '../containers/mediaLibrary';

// electron only
const {remote} = require('electron');
const {Menu, MenuItem, dialog} = remote;
const fs = require('fs');
const path = require('path');

class BA extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         mediaLibraryContents: []
    //     };
    //     this.photosById = {};
    //     this.selectedPhotos = {};
    // }


    // electron only
    handleBrowseForMediaLibrary() {

        var self = this;

        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, function (directories) {
            if (directories) {
                const mediaDirectory = directories[0];
                self.props.getThumbs(mediaDirectory);
                // const files = fs.readdirSync(mediaDirectory);
                // // self.props.setMediaLibraryContents(files);
                //
                // const mediaLibraryContents = [mediaDirectory, files[1]];
                // self.props.setMediaLibraryContents(mediaLibraryContents);
            }
        })
    }
    
    componentDidMount() {

        console.log("ba.js::componentDidMount invoked");

        // electron only
        var self = this;

        const menuTemplate = [
            {
                label: 'File',
                submenu: [
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

    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render () {
        return (
            <div className="bangPageContainer">
                <div>
                    <MediaLibrary
                        onBrowseForMediaLibrary={this.handleBrowseForMediaLibrary.bind(this)}
                    />
                </div>

            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    // return bindActionCreators({ setMediaLibraryContents: setMediaLibraryContents }, dispatch);
    return bindActionCreators({ getThumbs: getThumbs }, dispatch);
}

export default connect(null, mapDispatchToProps)(BA);
