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

import { updateMediaFolder } from '../actions/index';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // electron only
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

    render () {
        return (
            <div className="bangPageContainer">
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateMediaFolder: updateMediaFolder }, dispatch);
}

export default connect(null, mapDispatchToProps)(BA);
