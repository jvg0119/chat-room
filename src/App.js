import React, { Component } from 'react';
import './css/App.css';
import * as firebase from 'firebase';
import Room from './components/Room';
import Message from './components/Message';
import User from './components/User';

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCwgl785YvZvCLjDs-8uKx66v6IqAUKrkQ",
    authDomain: "chat-room-ed417.firebaseapp.com",
    databaseURL: "https://chat-room-ed417.firebaseio.com",
    projectId: "chat-room-ed417",
    storageBucket: "chat-room-ed417.appspot.com",
    messagingSenderId: "333739949404"
  };
  firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeRoom: '',
      user: null,
      userEmail: null,
      currentRoomName: 'No room selected',
      messageStatus: 'boom',
      activeEditMessage: ''
    }
  }

  setActiveRoom = (room) => {
    this.setState({activeRoom: room})
    // console.log('room in setActiveRoom >>> ', room.name)
  }

  setUser = (user) => {
    this.setState({user: user});
  }

  setActiveEditMessage = (message) => {
    this.setState((prevState) => ({
      activeEditMessage: message
    }))
  }

  render() {
    return (
      <div className="container">

        <div className="left-col">
          <div>
            <h1 className="heading">Chat Room</h1>
            <Room
              firebase={firebase}
              setActiveRoom={this.setActiveRoom}
              activeRoom={this.state.activeRoom}
              user={this.state.user}
            />
          </div>
          <User firebase={firebase} setUser={this.setUser} user={this.state.user}/>
        </div>  {/* left-col */}

        <div className="right-col">
          <div>
            <Message
              firebase={firebase}
              activeRoom={this.state.activeRoom}
              user={this.state.user}
            />
          </div>
        </div>  {/* left-col */}

      </div> 
    );
  }
}

export default App;
