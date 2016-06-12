import React, { Component } from 'react';

import axios from 'axios';

export default class BAUI {
    
    constructor(ba) {
        this.ba = ba;
    }

    init() {
        this.retrievePresentations();
    }

    retrievePresentations() {

        var self = this;

        console.log("retrievePresentations");

        const getBSNPresentationsUrl = "http://localhost:6969/getBSNPresentations";

        axios.get(getBSNPresentationsUrl, {
            params: { }
        }).then(function(data) {
            console.log("onOpenPresentation - return from server call");
            console.log("Number of bsnPresentations" + data.data.bsnPresentations.length);
            self.ba.setState( { bsnPresentations: data.data.bsnPresentations} )
        })
    }

    getOpenSavePresentationJSX(bsnPresentationsState) {

        if (bsnPresentationsState == undefined) {
            return <div></div>
        }
        const bsnPresentationsDiv = this.getPresentationsDiv(bsnPresentationsState);

        return (
            <div>
                <div>
                    <button onClick={this.onOpenPresentation.bind(this)}>Open Presentation</button>
                    {bsnPresentationsDiv}
                </div>

                <div>
                    <button onClick={this.onSavePresentation.bind(this)}>Save Presentation As</button>
                    <input
                        type="text"
                        id="bsnPresentationName"
                        ref="presentationName"/>
                </div>
            </div>
        )
    }

    getPresentationsDiv(bsnPresentationsState) {

        let bsnPresentationsDiv = <span></span>;
        if (bsnPresentationsState.length > 0) {

            this.selectedPresentation = bsnPresentationsState[0];

            let bsnPresentations = bsnPresentationsState.map(function(bsnPresentationName, index) {
                return (
                    <option value={bsnPresentationName} key={index}>{bsnPresentationName}</option>
                );
            });

            bsnPresentationsDiv = <select onChange={this.onPresentationSelected.bind(this)} defaultValue={bsnPresentations[0]} id="bsnPresentations">{bsnPresentations}</select>
        }

        return bsnPresentationsDiv;
    }

    onOpenPresentation() {
        this.ba.props.fetchSign(this.selectedPresentation);
    }

    onPresentationSelected(event) {
        this.selectedPresentation = event.target.value;
    }

    onSavePresentation() {
        console.log("save presentation, name it ", this.refs.presentationName.value);

        const presentation = JSON.stringify(this.props.sign, null, 2);

        this.ba.props.saveBSNPresentation(this.refs.presentationName.value, presentation);
    }
}
