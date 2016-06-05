/**
 * Created by tedshaffer on 6/4/16.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
const path = require('path');

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

    componentDidMount() {
        const mediaLibraryFolder = document.getElementById("mediaLibraryFolder");
        if (mediaLibraryFolder) {
            mediaLibraryFolder.readOnly = true;
        }
    }

    handleSelect (index, last) {
        console.log('Selected tab: ' + index + ', Last tab: ' + last);
    }

    onSync(event) {
        console.log("onSync invoked");
        // this.props.getPhotosInAlbum(this.selectedAlbum.id);
    }

    onNavigateUp(event) {
        console.log("onNavigateUp invoked");
        // this.props.getPhotosInAlbum(this.selectedAlbum.id);
    }


    render() {
        
        let mediaLibraryDiv = <div>No thumbs</div>

        if (this.props.thumbs) {

            let mediaLibraryThumbs = this.props.thumbs.map(function (thumb) {

                const thumbUrl = thumb.thumbFileName;

                console.log("thumb.id=" + thumb.id);

                // <img id={thumb.id} src={thumbUrl} className="mediaLibraryThumbImg" data-name={thumb.fileName} data-path={thumb.path} data-type={thumb.type} draggable={true} onDragStart={self.mediaLibraryDragStartHandler}/>
                return (
                    <li className="flex-item mediaLibraryThumbDiv" key={thumb.id}>
                        <img src={thumbUrl} className="mediaLibraryThumbImg"/>
                        <p className="mediaLibraryThumbLbl">{thumb.fileName}</p>
                    </li>
                );
            });

            mediaLibraryDiv =
                <ul className="flex-container wrap">
                    {mediaLibraryThumbs}
                </ul>
        }

        return (
            <div className="mediaLibraryDiv">
                <p>Media Library</p>
                <Tabs
                    onSelect={this.handleSelect}
                >
                    <TabList>
                        <Tab>files</Tab>
                        <Tab>other</Tab>
                        <Tab>events</Tab>
                        <Tab>user events</Tab>
                    </TabList>

                    <TabPanel>
                        <input type="text" id="mediaLibraryFolder"></input>
                        <input type="image" src="images/iconBrowse.png" onClick={this.props.onBrowseForMediaLibrary.bind(this)} />
                        <input type="image" src="images/24x24_sync.png" onClick={this.onSync.bind(this)}/>
                        <input type="image" src="images/iconNavigateUp.png" onClick={this.onNavigateUp.bind(this)}/>
                        {mediaLibraryDiv}
                    </TabPanel>

                    <TabPanel>
                        <h2>other</h2>
                    </TabPanel>

                    <TabPanel>
                        <h2>events</h2>
                    </TabPanel>

                    <TabPanel>
                        <h2>user events</h2>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        thumbs: state.thumbs
    };
}


export default connect(mapStateToProps)(MediaLibrary);
