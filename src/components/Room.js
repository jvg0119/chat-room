import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/Room.css';

class Room extends Component {

  constructor(props) {
    super(props);

    this.roomsRef = this.props.firebase.database().ref('rooms');
    this.handleHide = this.handleHide.bind(this);

    this.state = {
      rooms: [],
      newRoomName: '',
      show: false
    }
  }

  handleHide() {
    this.setState({ show: false, newRoomName: '' });
  }

  changeHandler(e) {
    this.setState({ newRoomName: e.target.value});
  }

  submitHandler(e) {
    e.preventDefault();
    if(this.state.newRoomName) {
      const newRoom = this.roomsRef.push({
        name: this.state.newRoomName.trim()
      });
    // console.log('the new room is >>>', { name: this.state.newRoomName.trim(), key: newRoom.key })
    // re-created the new object to pass to setActiveRoom
   const tempNewRoom = { name: this.state.newRoomName.trim(), key: newRoom.key }
    // console.log('tempNewRoom >>> ', tempNewRoom);
   this.props.setActiveRoom(tempNewRoom);
    this.setState({show: ''})
    }
  }

  onSelectRoom = (e,room) => {
    e.preventDefault();
    this.props.setActiveRoom(room);
  }

  removeRoomHandler = (room) => {
    this.roomsRef.child(room.key).remove();
    this.props.setActiveRoom('');
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState((prevState) => ({
        rooms: prevState.rooms.concat(room), newRoomName: ''
      }))
    })  // this.roomsRef.on(

    this.roomsRef.on('child_removed', snapshot => {
      const removed_room =  snapshot.val();
      removed_room.key = snapshot.key;
      this.setState((prevState) => ({
        rooms: prevState.rooms.filter((room) => {
          return (
            room.key !== removed_room.key
          )
        })
      }))
    }); // this.roomsRef.on
  }  // componentDidMount()

  render() {

    return (
      <div>

        <div className="modal-container" style={{ height: 30}}>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={() => this.setState({ show: true })}
          >New room</Button>

          <Modal
            show={this.state.show}
            onHide={this.handleHide}
            container={this}
            aria-labelledby="contained-modal-title"
          >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Create new room
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              onChange={(e) => this.changeHandler(e)}
              value={this.state.newRoomName}
              style={{width: 500, height: 40}}
              placeholder={"Enter a new room name"}
            /> &nbsp;
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleHide}>Close</Button>
            <Button
              bsStyle="primary"
              bsSize="small"
              onClick={(e) => this.submitHandler(e)}
            >Submit</Button>
          </Modal.Footer>
        </Modal>
      </div>

      {
        this.state.rooms.map((room) => {
          return(
            <div key={room.key}
              className="room-list">
              <h4><a onClick={(e) => this.onSelectRoom(e,room)}>{room.name}</a></h4>
              <button className="room-del-btn"
                onClick={() => this.removeRoomHandler(room)}
              >del</button>
            </div>
          )
        })
      }

      </div>
    )  // return()
  }  // render()
}  // class Room

export default Room;
