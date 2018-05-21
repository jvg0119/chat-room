import React, { Component } from 'react';
import '../css/MessageComponent.css';

class MessageComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messageContent: '',
      selectMessage: '',
      showEdit: false
    }
  }

  editMessageHandler(message) {
    this.setState({
      selectedMessage: message.content,
      messageContent: message.content,
      showEdit: true
    });
    console.log('showEdit is >>> ', this.state.showEdit)
  }

  editOnChangeHandler(e) {
    this.setState({messageContent: e.target.value})
  }

  updateMessageHandler(e, message) {
    const oldMessage = message.content;
    if (oldMessage !== this.state.messageContent) {
      const replaceContent  = this.props.firebase.database().ref(`messages/${message.key}`);
      replaceContent.update({content: this.state.messageContent})
      this.setState({showEdit: false})
    } else {
      this.setState({ showEdit: false });
      // console.log('here shwoEdit is now #### ', this.state.showEdit)
    }
  }

  render() {
    return(
      <div>
        {
        !this.state.showEdit || (this.props.message.content !== this.state.selectedMessage)
        ?
          <button
          className="message-edit-btn"
          onClick={() => this.editMessageHandler(this.props.message)}
          >edit</button>
        :
        <div>
          <input
            type="text"
            className="update-message"
            value={this.state.messageContent}
            onChange={(e) => this.editOnChangeHandler(e)}
          />
          <button
            className="message-update-btn"
            onClick={(e) => this.updateMessageHandler(e, this.props.message)}
            >update
          </button>
        </div>
        }
      </div>
    )
  }
}

export default MessageComponent;
