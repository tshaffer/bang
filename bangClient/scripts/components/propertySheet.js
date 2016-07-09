/**
 * Created by tedshaffer on 6/19/16.
 */
import React, { Component } from 'react';

import { getShortenedFilePath } from '../utilities/utils';
import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';

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

        this.buildVideoModesList();
        this.buildTransitionSpec();
    }

    componentWillMount() {
        // console.log("PropertySheet: componentWillMount invoked");
    }

    componentDidMount() {
        // console.log("PropertySheet::componentDidMount invoked");
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    onUpdateVideoMode(event) {

        console.log("onUpdateVideoMode");

        if (event != undefined) {
            const videoMode = event.target.value;
            this.props.onUpdateVideoMode(videoMode);
        }
    }

    browseForHTMLSite(event) {
        var self = this;
        this.props.onBrowseForHTMLSite().then(function(myHtmlSitePath)  {
            self.setState( { htmlSitePath: myHtmlSitePath });
            self.localHtmlSiteSpec = myHtmlSitePath;
            self.refs.htmlLocalSitePath.value = getShortenedFilePath(myHtmlSitePath, 36);
        });
    }

    onAddHTMLSite(event) {

        let type = "";
        let siteSpec = "";
        let htmlSiteName = this.refs.htmlSiteName.value;

        if (this.refs.localRB.checked) {
            siteSpec = this.localHtmlSiteSpec;
            type = "local";
        }
        else {
            siteSpec = this.refs.htmlSiteUrl.value;
            type = "remote";
        }

        this.props.onAddHtmlSite(htmlSiteName, siteSpec, type);

        this.refs.htmlLocalSitePath.value = "";
        this.refs.htmlSiteUrl.value = "";
        this.refs.htmlSiteName.value = "";
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

        if (event != undefined) {
            const timeOnScreen = Number(event.target.value);
            this.props.onUpdateImageTimeOnScreen(this.props.selectedPlaylistItemId, timeOnScreen);
        }
    }

    onUpdateImageTransition(event) {

        if (event != undefined) {
            const transition = event.target.value;
            this.props.onUpdateImageTransition(this.props.selectedPlaylistItemId, transition);
        }
    }

    onUpdateImageTransitionDuration(event) {

        if (event != undefined) {
            const transitionDuration = Number(event.target.value);
            this.props.onUpdateImageTransitionDuration(this.props.selectedPlaylistItemId, transitionDuration);
        }
    }

    onUpdateHTML5StateName(event) {
        const html5StateName = event.target.value;
        this.props.onUpdateHTML5StateName(this.props.selectedPlaylistItemId, html5StateName);
    }

    onUpdateHtmlSiteName(event) {
        const selectedHTMLSiteName = event.target.value;
        this.props.onUpdateHTML5SiteName(this.props.selectedPlaylistItemId, selectedHTMLSiteName);
    }

    onUpdateHTML5EnableExternalData(event) {
        const enableExternalData = this.refs.cbEnableExternalData.checked;
        this.props.onUpdateHTML5EnableExternalData(this.props.selectedPlaylistItemId, enableExternalData);
    }

    onUpdateHTML5EnableMouseEvents(event) {
        const enableMouseEvents = this.refs.cbEnableMouseEvents.checked;
        this.props.onUpdateHTML5EnableMouseEvents(this.props.selectedPlaylistItemId, enableMouseEvents);
    }

    onUpdateHTML5DisplayCursor(event) {
        const displayCursor = this.refs.cbDisplayCursor.checked;
        this.props.onUpdateHTML5DisplayCursor(this.props.selectedPlaylistItemId, displayCursor);
    }

    onUpdateHTML5HWZOn(event) {
        const hwzOn = this.refs.cbHWZOn.checked;
        this.props.onUpdateHTML5HWZOn(this.props.selectedPlaylistItemId, hwzOn);
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

            // this.shortenedHtmlSitePath = getShortenedFilePath(this.state.htmlSitePath, 36);

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
                    <span className="smallishFont">Name: </span>
                    <input className="smallishFont htmlSiteSpec" type="text" ref="htmlSiteName"></input>

                    <br/><br/>

                    <form>
                        <input ref="localRB" type="radio" name="html" className="smallishFont" id="rbLocal" value="local" checked={this.state.remoteDisabled} onChange={this.htmlSiteTypeSelected.bind(this)}/><span className="smallishFont">Local</span>
                        <input className="leftSpacing htmlSiteSpec smallishFont" type="text" ref="htmlLocalSitePath" disabled={this.state.localDisabled}></input>
                        <button className="leftSpacing" type="button" id="btnBrowseForSite" disabled={this.state.localDisabled} onClick={this.browseForHTMLSite.bind(this)}>Browse</button>

                        <br/>
                        <input ref="remoteFB" type="radio" name="html" className="smallishFont" id="rbRemote" value="remote" checked={this.state.localDisabled} onChange={this.htmlSiteTypeSelected.bind(this)}/><span className="smallishFont">URL</span>
                        <input className="leftSpacing htmlSiteSpec smallishFont" type="text" ref="htmlSiteUrl" disabled={this.state.remoteDisabled}></input>
                    </form>

                    <button className="smallishFont floatMeRight" type="button" id="btnAddHTMLSite" onClick={this.onAddHTMLSite.bind(this)}>Add Site</button>

                    <br/>
                    {existingSites}
                </div>
        }

        if (this.props.selectedPlaylistItemId) {


            let playlistItem = null;
            const currentZonePlaylist = this.props.getCurrentZonePlaylist();
            currentZonePlaylist.playlistItemIds.forEach( playlistItemId => {
                if (playlistItemId === this.props.selectedPlaylistItemId) {
                    playlistItem = this.props.playlistItems.playlistItemsById[playlistItemId];
                }
            });

            if (playlistItem instanceof ImagePlaylistItem) {

                let imagePlaylistItem = playlistItem;
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
                            <input type="text" value={imagePlaylistItem.timeOnScreen} onChange={this.onUpdateImageTimeOnScreen.bind(this)}></input>
                        </p>
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
            else if (playlistItem instanceof HTML5PlaylistItem) {
                let html5PlaylistItem = playlistItem;

                let htmlSitesDropDown = <div>No sites defined</div>

                if (this.props.sign) {

                    let selectOptions = this.props.sign.htmlSiteIds.map( (htmlSiteId) => {
                        const htmlSite = this.props.htmlSites.htmlSitesById[htmlSiteId];
                        // <option value={htmlSite.id} key={htmlSite.id}>{htmlSite.name}</option>
                        if (htmlSite) {
                            return (
                                <option value={htmlSite.name} key={htmlSite.id}>{htmlSite.name}</option>
                            );
                        }
                    })

                    htmlSitesDropDown =
                        <div>
                            HTML5 Site:
                            <select value={html5PlaylistItem.htmlSiteName} onChange={this.onUpdateHtmlSiteName.bind(this)}>{selectOptions}</select>
                        </div>
                }

                // <select className="leftSpacing" ref="htmlSiteSelect"
                //         onChange={this.onSelectHtmlSite.bind(this)}>{selectOptions}</select>

                selectedMediaProperties =
                    <div>
                        <p>
                            State name:
                            <input type="text" value={html5PlaylistItem.fileName} onChange={this.onUpdateHTML5StateName.bind(this)}></input>
                        </p>
                        {htmlSitesDropDown}
                        <br/>
                        <label><input ref="cbEnableExternalData" type="checkbox" checked={html5PlaylistItem.enableExternalData} onChange={this.onUpdateHTML5EnableExternalData.bind(this)}></input>Enable external data</label><br/>
                        <label><input ref="cbEnableMouseEvents" type="checkbox" checked={html5PlaylistItem.enableMouseEvents} onChange={this.onUpdateHTML5EnableMouseEvents.bind(this)}></input>Enable mouse and touch events</label><br/>
                        <label><input ref="cbDisplayCursor" type="checkbox" checked={html5PlaylistItem.displayCursor} onChange={this.onUpdateHTML5DisplayCursor.bind(this)}></input>Display cursor</label><br/>
                        <label><input ref="cbHWZOn" type="checkbox" checked={html5PlaylistItem.hwzOn} onChange={this.onUpdateHTML5HWZOn.bind(this)} ></input> native video plane playback</label><br/>
                        <br/>
                    </div>
            }
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

    buildVideoModesList() {
        this.videoModes = [];
        this.videoModes.push("1920x1080x60p");
        this.videoModes.push("1920x1080x30p");
        this.videoModes.push("1920x1080x24p");
        this.videoModes.push("1920x1080x60i");
        this.videoModes.push("1920x1080x30i");
    }

    buildTransitionSpec() {
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
}

export default PropertySheet;
