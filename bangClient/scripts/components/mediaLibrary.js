const path = require('path');

import React, { Component } from 'react';

import { MediaType } from '@brightsign/badatamodel';

import ReactTabs from 'react-tabs';
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

import { getThumb } from '../platform/actions';

import MediaObjectState from './mediaObjectState';

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

    handleMediaLibraryDragStart(ev) {
        
        ev.dataTransfer.setData("path", ev.target.dataset.path);
        ev.dataTransfer.setData("name", ev.target.dataset.name);
        ev.dataTransfer.setData("type", ev.target.dataset.type);
        ev.dataTransfer.dropEffect = "copy";
        // ev.dataTransfer.effectAllowed = 'copy';
    }

    // prevents build warning - related to readonly text box
    handleChange() {
    }

    handleSelectMediaState(event, mediaStateId) {
        console.log("mediaLibrary.js::handleSelectMediaState invoked - NOOP");
    }

    render() {

        var self = this;

        let mediaLibraryDiv = <div>No thumbs</div>;

        let dataIndex = -1;

        if (this.props.mediaObjects && this.props.mediaObjects.length > 0) {

            let mediaObjectsJSX = this.props.mediaObjects.map(function (mediaObject) {
                console.log(mediaObject);

                dataIndex++;

                const fileName = mediaObject.fileName;
                const mediaObjectState = { path: mediaObject.path, mediaType: MediaType.Image };

                return (
                    <MediaObjectState
                        fileName={fileName}
                        mediaObjectState={mediaObjectState}
                        dataIndex={dataIndex}
                        mediaThumbs={self.props.mediaThumbs}
                        key={dataIndex}
                        selected={false}
                        mediaStateId={""}
                        onSelectMediaState={self.handleSelectMediaState.bind(self)}
                    />
                );
            });

            mediaLibraryDiv =
                (<ul className="flex-container wrap">
                    {mediaObjectsJSX}
                </ul>);

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
        );
        theOtherPlaylistItems.push(
            {
                id: "2",
                thumb: "images/mediaList.png",
                fileName: "Media List",
                filePath: "Media List",
                type: "mediaList"
            }
        );

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
                        onDragStart={self.handleMediaLibraryDragStart}
                    />
                    <p className="mediaLibraryThumbLbl">{otherPlaylistItem.fileName}</p>
                </li>
            );
        });

        let otherDiv =
            (<ul className="flex-container wrap">
                {otherPlaylistItems}
            </ul>);

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
                        <input type="text" id="mediaLibraryFolder" value={this.props.mediaFolder} onChange={this.handleChange}/>
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

MediaLibrary.propTypes = {
    onBrowseForMediaLibrary: React.PropTypes.func.isRequired,
    mediaFolder: React.PropTypes.string.isRequired,
    mediaObjects: React.PropTypes.array.isRequired,
    mediaThumbs: React.PropTypes.object.isRequired,
};


export default MediaLibrary;
