/**
 * Created by tedshaffer on 6/19/16.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ImagePlaylistItem from '../badm/imagePlaylistItem';

import { updateSelectedPlaylistItem, updateSign } from '../actions/index';
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
            htmlSitePath: "browse to html site"
        };

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

        // case 9:
        // slideTransitionSpec = "Explode bottom right";
        // break;
        // case 10:
        // slideTransitionSpec = "Venetian blinds - vertical";
        // break;
        // case 11:
        // slideTransitionSpec = "Venetian blinds - horizontal";
        // break;
        // case 12:
        // slideTransitionSpec = "Comb effect - vertical";
        // break;
        // case 13:
        // slideTransitionSpec = "Comb effect - horizontal";
        // break;
        // case 14:
        // slideTransitionSpec = "Fade to background color";
        // break;
        // case 15:
        // slideTransitionSpec = "Fade to new image";
        // break;
        // case 16:
        // slideTransitionSpec = "Slide from top";
        // break;
        // case 17:
        // slideTransitionSpec = "Slide from bottom";
        // break;
        // case 18:
        // slideTransitionSpec = "Slide from left";
        // break;
        // case 19:
        // slideTransitionSpec = "Slide from right";

    }

    componentWillMount() {
        console.log("PropertySheet: componentWillMount invoked");
    }

    componentDidMount() {
        console.log("PropertySheet::componentDidMount invoked");
    }

    updateVideoMode(event) {
        const sign = Object.assign({}, this.props.sign, {videoMode: event.target.value });
        console.log("updateVideoMode:", event.target.value);
        this.props.updateSign(sign);
    }

    updateHTMLSiteName(event) {

    }

    updateLocalHTMLSitePath(event) {

    }

    browseForHTMLSite(event) {
        var self = this;
        this.props.onBrowseForHTMLSite().then(function(myHtmlSitePath)  {
            self.setState( { htmlSitePath: myHtmlSitePath })
        });
    }

    updateSiteURL(event) {

    }

    addHTMLSite(event) {

    }

    updateTimeOnScreen(event) {
        let selectedPlaylistItem = Object.assign({}, this.props.selectedPlaylistItem, { timeOnScreen: event.target.value} );
        this.props.updateSelectedPlaylistItem(selectedPlaylistItem);
    }

    updateTransition(event) {
        if (event !== undefined) {
            let selectedPlaylistItem = Object.assign({}, this.props.selectedPlaylistItem, { transition: event.target.value} );
            this.props.updateSelectedPlaylistItem(selectedPlaylistItem);

            console.log("selectedPlaylistItem.transition=", selectedPlaylistItem.transition);
            console.log("this.props.selectedPlaylistItem.transition=", this.props.selectedPlaylistItem.transition);
        }
    }

    updateTransitionDuration(event) {
        let selectedPlaylistItem = Object.assign({}, this.props.selectedPlaylistItem, { transitionDuration: event.target.value} );
        this.props.updateSelectedPlaylistItem(selectedPlaylistItem);
    }


    render () {

        var self = this;

        let signProperties = "Sign Properties";
        let htmlProperties = "HTML Sites";
        let selectedMediaProperties = "Media Properties";

        // <span className="smallFont">Local: </span><input type="text" id="htmlLocalSitePath" value={this.htmlLocalSitePath} onChange={this.updateLocalHTMLSitePath.bind(this)}>{this.state.htmlSitePath}</input>

    if (this.props.sign) {

            let selectOptions = this.videoModes.map(function(videoMode, index) {

                return (
                    <option value={videoMode} key={index}>{videoMode}</option>
                );
            });

            signProperties =
                <div>
                    Video mode: <br/>
                    <select id="videoModeSelect" defaultValue={this.props.sign.videoMode} onChange={this.updateVideoMode.bind(this)}>{selectOptions}</select>
                </div>

            const shortenedHtmlSitePath = getShortenedFilePath(this.state.htmlSitePath, 36);
            htmlProperties =
                <div>
                    <span className="smallishFont">Name: </span><input type="text" id="htmlSiteName" value={this.htmlSiteName} onChange={this.updateHTMLSiteName.bind(this)}></input>


                    <br/><br/>

                    <form>
                        <input type="radio" name="html" className="smallishFont" value="local"/><span className="smallishFont">Local</span>
                        <span className="smallishFont" id="htmlLocalSitePath">{shortenedHtmlSitePath}</span>
                        <button className="leftOffsetButton" type="button" id="btnBrowseForSite" onClick={this.browseForHTMLSite.bind(this)}>Browse</button>

                        <br/><br/>
                        <input type="radio" name="html" className="smallishFont" value="remote"/><span className="smallishFont">URL</span>
                        <input type="text" id="htmlSiteURL" value={this.htmlSiteURL} onChange={this.updateSiteURL.bind(this)}></input>
                    </form>

                    <br/>
                    <button className="smallishFont" type="button" id="btnAddHTMLSite" onClick={this.addHTMLSite.bind(this)}>Add Site</button>
                </div>
        }

        if (this.props.selectedPlaylistItem && this.props.selectedPlaylistItem.timeOnScreen > 0) {

            const imagePlaylistItem = this.props.selectedPlaylistItem;
            console.log("imagePlaylistItem.transition=", imagePlaylistItem.transition);

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
                        <input type="text" value={imagePlaylistItem.timeOnScreen} onChange={this.updateTimeOnScreen.bind(this)}></input>
                    </p>
                    <div>
                        Transition:
                        <select id="transitionsSelect" defaultValue={imagePlaylistItem.transition} onChange={this.updateTransition.bind(this)}>{selectOptions}</select>
                    </div>
                    <p>
                        Transition duration:
                        <input type="text" value={imagePlaylistItem.transitionDuration} onChange={this.updateTransitionDuration.bind(this)}></input>
                    </p>
                </div>
            ;
        }

        return (
            <div className="propertySheetDiv">
                <p className="smallishishFont">Properties</p>
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

function mapStateToProps(state) {
    return {
        sign: state.sign,
        selectedPlaylistItem: state.selectedPlaylistItem
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateSign, updateSelectedPlaylistItem }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertySheet);
