/**
 * Created by tedshaffer on 7/30/16.
 */
import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class EditPreferencesDlg extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    handleOpen() {
        this.setState({open: true});
    };

    handleClose() {
        this.setState({open: false});
    };

    handleOK() {

        let preferences = {};
        preferences.imageTimeOnScreen = this.refs.imageTimeOnScreen.value;
        preferences.imageTransition = this.refs.imageTransition.value;
        preferences.imageTransitionDuration = this.refs.imageTransitionDuration.value;

        this.props.onEditPreferencesOK(preferences);
        this.handleClose();
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose.bind(this)}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={this.handleOK.bind(this)}
            />,
        ];

        return (
            <div>
                <Dialog
                    title="Edit Preferences"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                >

                    <form>

                        Time on Screen (seconds):<br/>
                        <input className="formTextBoxStandardWidth" type="text" ref="imageTimeOnScreen"></input>
                        <br/>

                        <br/>
                        Transition:<br/>
                        <select ref="imageTransition">
                            <option value="noEffect">No Effect</option>
                            <option value="imageWipeFromTop">Image wipe from top</option>
                            <option value="explodeFromCenter">Explode from center</option>
                            <option value="slideFromTop">Slide from top</option>
                        </select>
                        <br/>

                        <br/>
                        Transition Duration (seconds):<br/>
                        <input className="formTextBoxStandardWidth" type="text" ref="imageTransitionDuration"></input>
                        <br/>

                    </form>

                </Dialog>
            </div>
        );
    }
}

export default EditPreferencesDlg;
