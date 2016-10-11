/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BAUI from '../platform/baUI';
import EditPreferencesDlg from '../components/Dialogs/editPreferencesDlg';
//
import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';
import MediaLibrary from '../components/mediaLibrary';
import PropertySheet from '../components/propertySheet';
import NonInteractivePlaylist from './nonInteractivePlaylist';


import { createDefaultPresentation, updateSign, loadAppData, selectMediaFolder } from '../actions/index';
// import { getBSNAuthToken, getBSNProfile, getBSNSelf, getBSNNetworks, getBSNContent, getBSNGroups, getBSNDevices,
//     getMyBSNUsers, getBSNUser, getBSNAccountUsers, getBSNPresentations } from '../actions/bsnActions';
// import { getCurrentBrightSignStatus, getBrightSignId } from '../actions/lfnActions';
//
// import { initializeCloudFirmwareSpecs } from '../actions/fwActions';
//
// import LWSPublisher from '../publisher/lwsPublisher';
// import { publishToLWS } from '../publisher/lwsPublisher';
// import PublishFirmware from '../entities/publishFirmware';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bsnPresentations: [],
            propertySheetOpen: false,
            selectedZone: null,
            selectedMediaStateId: "",
            selectedPlaylistItemId: "",
            open: false,
        };

        this.baUI = new BAUI(this);

    }

    componentWillMount() {

        // this.props.initializeCloudFirmwareSpecs();
        //
        this.props.createDefaultPresentation("Project 1");

        this.props.loadAppData();
    }

    componentDidMount() {

        var self = this;

        this.baUI.init();

        // tmp code to test publishing to LWS
        // const lwsPublisher = new LWSPublisher();
        // lwsPublisher.publishToLWS();

        // tmp code to test BSN rest API interactions
        // this.props.getBSNAuthToken();
    }

    // getFamilyFWVersionInfo(firmwareSpecsByFamily, publishFirmware) {
    //     publishFirmware.productionVersion = firmwareSpecsByFamily.Production.version;
    //     publishFirmware.betaVersion = firmwareSpecsByFamily.Beta.version;
    //     publishFirmware.compatibleVersion = firmwareSpecsByFamily.MinimumCompatible.version;
    //     publishFirmware.productionReleaseURL = firmwareSpecsByFamily.Production.url;
    //     publishFirmware.betaReleaseURL = firmwareSpecsByFamily.Beta.url;
    //     publishFirmware.compatibleReleaseURL = firmwareSpecsByFamily.MinimumCompatible.url;
    //     publishFirmware.productionReleaseSHA1 = firmwareSpecsByFamily.Production.sha1;
    //     publishFirmware.betaReleaseSHA1 = firmwareSpecsByFamily.Beta.sha1;
    //     publishFirmware.compatibleReleaseSHA1 = firmwareSpecsByFamily.MinimumCompatible.sha1;
    //     publishFirmware.productionReleaseFileLength = firmwareSpecsByFamily.Production.length;
    //     publishFirmware.betaReleaseFileLength = firmwareSpecsByFamily.Beta.length;
    //     publishFirmware.compatibleReleaseFileLength = firmwareSpecsByFamily.MinimumCompatible.length;
    // }


    // getFWVersionInfo() {
    //
    //     const firmwareSpecsByFamily = this.props.firmwareSpecs.firmwareSpecsByFamily;
    //
    //     this.getFamilyFWVersionInfo(firmwareSpecsByFamily["Puma"], this.pumaPublishFirmware);
    //     this.getFamilyFWVersionInfo(firmwareSpecsByFamily["Pantera"], this.panteraPublishFirmware);
    //     this.getFamilyFWVersionInfo(firmwareSpecsByFamily["Impala"], this.impalaPublishFirmware);
    //     this.getFamilyFWVersionInfo(firmwareSpecsByFamily["Panther"], this.pantherPublishFirmware);
    //     this.getFamilyFWVersionInfo(firmwareSpecsByFamily["Cheetah"], this.cheetahPublishFirmware);
    //     this.getFamilyFWVersionInfo(firmwareSpecsByFamily["Tiger"], this.tigerPublishFirmware);
    //     this.getFamilyFWVersionInfo(firmwareSpecsByFamily["Bobcat"], this.bobcatPublishFirmware);
    //     this.getFamilyFWVersionInfo(firmwareSpecsByFamily["Lynx"], this.lynxPublishFirmware);
    // }

    lwsPublish() {
        console.log("lws publish invoked");
    //     const lwsPublisher = new LWSPublisher();
    //
    //     this.pumaPublishFirmware = new PublishFirmware();
    //     this.pumaPublishFirmware.firmwareUpdateSource = "none";
    //     this.pumaPublishFirmware.firmwareUpdateStandardTargetFileName = "puma-update.bsfw";
    //     this.pumaPublishFirmware.firmwareUpdateDifferentTargetFileName = "puma-update_different.bsfw";
    //     this.pumaPublishFirmware.firmwareUpdateNewerTargetFileName = "puma-update_newer.bsfw";
    //     this.pumaPublishFirmware.firmwareUpdateSaveTargetFileName = "puma-update_save.bsfw";
    //
    //     this.panteraPublishFirmware = new PublishFirmware;
    //     this.panteraPublishFirmware.firmwareUpdateSource = "none";
    //     this.impalaPublishFirmware = new PublishFirmware;
    //     this.impalaPublishFirmware.firmwareUpdateSource = "none";
    //     this.pantherPublishFirmware = new PublishFirmware;
    //     this.pantherPublishFirmware.firmwareUpdateSource = "none";
    //     this.cheetahPublishFirmware = new PublishFirmware;
    //     this.cheetahPublishFirmware.firmwareUpdateSource = "none";
    //     this.tigerPublishFirmware = new PublishFirmware();
    //     this.tigerPublishFirmware.firmwareUpdateSource = "none";
    //     this.tigerPublishFirmware.firmwareUpdateSourceFilePath = "/Users/tedshaffer/Documents/BSReleases/Tiger/tiger-6.2.48-update.bsfw";
    //     this.tigerPublishFirmware.firmwareUpdateStandardTargetFileName = "tiger-update.bsfw";
    //     this.tigerPublishFirmware.firmwareUpdateDifferentTargetFileName = "tiger-update_different.bsfw";
    //     this.tigerPublishFirmware.firmwareUpdateNewerTargetFileName = "tiger-update_newer.bsfw";
    //     this.tigerPublishFirmware.firmwareUpdateSaveTargetFileName = "tiger-update_save.bsfw";
    //
    //     this.bobcatPublishFirmware = new PublishFirmware;
    //     this.bobcatPublishFirmware.firmwareUpdateSource = "none";
    //     this.lynxPublishFirmware = new PublishFirmware;
    //     this.lynxPublishFirmware.firmwareUpdateSource = "none";
    //
    //     this.getFWVersionInfo();
    //
    //     lwsPublisher.publishToLWS("Standard", this.pumaPublishFirmware,
    //         this.panteraPublishFirmware, this.impalaPublishFirmware,
    //         this.pantherPublishFirmware, this.cheetahPublishFirmware,
    //         this.tigerPublishFirmware, this.bobcatPublishFirmware, this.lynxPublishFirmware);
    }


    handleSelectMediaState(mediaState) {
        this.setState({ selectedMediaStateId: mediaState.getId() });
    }


// edit preferences using material ui
    handleEditPreferences() {
        console.log("handleEditPreferences in ba");
        this.refs.editPreferencesDlg.handleOpen();
    }

    handleEditPreferencesOK(preferences) {
        console.log("handleEditPreferencesOK invoked");
        console.log(preferences);
    }

    // instead of using action creators, just dispatch the action directly?
    handleUpdateVideoMode(videoMode) {
        // in reducer?
        const sign = Object.assign({}, this.props.sign, {videoMode: videoMode });
        console.log("updateVideoMode:", videoMode);
        this.props.updateSign(sign);
    }


    handleToggleOpenClosePropertySheet() {
        this.setState({propertySheetOpen: !this.state.propertySheetOpen});
    }

    getEmptyPlaylistItem(existingPlaylistItem) {

        let emptyPlaylistItem = null;
        const emptyImagePlaylistItem = new ImagePlaylistItem();
        const emptyHTML5PlaylistItem = new HTML5PlaylistItem();
        if (existingPlaylistItem instanceof ImagePlaylistItem) {
            emptyPlaylistItem = emptyImagePlaylistItem;
        }
        else if (existingPlaylistItem instanceof HTML5PlaylistItem) {
            emptyPlaylistItem = emptyHTML5PlaylistItem;
        }
        else {
            console.log("existingPlaylistItem: unknown playlistItem type");
        }
        return emptyPlaylistItem;
    }


    copyExistingPlaylistItem(selectedPlaylistItemId) {

        const existingPlaylistItem = this.props.playlistItems.playlistItemsById[selectedPlaylistItemId];
        let emptyPlaylistItem = this.getEmptyPlaylistItem(existingPlaylistItem);
        if (!emptyPlaylistItem) return null;

        return Object.assign(emptyPlaylistItem, existingPlaylistItem);

    }

    handleUpdateHTML5StateName(selectedPlaylistItemId, html5StateName) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.setFileName(html5StateName);
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5SiteName(selectedPlaylistItemId, html5SiteName) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.htmlSiteName = html5SiteName;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5EnableExternalData(selectedPlaylistItemId, enableExternalData) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.enableExternalData = enableExternalData;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5EnableMouseEvents(selectedPlaylistItemId, enableMouseEvents) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.enableMouseEvents = enableMouseEvents;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5DisplayCursor(selectedPlaylistItemId, displayCursor) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.displayCursor = displayCursor;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5HWZOn(selectedPlaylistItemId, hwzOn) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.hwzOn = hwzOn;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }


    getCurrentZone() {

        let selectedZone = null;
        if (this.props.sign && this.props.sign.zoneIds.length > 0 && this.props.zones && this.props.zones.zonesById) {

            if (!this.state.selectedZone) {
                selectedZone = this.props.zones.zonesById[this.props.sign.zoneIds[0]];
            }
            else {
                selectedZone = this.state.selectedZone;
            }

            if (!selectedZone) {
                selectedZone = null;
            }
        }
        return selectedZone;
    }

    getCurrentZonePlaylist() {

        let currentZonePlaylist = null;

        let selectedZone = this.getCurrentZone();
        if (selectedZone) {
            currentZonePlaylist = this.props.zonePlaylists.zonePlaylistsById[selectedZone.zonePlaylistId];
        }
        return currentZonePlaylist;
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    // getBSNJSX()
    //     // this.props.getBSNProfile();
    //     // this.props.getBSNSelf();
    //     // this.props.getBSNNetworks();
    //     this.props.getBSNContent();
    //     // this.props.getBSNGroups();
    //     // this.props.getBSNDevices();
    //     // this.props.getBSNUsers();
    //     // this.props.getBSNUser("12650");
    //     // this.props.getBSNAccountUsers();
    //     // this.props.getBSNPresentations();
    //     // this.props.getCurrentBrightSignStatus();
    //     // this.props.getBrightSignId();
    //     return <div>pizza</div>;
    // }

    render () {

        let signName = <span>No sign yet</span>;
        let signVideoMode = <span>No videoMode yet</span>;
        if (this.props.sign) {
            signName = this.props.sign.name;
            signVideoMode = this.props.sign.videoMode;
        }

        // // const bsnJSX = this.getBSNJSX();
        // const openSavePresentationJSX = this.baUI.getOpenSavePresentationJSX(this.state.bsnPresentations);
        const openSavePresentationJSX = <div>pizza!!!</div>;

        let propertySheetTag = <div></div>;
        if (this.state.propertySheetOpen) {
            propertySheetTag =
                <PropertySheet
                    onBrowseForHTMLSite={this.baUI.handleBrowseForHTMLSite.bind(this.baUI)}
                    onUpdateVideoMode = {this.handleUpdateVideoMode.bind(this)}
                    getCurrentZone = {this.getCurrentZone.bind(this)}
                    getCurrentZonePlaylist = {this.getCurrentZonePlaylist.bind(this)}
                    selectedMediaStateId={this.state.selectedMediaStateId}
                    selectedPlaylistItemId={this.state.selectedPlaylistItemId}
                    sign={this.props.sign}
                    zones= {this.props.zones}
                    zonePlaylists= {this.props.zonePlaylists}
                    playlistItems= {this.props.playlistItems}
                    mediaStates= {this.props.mediaStates}

                    htmlSites= {this.props.htmlSites}
                    onUpdateHTML5StateName = {this.handleUpdateHTML5StateName.bind(this)}
                    onUpdateHTML5SiteName = {this.handleUpdateHTML5SiteName.bind(this)}
                    onUpdateHTML5EnableExternalData = {this.handleUpdateHTML5EnableExternalData.bind(this) }
                    onUpdateHTML5EnableMouseEvents = {this.handleUpdateHTML5EnableMouseEvents.bind(this) }
                    onUpdateHTML5DisplayCursor = {this.handleUpdateHTML5DisplayCursor.bind(this) }
                    onUpdateHTML5HWZOn = {this.handleUpdateHTML5HWZOn.bind(this) }
                />;
        }

        return (

            <div>

                <div>
                    <button type="button" onClick={this.lwsPublish.bind(this)}>LWS Publish</button>
                </div>

                <div>
                    <span>{signName}</span>
                    :
                    <span>{signVideoMode}</span>
                </div>

                {openSavePresentationJSX}

                <div className="bangPageContainer">
                    <MediaLibrary
                        onBrowseForMediaLibrary={this.baUI.handleBrowseForMediaLibrary.bind(this.baUI)}
                        mediaLibraryPlaylistItems={this.props.mediaLibraryPlaylistItems}
                        mediaFolder={this.props.mediaFolder}
                        mediaThumbs={this.props.mediaThumbs}
                    />
                    <NonInteractivePlaylist
                        sign={this.props.sign}
                        zones={this.props.zones}
                        zonePlaylists={this.props.zonePlaylists}
                        mediaThumbs={this.props.mediaThumbs}
                        onSelectMediaState={this.handleSelectMediaState.bind(this)}
                        selectedMediaStateId={this.state.selectedMediaStateId}
                        onToggleOpenClosePropertySheet={this.handleToggleOpenClosePropertySheet.bind(this)}
                        propertySheetOpen={this.state.propertySheetOpen}
                        bangSign={this.props.sign}
                        bangZones={this.props.zones}
                    />
                    {propertySheetTag}
                    <EditPreferencesDlg
                        ref="editPreferencesDlg"
                        onEditPreferencesOK={this.handleEditPreferencesOK.bind(this)}
                    />
                </div>

            </div>
        );
    }
}

function mapStateToProps(baState) {

    const state = baState.reducers;

    return {
        sign: state.sign,
        zones: state.zones,
        zonePlaylists: state.zonePlaylists,
        mediaStates: state.mediaStates,
        playlistItems: state.playlistItems,
        htmlSites: state.htmlSites,

        mediaLibraryPlaylistItems: state.mediaLibraryPlaylistItems,
        mediaFolder: state.mediaFolder,
        mediaThumbs: state.mediaThumbs,

        bsnAuthData: state.bsnAuthData,

        firmwareSpecs: state.firmwareSpecs
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({createDefaultPresentation, updateSign, loadAppData, selectMediaFolder
        },
        dispatch);
}


// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({createDefaultPresentation, updateSign, loadAppData, selectMediaFolder,
//             getBSNAuthToken, getBSNProfile, getBSNSelf, getBSNNetworks, getBSNContent, getBSNGroups, getBSNDevices,
//             getMyBSNUsers, getBSNUser, getBSNAccountUsers, getBSNPresentations,
//             getCurrentBrightSignStatus, getBrightSignId,
//             initializeCloudFirmwareSpecs
//         },
//         dispatch);
// }

// updateMediaState
BA.propTypes = {
    createDefaultPresentation: React.PropTypes.func.isRequired,
    loadAppData: React.PropTypes.func.isRequired,
    updateSign: React.PropTypes.func.isRequired,
    sign: React.PropTypes.object.isRequired,
    zones: React.PropTypes.object.isRequired,
    zonePlaylists: React.PropTypes.object.isRequired,
    mediaStates: React.PropTypes.object.isRequired,
    playlistItems: React.PropTypes.object.isRequired,
    mediaFolder: React.PropTypes.string.isRequired,
    mediaThumbs: React.PropTypes.object.isRequired,
    mediaLibraryPlaylistItems: React.PropTypes.array.isRequired,
    htmlSites: React.PropTypes.object.isRequired,
    //
    // getBSNAuthToken: React.PropTypes.func.isRequired,
    // getBSNProfile: React.PropTypes.func.isRequired,
    // getBSNSelf: React.PropTypes.func.isRequired,
    // getBSNNetworks: React.PropTypes.func.isRequired,
    // getBSNContent: React.PropTypes.func.isRequired,
    // getBSNGroups: React.PropTypes.func.isRequired,
    // getBSNDevices: React.PropTypes.func.isRequired,
    // getMyBSNUsers: React.PropTypes.func.isRequired,
    // getBSNUser: React.PropTypes.func.isRequired,
    // getBSNAccountUsers: React.PropTypes.func.isRequired,
    // getBSNPresentations: React.PropTypes.func.isRequired,
    //
    // getCurrentBrightSignStatus: React.PropTypes.func.isRequired,
    // getBrightSignId: React.PropTypes.func.isRequired,
    //
    // initializeCloudFirmwareSpecs: React.PropTypes.func.isRequired,
    // firmwareSpecs: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(BA);
