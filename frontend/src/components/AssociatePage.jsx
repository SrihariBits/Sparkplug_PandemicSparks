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
            order: true,
            map: false,
        };
    }

    componentWillMount() {
        axios.get('http://127.0.0.1:5000/user/associate/' + localStorage.getItem("username"))
        .then(res => {
            if(res.data == null) {
                console.log("Wrong username for associate");
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
                                <Button variant="primary" onClick={this.handleFinish} disabled={this.state.status}>Finish Order</Button>
                            </Col>
                        </Row>
                    </Card.Title>
                    <div id="main">
                        <FloorPlan isAdmin={false} username={localStorage.getItem("username")} />
                    </div>
                </Card.Body>
            </Card>
        )
    }

    handleAccept = () => {
        axios.post('http://127.0.0.1:5000/associatefree', {'username': localStorage.getItem("username")})
        .then(res => {
            console.log(res);
        })
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
                                <Button variant="primary" onClick={this.handleAccept} disabled={!this.state.status}>Accept Order</Button>
                            </Col>
                        </Row>
                    </Card.Title>
                </Card.Body>
            </Card>
        )
    }

    handleMap = () => {
        this.setState({map: true, order: false});
    }

    handleOrder = () => {
        this.setState({map: false, order: true});
    }

    render() {
        return (
            <Container fluid>
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="/home">Walmart</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#order" onClick={this.handleOrder}>Order</Nav.Link>
                        <Nav.Link href="#map" onClick={this.handleMap}>Map</Nav.Link>
                    </Nav>
                </Navbar>
                {this.state.order && this.orderLayout()}
                {this.state.map && this.mapLayout()}
            </Container>
        )
    }
}

export default AssociatePage;