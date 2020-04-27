import React, { Component } from 'react';
import './Square.css';
import Popup from './Popup';
import Draggable from 'react-draggable';
class Square extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Id:this.props.Id,
            colour:this.props.colour,
            width:this.props.size.width,
            height:this.props.size.height,
            showPopup:false,
            isHighlighted:false,
            products : [],
            latlng:{
                latitude:this.props.latlng.latitude,
                longitude:this.props.latlng.longitude,
                //latitudeDelta:0.0922,
                //longitudeDelta:0.0421
            }
        };
    }

    componentDidMount() {
        fetch('http://127.0.0.1:5000/square/'+this.state.Id, {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Id:this.state.Id
            })
        })
        .then(res => res.json())
        .then(data => {
            this.setState({
                products:data
            });
            console.log(this.state.products);
        });
    }

    togglePopup() {  
        this.setState({  
             showPopup: !this.state.showPopup  
        });
        if(this.state.showPopup)
        {
            alert("x="+this.state.latlng.latitude+" y="+this.state.latlng.longitude);
        }  
    } 
    
    handleStop = (e)=> {
        this.setState({latlng:{latitude:e.x,longitude:e.y}})
    }

    render() {
        return (
            <div style={{width:this.state.width,height:this.state.height}}>
                <Draggable
                class='draggable'
                defaultPosition={{x: this.state.latlng.latitude, y: this.state.latlng.longitude}}
                onStop={this.handleStop}
                >
                    <div class='square-grid'>
                        <div class='square-grid__cell' style={{backgroundColor:this.state.colour}}>
                            <div class='square-grid__content'>
                                <button class='button' onClick={this.togglePopup.bind(this)}> I </button>
                                {this.state.showPopup ?  <Popup products={this.state.products} 
                                                        closePopup={this.togglePopup.bind(this)}/>  : null}
                            </div>
                        </div>
                    </div>
                </Draggable>
            </div>         
        );
    }
}

export default Square;