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

import { getThumb } from '../platform/actions';

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
        
        ev.dataTransfer.setData("path", ev.target.dataset.path);
        ev.dataTransfer.setData("name", ev.target.dataset.name);
        ev.dataTransfer.setData("type", ev.target.dataset.type);
        ev.dataTransfer.dropEffect = "copy";
        // ev.dataTransfer.effectAllowed = 'copy';
    }

    // prevents build warning - related to readonly text box
    handleChange() {
    }

    render() {

        var self = this;

        let mediaLibraryDiv = <div>No thumbs</div>

        if (this.props.mediaLibraryPlaylistItems && this.props.mediaLibraryPlaylistItems.length > 0) {

            let mediaLibraryPlaylistItems = this.props.mediaLibraryPlaylistItems.map(function (mediaLibraryPlaylistItem) {
                console.log("ph1");
                console.log("ph2");

                const id = mediaLibraryPlaylistItem.getId();
                const fileName = mediaLibraryPlaylistItem.getFileName();
                const filePath = mediaLibraryPlaylistItem.getFilePath();

                if (self.props.mediaThumbs.hasOwnProperty(filePath)) {

                    const mediaItem = self.props.mediaThumbs[filePath];
                    const thumb = getThumb(mediaItem);
                    
                    return (
                        <li className="flex-item mediaLibraryThumbDiv" key={id}>
                            <img
                                id={id}
                                src={thumb}
                                className="mediaLibraryThumbImg"
                                data-name={fileName}
                                data-path={filePath}
                                data-type="image"
                                draggable={true}
                                onDragStart={self.mediaLibraryDragStartHandler}
                            />
                            <p className="mediaLibraryThumbLbl">{fileName}</p>
                        </li>
                    );
                }
                else {
                    // TODO - what is name??
                    return (
                        <li key={id}>
                            <p className="mediaLibraryThumbLbl">{name}</p>
                        </li>
                    )
                }
            });

            mediaLibraryDiv =
                <ul className="flex-container wrap">
                    {mediaLibraryPlaylistItems}
                </ul>
        }

        let theOtherPlaylistItems = [];
        theOtherPlaylistItems.push(
            {
                id: "1",
                thumb: "images/html.png",
                fileName: "HTML5",
                filePath: "HTML5",
                type: "html5"
            }
        )
        theOtherPlaylistItems.push(
            {
                id: "2",
                thumb: "images/mediaList.png",
                fileName: "Media List",
                filePath: "Media List",
                type: "mediaList"
            }
        )

        let otherPlaylistItems = theOtherPlaylistItems.map(function (otherPlaylistItem) {

            return (
                <li className="flex-item mediaLibraryThumbDiv" key={otherPlaylistItem.id}>
                    <img
                        id={otherPlaylistItem.id}
                        src={otherPlaylistItem.thumb}
                        className="otherThumbImg"
                        data-name={otherPlaylistItem.fileName}
                        data-path={otherPlaylistItem.filePath}
                        data-type={otherPlaylistItem.type}
                        draggable={true}
                        onDragStart={self.mediaLibraryDragStartHandler}
                    />
                    <p className="mediaLibraryThumbLbl">{otherPlaylistItem.fileName}</p>
                </li>
            );
        });

        let otherDiv =
            <ul className="flex-container wrap">
                {otherPlaylistItems}
            </ul>

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
                        {otherDiv}
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
