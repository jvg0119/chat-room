import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import '../css/Message.css';

class Message extends Component {

  constructor(props) {
    super(props);

    this.messagesRef = this.props.firebase.database().ref('messages');
    this.roomsRef = this.props.firebase.database().ref('rooms')

    this.state = {
      username: "<USERNAME HERE>",

     messages: [],// ['This is my first sample message', 'This is my second sample message'],
     content: '', // new message
//      sentAt: '', //"123456789",
//      roomId: '', //"abc1234567",
      roomListMessages: [],
      messageContent: '',
      showEdit: true,
    }
  }

  changeHandler = (e) => {
    this.setState({ content: e.target.value});
  }

  validMessageContent(str) {
    // console.log('message is ', str)
    if (str.trim().length > 0) {
      // console.log("something is here", str.trim().length)
      return true
    } else {
      // console.log('nothing is here')
      return false
    }
  }

  submitHandler(e) {
    e.preventDefault();
    if (this.validMessageContent(this.state.content)) {
        this.messagesRef.push({
          roomId: this.props.activeRoom.key,
          content: this.state.content,
          username: this.props.user.displayName,
          sentAt: this.props.firebase.database.ServerValue.TIMESTAMP});
          //console.log('writing to firebase')
          this.setState(() => ({ content: '' }))
          // console.log('submit handler content >>> ', this.state.content)
      }
  } // submitHandler

  formatedDateTime(dateTime) {
    // console.log(Date(dateTime));
    // console.log(new Date(dateTime));
    const today = new Date(dateTime);
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const formatedDateTime = date+' '+time;
    return formatedDateTime
  }

  removeMessage(message) {
    // console.log('checking removeMessage >>> ', this.messagesRef.child(message.key));
    this.messagesRef.child(message.key).remove();
  }

  editMessageHandler(message) {
    this.setState({selectedMessage: message.content})
    this.setState({messageContent: message.content})
  }

  editOnChangeHandler(e) {
    this.setState({messageContent: e.target.value})
  }

  updateMessageHandler(e, message) {
    // console.log('updateMessageHandler !!! >>> ', message)
    const replaceContent  = this.props.firebase.database().ref(`messages/${message.key}`);
    // console.log('>>>>>> ', `messages/${message.key}`)
    replaceContent.update({content: this.state.messageContent})
  }

  updateDisplayedMessages(activeRoom) {
    if(activeRoom && activeRoom.key) {
      const newMessageList = this.state.messages.filter((message) => {
        // console.log('updateDisplayedMessages >>> ', activeRoom)
        return message.roomId.toString() === activeRoom.key.toString();
      });
      this.setState({roomListMessages: newMessageList});
    }
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      // console.log('from child_added @@@@@ ', snapshot.val());
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({
        messages: this.state.messages.concat( message )
      }
      , () => {
        this.updateDisplayedMessages(this.props.activeRoom)
      });
      // console.log('child_added content after >>> ', this.state.content)
    }); //  this.messagesRef.on('child_added'

    this.messagesRef.on('child_removed', snapshot => {
    this.setState((prevState) => ({
      messages: prevState.messages.filter((message) => {
        // console.log('from this.setState(()) the message!!!', message)
        return (
          message.key !== snapshot.key
        )
      })  // messages: prevState.messages.filter((message) => {
    })
    , () => {
      this.updateDisplayedMessages(this.props.activeRoom)
    });
  }); // this.roomsRef.on('child_removed'

  this.messagesRef.on('child_changed', (snapshot) => {
    // console.log('child_changed snapshot >>> ', snapshot.val());
    const updated_message = snapshot.val();
    updated_message.key = snapshot.key;

// find the index of the updated_message; store it in index var
// also create a new message list w/c will replace this.state.messages
    let index;
    let newMessageList = this.state.messages.map((message, i) => {
      if (message.key === updated_message.key) {
        index = i ;
      }
      return message;
    })

// splice the updated_message to the newMessageList so the order remains the same
    newMessageList.splice(index, 1, updated_message);

    this.setState((prevState) => ({
      messages: newMessageList
    }),() => {
      this.updateDisplayedMessages(this.props.activeRoom)
    })

    // same as above
    // this.setState({messages: newMessageList}
    // ,() => {
    //   this.updateDisplayedMessages(this.props.activeRoom)
    // });

  });

  }  //   componentDidMount() {

  componentDidUpdate() {
    // console.log(this.state.roomListMessages);

    this.roomsRef.on('child_removed', (snapshot) => {
      // console.log('child_removed snapshot >>>', snapshot.val())
      const removed_room = snapshot.val();
      removed_room.key = snapshot.key;
      this.state.messages.map((message) => {
        if (message.roomId !== removed_room.key) {
          return message
        } else {
          return (this.removeMessage(message))
        }
      })
    })
  }

  // all props passed to Message.js can be accessed here
  // this will run every time props are received
  componentWillReceiveProps(nextProps) {
    this.updateDisplayedMessages(nextProps.activeRoom);
  }

  render() {
    const messageList = this.state.roomListMessages.map((message) => {
      return (
        <div key={message.key}>
          <ListGroupItem key={message.key} >
            <div className="messages">
              <h4>{message.username}</h4>
              <small>{this.formatedDateTime(message.sentAt)}</small>
              <h5>{message.content}</h5>
              <button
                className="message-del-btn"
                onClick={() => this.removeMessage(message)}
              >del</button>

                {
                  message.content !== this.state.selectedMessage
                  ?
                    <button
                    className="message-edit-btn"
                    onClick={() => this.editMessageHandler(message)}
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
                        onClick={(e) => this.updateMessageHandler(e, message)}
                        >update
                      </button>
                    </div>
                }
            </div>
          </ListGroupItem>
        </div>
      )
    }) /* const messageList */

    return (
      <div>
        <ListGroupItem  active>
          {
            this.props.activeRoom.name
            ? <h3>{this.props.activeRoom.name}</h3>
            : "Please select a room"
          }
        </ListGroupItem>

        <ListGroup>
          {
            this.props.activeRoom !== '' && messageList.length > 0
            ? messageList
            : this.props.activeRoom !== ''
            ? <h4>No message for this room</h4>
            : this.props.messageStatus
          }
        </ListGroup>

        {
          (this.props.user && this.props.activeRoom) &&
          <form
            className="message-form"
            onSubmit={(e) => this.submitHandler(e)}
          >
            <div className="input-submit">
              <input
                type="text"
                className="message-input"
                value={this.state.content}
                placeholder="Enter your new message"
                onChange={(e) => this.changeHandler(e)}
              />
              <input type="submit" value="Send"/>
            </div>
          </form>
        }
      </div>
    )  /* render return() */
  }
}

export default Message;
