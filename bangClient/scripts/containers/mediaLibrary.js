/**
 * Created by tedshaffer on 6/4/16.
 */
const path = require('path');

import $ from 'jquery';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ReactTabs from 'react-tabs';
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

import { fetchMediaFolder } from '../actions/index';
import { setMediaFolder } from '../actions/index';

class MediaLibrary extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        console.log("mediaLibrary: componentWillMount invoked");
    }

    componentDidMount() {

        console.log("mediaLibrary.js::componentDidMount invoked");
        // this.props.fetchMediaFolder();
    }

    handleSelect (index, last) {
        console.log('Selected tab: ' + index + ', Last tab: ' + last);
    }

    onSync(event) {
        console.log("onSync invoked");
    }

    onNavigateUp(event) {
        console.log("onNavigateUp invoked");
    }

    mediaLibraryDragStartHandler(ev) {

        console.log("dragStart");

        // Add the target element's id to the data transfer object
        // ev.dataTransfer.setData("text", ev.target.id);
        ev.dataTransfer.setData("path", ev.target.dataset.path);
        ev.dataTransfer.setData("name", ev.target.dataset.name);
        ev.dataTransfer.setData("type", ev.target.dataset.type);
        ev.dataTransfer.dropEffect = "copy";
    }

    handleChange() {

    }

    render() {

        var self = this;

        let numberOfMediaItemThumbs = "0";
        if (this.props.mediaItemThumbs) {
            numberOfMediaItemThumbs = this.props.mediaItemThumbs.length.toString();;
        }
        let mediaFolder = "";
        if (this.props.mediaFolder) {
            mediaFolder = this.props.mediaFolder;
        }

        if (this.props.mediaLibraryPlaylistItems && this.props.mediaLibraryPlaylistItems.length > 0) {
            console.log("mediaLibrayPlaylistItems are here");
        }

        if (numberOfMediaItemThumbs != "0" && mediaFolder != "" && this.props.mediaLibraryPlaylistItems && this.props.mediaLibraryPlaylistItems.length > 0) {
            console.log("all data has arrived");
        }

        let mediaLibraryDiv = <div>No thumbs</div>

        if (this.props.mediaLibraryPlaylistItems) {

            let mediaLibraryPlaylistItems = this.props.mediaLibraryPlaylistItems.map(function (mediaLibraryPlaylistItem) {

                if (self.props.mediaItemThumbs.hasOwnProperty(mediaLibraryPlaylistItem.filePath)) {

                    const thumbUrl = self.props.mediaItemThumbs[mediaLibraryPlaylistItem.filePath].thumbFileName;

                    return (
                        <li className="flex-item mediaLibraryThumbDiv" key={mediaLibraryPlaylistItem.id}>
                            <img
                                id={mediaLibraryPlaylistItem.id}
                                src={thumbUrl}
                                className="mediaLibraryThumbImg"
                                data-name={mediaLibraryPlaylistItem.fileName}
                                data-path={mediaLibraryPlaylistItem.filePath}
                                data-type="image"
                                draggable={true}
                                onDragStart={self.mediaLibraryDragStartHandler}
                            />
                            <p className="mediaLibraryThumbLbl">{mediaLibraryPlaylistItem.fileName}</p>
                        </li>
                    );
                }
                else {
                    return (
                        <li key={mediaLibraryPlaylistItem.id}>
                            <p className="mediaLibraryThumbLbl">{mediaLibraryPlaylistItem.name}</p>
                        </li>
                    )
                }
            });

            mediaLibraryDiv =
                <ul className="flex-container wrap">
                    {mediaLibraryPlaylistItems}
                </ul>
        }

        return (
            <div className="mediaLibraryDiv">
                <p className="smallishFont">Media Library</p>
                <p className="smallishFont">{numberOfMediaItemThumbs}</p>
                <p className="smallishFont">{mediaFolder}</p>
                <Tabs
                    onSelect={this.handleSelect}
                >
                    <TabList>
                        <Tab className="smallishFont">files</Tab>
                        <Tab className="smallishFont tabPadding">other</Tab>
                        <Tab className="smallishFont tabPadding">events</Tab>
                        <Tab className="smallishFont tabPadding">user events</Tab>
                    </TabList>

                    <TabPanel>
                        <div>
                            <input type="image" src="images/iconBrowse.png" className="plainButton" onClick={this.props.onBrowseForMediaLibrary.bind(this)} />
                            <input type="image" src="images/24x24_sync.png" onClick={this.onSync.bind(this)}/>
                            <input type="image" src="images/iconNavigateUp.png" onClick={this.onNavigateUp.bind(this)}/>
                        </div>
                        <input type="text" id="mediaLibraryFolder" value={this.props.mediaFolder} onChange={this.handleChange}></input>
                        {mediaLibraryDiv}
                    </TabPanel>

                    <TabPanel>
                        <p className="smallishFont">other</p>
                    </TabPanel>

                    <TabPanel>
                        <p className="smallishFont">events</p>
                    </TabPanel>

                    <TabPanel>
                        <p className="smallishFont">user events</p>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        mediaLibraryPlaylistItems: state.mediaLibraryPlaylistItems,
        mediaFolder: state.mediaFolder,
        mediaItemThumbs: state.mediaItemThumbs,
        mediaFolderFiles: state.mediaFolderFiles,
        thumbFiles: state.thumbFiles
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchMediaFolder: fetchMediaFolder, setMediaFolder: setMediaFolder }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaLibrary);
