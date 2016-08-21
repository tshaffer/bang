import React, { Component } from 'react';

class MediaImage extends Component {

    render() {

        return (

            <img

                {...this.props}
                className="playlistThumbImg"
                data-index={this.props.dataIndex+1}

                style={ { left: "0px", top: "0px" } }
                draggable={true}

                data-name={this.props.fileName}
                data-path={this.props.filePath}
                data-type="image"
            />
        );
    }
}

MediaImage.propTypes = {
    id: React.PropTypes.string.isRequired,
    src: React.PropTypes.string.isRequired,
    'data-index': React.PropTypes.number.isRequired,
    onMouseDown: React.PropTypes.func.isRequired,
    fileName: React.PropTypes.string.isRequired,
    filePath: React.PropTypes.string.isRequired

};


export default MediaImage;

// export () => (
//  <div>...content</div>
// );
// see http://redux.js.org/docs/basics/ExampleTodoList.html
