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

import ImagePlaylistItem from '../badm';

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
        this.props.fetchMediaFolder();
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
        ev.dataTransfer.setData("thumburl", ev.target.dataset.thumburl);
        ev.dataTransfer.setData("type", ev.target.dataset.type);
        ev.dataTransfer.dropEffect = "copy";
    }

    handleChange() {

    }
    
    render() {

        var self = this;

        let mediaLibraryDiv = <div>No thumbs</div>

        if (this.props.mediaLibraryPlaylistItems) {

            let mediaLibraryPlaylistItems = this.props.mediaLibraryPlaylistItems.map(function (mediaLibraryPlaylistItem) {

                const thumbUrl = mediaLibraryPlaylistItem.thumbUrl;

                return (
                    <li className="flex-item mediaLibraryThumbDiv" key={mediaLibraryPlaylistItem.id}>
                        <img
                            id={mediaLibraryPlaylistItem.id}
                            src={thumbUrl}
                            className="mediaLibraryThumbImg"
                            data-name={mediaLibraryPlaylistItem.fileName}
                            data-path={mediaLibraryPlaylistItem.filePath}
                            data-thumburl = {thumbUrl}
                            data-type="image"
                            draggable={true}
                            onDragStart={self.mediaLibraryDragStartHandler}
                        />
                        <p className="mediaLibraryThumbLbl">{mediaLibraryPlaylistItem.fileName}</p>
                    </li>
                );
            });

            mediaLibraryDiv =
                <ul className="flex-container wrap">
                    {mediaLibraryPlaylistItems}
                </ul>
        }

        return (
            <div className="mediaLibraryDiv">
                <p className="smallishFont">Media Library</p>
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
                            <input type="image" src="images/iconBrowse.png" onClick={this.props.onBrowseForMediaLibrary.bind(this)} />
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
        mediaFolder: state.mediaFolder
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchMediaFolder: fetchMediaFolder, setMediaFolder: setMediaFolder }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaLibrary);
