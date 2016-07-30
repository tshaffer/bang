/**
 * Created by tedshaffer on 6/12/16.
 */
import React, { Component } from 'react';

const {remote} = require('electron');
const {Menu, dialog} = remote;
const fs = require('fs');
const path = require('path');


export default class BAUI {

    constructor(ba) {
        this.ba = ba;
    }

    init() {
        
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
            },
            {
                label: 'Edit',
                submenu: [
                    {
                        label: 'Preferences',
                        click: function() {
                            self.handleEditPreferences();
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

    handleOpenPresentation() {
    
        var self = this;
    
        const options = {
            title: 'Open Presentation',
            filters: [
                { name: 'Presentations', extensions: ['bpf'] }
            ]
        }
        dialog.showOpenDialog(options, filenameDir => {
            self.ba.props.fetchSign(filenameDir[0]);
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
            this.ba.props.saveSign(filename);
        })
    }
    
    handleBrowseForMediaLibrary() {
    
        var self = this;
    
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, function (directories) {
            if (directories) {
                const mediaFolder = directories[0];
                self.ba.props.selectMediaFolder(mediaFolder, self.ba.props.mediaThumbs);
            }
        })
    }

    handleBrowseForHTMLSite() {

        var self = this;

        return new Promise(function(resolve, reject) {

            dialog.showOpenDialog({
                properties: ['openFile']
            }, function (files) {
                console.log(files);
                if (files) {
                    resolve(files[0]);
                }
                else {
                    reject();
                }
            })
        })
    }

    handleEditPreferences() {
        this.ba.handleEditPreferences();
    }

    getOpenSavePresentationJSX(bsnPresentations) {

        return (
            <div>
            </div>
        )
    }
}