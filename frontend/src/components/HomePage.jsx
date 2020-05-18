import React, {Component} from "react";
import LazyHero from "react-lazy-hero";
import background from "../static/images/homepage.jpg";
import { withRouter } from "react-router-dom";

import {Button, FormControl} from "react-bootstrap";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.textInput = React.createRef();
    }

    adminHandler = () => {
        let path = `/admin`;
        this.props.history.push(
            path
        );
    }

    customerHandler = () => {
        let path = `/customer`;
        this.props.history.push(
            path
        );
    }

    associateHandler = () => {
        let path = `/associate`;
        this.props.history.push(
            path
        );
    }

    onChange = (event) => {
        const value = this.textInput.current.value;
        localStorage.setItem("username", value);
    }

    render() {
        return (
            <div style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                <LazyHero 
                    color="#000000"
                    opacity={0.6}
                    imageSrc={background}
                    minHeight="100vh"
                    parallaxOffset={100}
                >
                <div
                    classname="home"
                    style={{
                        position: "absolute",
                        top: "30%",
                        left: "50%",
                        transform: "translate(-50%, 50%)",
                        textAlign: "center",
                        color: "white"
                    }}
                >
                    <Button variant="primary" size="lg" onClick={this.customerHandler}>Customer</Button>
                    <br />
                    <br />
                    <Button variant="primary" size="lg" onClick={this.associateHandler}>Associate</Button>
                    <br />
                    <br />
                    <Button variant="primary" size="lg" onClick={this.adminHandler}>Admin</Button> 
                    <br />
                    <br />
                    <div>
                        <FormControl ref={this.textInput} type="text" onChange={this.onChange} />
                    </div>
                </div>

                </LazyHero>
            </div>
        )
    }
}

export default withRouter(HomePage);