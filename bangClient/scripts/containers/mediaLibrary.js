/**
 * Created by tedshaffer on 6/4/16.
 */
import React, { Component } from 'react';
var ReactDOM = require('react-dom');
import { connect } from 'react-redux';
const path = require('path');

var ReactTabs = require('react-tabs');
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

    render() {
        
        if (!this.props.thumbs || this.props.thumbs.length == 0) {
            return (
                <div>Pizza</div>
            );
        }

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

        return (
            <div className="mediaLibraryDiv">

                <Tabs>
                    <TabList>

                        <Tab>files</Tab>
                        <Tab>other</Tab>
                        <Tab>events</Tab>
                        <Tab>user events</Tab>
                    </TabList>

                    <TabPanel>
                        <ul className="flex-container wrap">
                            {mediaLibraryThumbs}
                        </ul>
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
