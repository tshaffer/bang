/**
 * Created by tedshaffer on 6/19/16.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import HtmlSite from '../badm/htmlSite';

import { newHtmlSite } from '../actions/index';
import { getShortenedFilePath } from '../utilities/utils';

import ReactTabs from 'react-tabs';
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

class PropertySheet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            htmlSitePath: "",
            localDisabled: false,
            remoteDisabled: true
        };

        this.localHtmlSitePath = "";
        this.remoteHtmlSitePath = "";

        this.videoModes = [];
        this.videoModes.push("1920x1080x60p");
        this.videoModes.push("1920x1080x30p");
        this.videoModes.push("1920x1080x24p");
        this.videoModes.push("1920x1080x60i");
        this.videoModes.push("1920x1080x30i");

        this.transitionSpecs = [];

        this.transitionSpecs.push(
            {
                label: "No effect",
                value: 0
            }
        );
        this.transitionSpecs.push(
            {
                label: "Image wipe from top",
                value: 1
            }
        );
        this.transitionSpecs.push(
            {
                label: "Image wipe from bottom",
                value: 2
            }
        );
        this.transitionSpecs.push(
            {
                label: "Image wipe from left",
                value: 3
            }
        );
        this.transitionSpecs.push(
            {
                label: "Image wipe from right",
                value: 4
            }
        );
        this.transitionSpecs.push(
            {
                label: "Explode from center",
                value: 5
            }
        );
        this.transitionSpecs.push(
            {
                label: "Explode top left",
                value: 6
            }
        );
        this.transitionSpecs.push(
            {
                label: "Explode top right",
                value: 7
            }
        );
        this.transitionSpecs.push(
            {
                label: "Explode bottom left",
                value: 8
            }
        );

        this.transitionSpecs.push(
            {
                label: "Explode bottom right",
                value: 9
            }
        );

        this.transitionSpecs.push(
            {
                label: "Venetian blinds - vertical",
                value: 10
            }
        );

        this.transitionSpecs.push(
            {
                label: "Venetian blinds - horizontal",
                value: 11
            }
        );

        this.transitionSpecs.push(
            {
                label: "Comb effect - vertical",
                value: 12
            }
        );

        this.transitionSpecs.push(
            {
                label: "Comb effect - horizontal",
                value: 13
            }
        );

        this.transitionSpecs.push(
            {
                label: "Fade to background color",
                value: 14
            }
        );

        this.transitionSpecs.push(
            {
                label: "Fade to new image",
                value: 15
            }
        );

        this.transitionSpecs.push(
            {
                label: "Slide from top",
                value: 16
            }
        );

        this.transitionSpecs.push(
            {
                label: "Slide from bottom",
                value: 17
            }
        );

        this.transitionSpecs.push(
            {
                label: "Slide from left",
                value: 18
            }
        );

        this.transitionSpecs.push(
            {
                label: "Slide from right",
                value: 19
            }
        );
    }

    componentWillMount() {
        // console.log("PropertySheet: componentWillMount invoked");
    }

    componentDidMount() {
        // console.log("PropertySheet::componentDidMount invoked");
    }

    onUpdateVideoMode(event) {

        console.log("onUpdateVideoMode");

        if (event != undefined) {
            const videoMode = event.target.value;
            this.props.onUpdateVideoMode(videoMode);
        }
    }

    updateHTMLSiteName(event) {
        this.htmlSiteName = event.target.value;
    }

    browseForHTMLSite(event) {
        var self = this;
        this.props.onBrowseForHTMLSite().then(function(myHtmlSitePath)  {
            self.setState( { htmlSitePath: myHtmlSitePath });
            self.localHtmlSiteSpec = myHtmlSitePath;
        });
    }

    updateLocalHTMLSiteSpec(event) {
        // this.localHtmlSiteSpec = event.target.value;
    }

    updateRemoteHTMLSiteSpec(event) {
        this.remoteHtmlSiteSpec = event.target.value;
    }

    onAddHTMLSite(event) {

        let type = "";
        let siteSpec = "";

        if (this.refs.localRB.checked) {
            siteSpec = this.localHtmlSiteSpec;
            type = "local";
        }
        else {
            siteSpec = this.remoteHtmlSiteSpec;
            type = "remote";
        }

        this.props.onAddHtmlSite(htmlSiteName, siteSpec, type);
    }

    htmlSiteTypeSelected(event) {
        if (event.target.value == "local") {
            this.setState( { remoteDisabled: true });
            this.setState( { localDisabled: false });
        }
        else {
            this.setState( { remoteDisabled: false });
            this.setState( { localDisabled: true });
        }
    }

    onUpdateImageTimeOnScreen(event) {

        console.log("onUpdateImageTimeOnScreen");

        if (event != undefined) {
            const timeOnScreen = Number(event.target.value);
            this.props.onUpdateImageTimeOnScreen(this.props.selectedPlaylistItemId, timeOnScreen);
        }
    }

    onUpdateImageTransition(event) {

        console.log("onUpdateTransition:");

        if (event != undefined) {
            const transition = event.target.value;
            this.props.onUpdateImageTransition(this.props.selectedPlaylistItemId, transition);
        }
    }

    onUpdateImageTransitionDuration(event) {

        console.log("onUpdateImageTransitionDuration:");

        if (event != undefined) {
            const transitionDuration = Number(event.target.value);
            this.props.onUpdateImageTransitionDuration(this.props.selectedPlaylistItemId, transitionDuration);
        }
    }

    render () {
        
        var self = this;

        let signProperties = "Sign Properties";
        let htmlProperties = "HTML Sites";
        let selectedMediaProperties = "Media Properties";

        if (this.props.sign) {

            let selectOptions = this.videoModes.map(function (videoMode, index) {

                return (
                    <option value={videoMode} key={index}>{videoMode}</option>
                );
            });

            signProperties =
                <div>
                    Video mode: <br/>
                    <select id="videoModeSelect" value={this.props.sign.videoMode}
                            onChange={this.onUpdateVideoMode.bind(this)}>{selectOptions}</select>
                </div>

            const shortenedHtmlSitePath = getShortenedFilePath(this.state.htmlSitePath, 36);

            let existingSites = <span></span>
            if (this.props.htmlSites !== undefined && Object.keys(this.props.htmlSites.htmlSitesById).length > 0) {

                let htmlSites = [];
                for (var htmlSiteId in this.props.htmlSites.htmlSitesById) {
                    const htmlSite = this.props.htmlSites.htmlSitesById[htmlSiteId];
                    if (this.props.htmlSites.htmlSitesById.hasOwnProperty(htmlSiteId)) {
                        htmlSites.push(htmlSite);
                    }
                }

                let existingHtmlSites = htmlSites.map(function (htmlSite, index) {

                    return (
                        <div key={index}>
                            <br/>
                            <p className="smallishFont noVertSpacing">{htmlSite.name}</p>
                            <p className="smallishFont noVertSpacing">{htmlSite.siteSpec}</p>
                        </div>
                    );
                });

                existingSites =
                    <div>
                        <span className="smallishFont">Existing Sites</span>
                        {existingHtmlSites}
                    </div>
            }

            htmlProperties =
                <div>
                    <span className="smallishFont">Name: </span><input className="smallishFont htmlSiteSpec" type="text" id="htmlSiteName" value={this.htmlSiteName} onChange={this.updateHTMLSiteName.bind(this)}></input>

                    <br/><br/>

                    <form>
                        <input ref="localRB" type="radio" name="html" className="smallishFont" id="rbLocal" value="local" checked={this.state.remoteDisabled} onChange={this.htmlSiteTypeSelected.bind(this)}/><span className="smallishFont">Local</span>
                        <input className="leftSpacing htmlSiteSpec smallishFont" type="text" id="txtBoxLocal" disabled={this.state.localDisabled}  value={shortenedHtmlSitePath} onChange={this.updateLocalHTMLSiteSpec.bind(this)}></input>
                        <button className="leftSpacing" type="button" id="btnBrowseForSite" disabled={this.state.localDisabled} onClick={this.browseForHTMLSite.bind(this)}>Browse</button>

                        <br/>
                        <input ref="remoteFB" type="radio" name="html" className="smallishFont" id="rbRemote" value="remote" checked={this.state.localDisabled} onChange={this.htmlSiteTypeSelected.bind(this)}/><span className="smallishFont">URL</span>
                        <input className="leftSpacing htmlSiteSpec smallishFont" type="text" id="txtBoxRemote" disabled={this.state.remoteDisabled} value={this.htmlSiteURL} onChange={this.updateRemoteHTMLSiteSpec.bind(this)}></input>
                    </form>

                    <button className="smallishFont floatMeRight" type="button" id="btnAddHTMLSite" onClick={this.onAddHTMLSite.bind(this)}>Add Site</button>

                    <br/>
                    {existingSites}
                </div>
        }

        if (this.props.selectedPlaylistItemId) {

            let imagePlaylistItem = null;

            const currentZonePlaylist = this.props.getCurrentZonePlaylist();
            currentZonePlaylist.playlistItemIds.forEach( playlistItemId => {
                if (playlistItemId === this.props.selectedPlaylistItemId) {
                    imagePlaylistItem = this.props.playlistItems.playlistItemsById[playlistItemId];
                }
            });

            let selectOptions = this.transitionSpecs.map(function(transitionSpec, index) {

                return (
                    <option value={transitionSpec.value} key={transitionSpec.value}>{transitionSpec.label}</option>
                );
            });

            selectedMediaProperties =
                <div>
                    <p>{imagePlaylistItem.fileName}</p>
                    <p>
                        Time on screen:
                        <input type="text" value={imagePlaylistItem.timeOnScreen} onChange={this.onUpdateImageTimeOnScreen.bind(this)}></input>                    </p>
                    <div>
                        Transition:
                        <select ref="transitionsSelect" value={imagePlaylistItem.transition} onChange={this.onUpdateImageTransition.bind(this)}>{selectOptions}</select>
                    </div>
                    <p>
                        Transition duration:
                        <input type="text" value={imagePlaylistItem.transitionDuration} onChange={this.onUpdateImageTransitionDuration.bind(this)}></input>
                    </p>
                </div>
            ;

        }
        else {
            selectedMediaProperties = <div></div>
        }

        return (
            <div className="propertySheetDiv">
                <p className="smallishFont">Properties</p>
                <Tabs onSelect={this.handleSelectTab}>
                    <TabList>
                        <Tab className="smallishFont">sign</Tab>
                        <Tab className="smallishFont tabPadding">content</Tab>
                        <Tab className="smallishFont tabPadding">html</Tab>
                    </TabList>

                    <TabPanel>
                        {signProperties}
                    </TabPanel>

                    <TabPanel>
                        {selectedMediaProperties}
                    </TabPanel>

                    <TabPanel>
                        {htmlProperties}
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

export default PropertySheet;