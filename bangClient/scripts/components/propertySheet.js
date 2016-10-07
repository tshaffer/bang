import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getShortenedFilePath } from '../utilities/utils';
import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';

import { getMediaPlaylistItem } from '../badm/mediaState';

import { updateImageTimeOnScreen, updateImageTransition, updateImageTransitionDuration,
    addHtmlSiteToPresentation,
    updateHTML5StateName,
    updateHTML5SiteName,
    updateHTML5EnableExternalData,
    updateHTML5EnableMouseEvents,
    updateHTML5DisplayCursor,
    updateHTML5HWZOn,
} from '../actions/index';

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

    handleAddHTMLSite(event) {

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

        const htmlSite = {
            name: htmlSiteName,
            siteSpec,
            type
        };
        this.props.addHtmlSiteToPresentation(htmlSite);

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

    handleUpdateImageTimeOnScreen(event) {

        if (event != undefined) {
            const timeOnScreen = Number(event.target.value);
            this.props.updateImageTimeOnScreen(this.props.selectedMediaStateId, timeOnScreen);
        }
    }

    handleUpdateImageTransition(event) {

        if (event != undefined) {
            const imageTransition = event.target.value;
            this.props.updateImageTransition(this.props.selectedMediaStateId, imageTransition);
        }
    }

    handleUpdateImageTransitionDuration(event) {

        if (event != undefined) {
            const transitionDuration = Number(event.target.value);
            this.props.updateImageTransitionDuration(this.props.selectedMediaStateId, transitionDuration);
        }
    }

    handleUpdateHTML5StateName(event) {

        const html5StateName = event.target.value;
        this.props.updateHTML5StateName(this.props.selectedMediaStateId, html5StateName);
    }

    handleUpdateHtmlSiteName(event) {
        const selectedHTMLSiteName = event.target.value;
        this.props.updateHTML5SiteName(this.props.selectedMediaStateId, selectedHTMLSiteName);
    }

    handleUpdateHTML5EnableExternalData(event) {
        const enableExternalData = this.refs.cbEnableExternalData.checked;
        this.props.updateHTML5EnableExternalData(this.props.selectedMediaStateId, enableExternalData);
    }

    handleUpdateHTML5EnableMouseEvents(event) {
        const enableMouseEvents = this.refs.cbEnableMouseEvents.checked;
        this.props.updateHTML5EnableMouseEvents(this.props.selectedMediaStateId, enableMouseEvents);
    }

    handleUpdateHTML5DisplayCursor(event) {
        const displayCursor = this.refs.cbDisplayCursor.checked;
        this.props.updateHTML5DisplayCursor(this.props.selectedMediaStateId, displayCursor);
    }

    handleUpdateHTML5HWZOn(event) {
        const hwzOn = this.refs.cbHWZOn.checked;
        this.props.updateHTML5HWZOn(this.props.selectedMediaStateId, hwzOn);
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
                </div>;

            // this.shortenedHtmlSitePath = getShortenedFilePath(this.state.htmlSitePath, 36);

            let existingSites = <span></span>;
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
                    </div>;
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

                    <button className="smallishFont floatMeRight" type="button" id="btnAddHTMLSite" onClick={this.handleAddHTMLSite.bind(this)}>Add Site</button>

                    <br/>
                    {existingSites}
                </div>;
        }

        if (this.props.selectedMediaStateId) {

            // get the selected media state
            const mediaState = this.props.mediaStates.mediaStatesById[this.props.selectedMediaStateId];

            const fileName = mediaState.getFileName();

            const mediaStatePlaylistItem = mediaState.getMediaPlaylistItem();

            if (mediaStatePlaylistItem instanceof ImagePlaylistItem) {

                let imagePlaylistItem = mediaStatePlaylistItem;
                let selectOptions = this.transitionSpecs.map(function(transitionSpec, index) {

                    return (
                        <option value={transitionSpec.value} key={transitionSpec.value}>{transitionSpec.label}</option>
                    );
                });

                selectedMediaProperties =
                    (<div>
                        <p>{fileName}</p>
                        <p>
                            Time on screen:
                            <input type="text" value={imagePlaylistItem.timeOnScreen} onChange={this.handleUpdateImageTimeOnScreen.bind(this)}/>
                        </p>
                        <div>
                            Transition:
                            <select ref="transitionsSelect" value={imagePlaylistItem.transition} onChange={this.handleUpdateImageTransition.bind(this)}>{selectOptions}</select>
                        </div>
                        <p>
                            Transition duration:
                            <input type="text" value={imagePlaylistItem.transitionDuration} onChange={this.handleUpdateImageTransitionDuration.bind(this)}/>
                        </p>
                    </div>)
                ;
            }
            else if (mediaStatePlaylistItem instanceof HTML5PlaylistItem) {
                let html5PlaylistItem = mediaStatePlaylistItem;

                let htmlSitesDropDown = <div>No sites defined</div>;

                if (this.props.sign) {

                    let selectOptions = this.props.sign.htmlSiteIds.map( (htmlSiteId) => {
                        const htmlSite = this.props.htmlSites.htmlSitesById[htmlSiteId];
                        if (htmlSite) {
                            return (
                                <option value={htmlSite.name} key={htmlSite.id}>{htmlSite.name}</option>
                            );
                        }
                    });

                    htmlSitesDropDown =
                        (<div>
                            HTML5 Site:
                            <select value={html5PlaylistItem.htmlSiteName} onChange={this.handleUpdateHtmlSiteName.bind(this)}>{selectOptions}</select>
                        </div>);
                }

                // <select className="leftSpacing" ref="htmlSiteSelect"
                //         onChange={this.onSelectHtmlSite.bind(this)}>{selectOptions}</select>

                selectedMediaProperties =
                    (<div>
                        <p>
                            State name:
                            <input type="text" value={fileName} onChange={this.handleUpdateHTML5StateName.bind(this)}/>
                        </p>
                        {htmlSitesDropDown}
                        <br/>
                        <label><input ref="cbEnableExternalData" type="checkbox" checked={html5PlaylistItem.enableExternalData} onChange={this.handleUpdateHTML5EnableExternalData.bind(this)}/>Enable external data</label><br/>
                        <label><input ref="cbEnableMouseEvents" type="checkbox" checked={html5PlaylistItem.enableMouseEvents} onChange={this.handleUpdateHTML5EnableMouseEvents.bind(this)}/>Enable mouse and touch events</label><br/>
                        <label><input ref="cbDisplayCursor" type="checkbox" checked={html5PlaylistItem.displayCursor} onChange={this.handleUpdateHTML5DisplayCursor.bind(this)}/>Display cursor</label><br/>
                        <label><input ref="cbHWZOn" type="checkbox" checked={html5PlaylistItem.hwzOn} onChange={this.handleUpdateHTML5HWZOn.bind(this)}/>Native video plane playback</label><br/>
                        <br/>
                    </div>);
            }
        }
        else {
            selectedMediaProperties = <div/>;
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

PropertySheet.propTypes = {
    selectedMediaStateId: React.PropTypes.string.isRequired,
    onUpdateVideoMode: React.PropTypes.func.isRequired,
    onBrowseForHTMLSite: React.PropTypes.func.isRequired,
    addHtmlSiteToPresentation: React.PropTypes.func.isRequired,
    updateHTML5StateName: React.PropTypes.func.isRequired,
    updateHTML5SiteName: React.PropTypes.func.isRequired,
    updateHTML5EnableExternalData: React.PropTypes.func.isRequired,
    updateHTML5EnableMouseEvents: React.PropTypes.func.isRequired,
    updateHTML5DisplayCursor: React.PropTypes.func.isRequired,
    updateHTML5HWZOn: React.PropTypes.func.isRequired,
    updateImageTimeOnScreen: React.PropTypes.func.isRequired,
    updateImageTransition: React.PropTypes.func.isRequired,
    updateImageTransitionDuration: React.PropTypes.func.isRequired,
    getCurrentZonePlaylist: React.PropTypes.func.isRequired,
    playlistItems: React.PropTypes.object.isRequired,
    htmlSites: React.PropTypes.object.isRequired,
    sign: React.PropTypes.object.isRequired,
    mediaStates: React.PropTypes.object.isRequired,

};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({updateImageTimeOnScreen, updateImageTransition, updateImageTransitionDuration,
            updateHTML5StateName,
            updateHTML5SiteName,
            updateHTML5EnableExternalData,
            updateHTML5EnableMouseEvents,
            updateHTML5DisplayCursor,
            updateHTML5HWZOn,
            addHtmlSiteToPresentation},
        dispatch);
}

export default connect(null, mapDispatchToProps)(PropertySheet);
