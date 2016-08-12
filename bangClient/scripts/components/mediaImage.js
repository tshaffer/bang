import React, { Component } from 'react';

class MediaImage extends Component {

    render() {

        return (

            <img

                {...this.props}
                className="playlistThumbImg"
                data-index={this.props.dataIndex+1}
                onMouseDown={this.props.onMouseDown}

                onMouseMove={(event) => self.onMediaStateImgMouseMove(event)}
                onMouseUp={(event) => self.onMediaStateImgMouseUp(event)}
                style={ { left: "0px", top: "0px" } }
                draggable={true}
                onDragStart={(event) => self.mediaImageDragStartHandler(event)}
                onDragOver={(event) => self.mediaImageDragOverHandler(event)}

                data-name={this.props.fileName}
                data-path={this.props.filePath}
                data-type="image"
            />
        );
    }
}

export default MediaImage;

// export () => (
//  <div>...content</div>
// );
// see http://redux.js.org/docs/basics/ExampleTodoList.html
