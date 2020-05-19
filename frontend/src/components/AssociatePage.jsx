import React, {Component} from "react";
import {Container,
        Navbar,
        Nav,
        Card,
        Row,
        Col,
        Button,
    } from "react-bootstrap";
import axios from "axios";
import {withRouter} from "react-router-dom";
import FloorPlan from "./FloorPlan";

class AssociatePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            status: true,
        };
    }

    componentWillMount() {
        axios.get('http://127.0.0.1:5000/user/customer/' + localStorage.getItem("username"))
        .then(res => {
            if(res.data == null) {
                console.log("Wrong username");
                this.props.history.push(`/home`);
            }
            else {
                const userid = res.data["_id"];
                this.setState({userid: userid});
                console.log(this.state.userid);
            }
        })
    }

    handleFinish = () => {
        this.setState({status: true});
    }

    mapLayout = () => {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>
                        <Row>
                            <Col md={10}>
                                Location Map
                            </Col>
                            <Col md={2}>
                                <Button variant="primary" onClick={this.handleFinish}>Finish Order</Button>
                            </Col>
                        </Row>
                    </Card.Title>
                    <div id="main">
                        <FloorPlan isAdmin={false} />
                    </div>
                </Card.Body>
            </Card>
        )
    }

    handleAccept = () => {
        this.setState({status: false});
    }

    orderLayout = () => {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>
                        <Row>
                            <Col md={10}>
                                Currently Assigned Orders
                            </Col>
                            <Col md={2}>
                                <Button variant="primary" onClick={this.handleAccept}>Accept Order</Button>
                            </Col>
                        </Row>
                    </Card.Title>
                </Card.Body>
            </Card>
        )
    }

    render() {
        return (
            <Container>
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="/home">Walmart</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#order">Order</Nav.Link>
                    </Nav>
                </Navbar>
                {this.state.status && this.orderLayout()}
                {!this.state.status && this.mapLayout()}
            </Container>
        )
    }
}

export default AssociatePage;