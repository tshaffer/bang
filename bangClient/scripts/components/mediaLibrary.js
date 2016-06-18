/**
 * Created by tedshaffer on 6/4/16.
 */
const path = require('path');

import React, { Component } from 'react';

import ReactTabs from 'react-tabs';
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

class MediaLibrary extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    handleSelectTab (index, last) {
        console.log('Selected tab: ' + index + ', Last tab: ' + last);
    }

    onRefreshMediaLibrary(event) {
        console.log("onRefreshMediaLibrary invoked");
    }

    onNavigateUpMediaLibrary(event) {
        console.log("onNavigateUpMediaLibrary invoked");
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

    // prevents build warning - related to readonly text box
    handleChange() {
    }

    render() {

        var self = this;

        let mediaLibraryDiv = <div>No thumbs</div>

        if (this.props.mediaLibraryPlaylistItems && this.props.mediaLibraryPlaylistItems.length > 0) {

            let mediaLibraryPlaylistItems = this.props.mediaLibraryPlaylistItems.map(function (mediaLibraryPlaylistItem) {

                if (self.props.mediaThumbs.hasOwnProperty(mediaLibraryPlaylistItem.filePath)) {

                    const mediaItem = self.props.mediaThumbs[mediaLibraryPlaylistItem.filePath];
                    let thumbUrl = mediaItem.thumbFileName;
                    // experiments with trying to load the thumb from the local drive when using electron (no server)
                    // let thumbUrl = mediaItem.url;
                    // thumbUrl = "file://localhost/" + mediaItem.url;
                    // thumbUrl = "http://localhost/" + mediaItem.url;
                    // let thumbUrl = "file:///" + mediaItem.url;

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
                <Tabs onSelect={this.handleSelectTab}>
                    <TabList>
                        <Tab className="smallishFont">files</Tab>
                        <Tab className="smallishFont tabPadding">other</Tab>
                        <Tab className="smallishFont tabPadding">events</Tab>
                        <Tab className="smallishFont tabPadding">user events</Tab>
                    </TabList>

                    <TabPanel>
                        <div>
                            <input type="image" src="images/iconBrowse.png" className="plainButton" onClick={this.props.onBrowseForMediaLibrary.bind(this)} />
                            <input type="image" src="images/24x24_sync.png" onClick={this.onRefreshMediaLibrary.bind(this)}/>
                            <input type="image" src="images/iconNavigateUp.png" onClick={this.onNavigateUpMediaLibrary.bind(this)}/>
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

export default MediaLibrary;
