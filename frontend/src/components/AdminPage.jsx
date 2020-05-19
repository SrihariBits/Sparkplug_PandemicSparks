import React, {Component} from "react";
import {Container,
        Navbar,
        Nav,
        Card,
        Button,
        Row,
        Col,
        Accordion,
    } from "react-bootstrap";
import axios from "axios";
import FloorPlan from "./FloorPlan";


class AdminPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            customer: true,
            associate: false,
            map: false,
        };
    }

    componentWillMount() {
        axios.get('http://127.0.0.1:5000/user/customer')
        .then(res => {
            const customerList = res.data;
            this.setState({customerList: customerList});
            console.log(this.state.customerList);
        })

        axios.get('http://127.0.0.1:5000/user/associate')
        .then(res => {
            const associateList = res.data;
            this.setState({associateList: associateList});
            console.log(this.state.associateList);
        })

    }

    customerListLayout = () => {
        let customerList = [];
        for(let i=0; i<this.state.customerList.length; i++){
            customerList.push(
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="primary" eventKey={i}>
                            {this.state.customerList[i]["first_name"] + ' ' + this.state.customerList[i]["last_name"]}
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={i}>
                        <Card.Body>
                            Username: {this.state.customerList[i]["username"]}
                            <br />
                            First Name: {this.state.customerList[i]["first_name"]}
                            <br />
                            Last Name: {this.state.customerList[i]["last_name"]}
                            <br />
                            Shipping Address: {this.state.customerList[i]["shipping_address"]}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            )
        }
        return customerList;
    }

    associateListLayout = () => {
        let associateList = [];
        for(let i=0; i<this.state.associateList.length; i++){
            associateList.push(
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="primary" eventKey={i}>
                            {this.state.associateList[i]["first_name"] + ' ' + this.state.associateList[i]["last_name"]}
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={i}>
                        <Card.Body>
                            Username: {this.state.associateList[i]["username"]}
                            <br />
                            First Name: {this.state.associateList[i]["first_name"]}
                            <br />
                            Last Name: {this.state.associateList[i]["last_name"]}
                            <br />
                            Location: {this.state.associateList[i]["location"]}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            )
        }
        return associateList;
    }

    handleCustomer = () => {
        this.setState({customer: true, associate: false, map:false});
    }

    handleAssociate = () => {
        this.setState({customer: false, associate: true, map:false});
    }

    customerLayout = () => {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>
                        <Row>
                            <Col md={12}>
                                List of Customers
                            </Col>
                        </Row>
                    </Card.Title>
                    <Accordion>
                        {this.customerListLayout()}
                    </Accordion>
                </Card.Body>
            </Card>
        )
    }

    associateLayout = () => {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>
                        <Row>
                            <Col md={12}>
                                List of Associates
                            </Col>
                        </Row>
                    </Card.Title>
                    <Accordion>
                        {this.associateListLayout()}
                    </Accordion>
                </Card.Body>
            </Card>
        )
    }

    handleMap = () => {
        this.setState({map: true, customer: false, associate: false})
    }

    handleMapLayout = () => {
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

    render() {
        return (
            <Container>
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="/home">Walmart</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#customer" onClick={this.handleCustomer}>Customers</Nav.Link>
                        <Nav.Link href="#associate" onClick={this.handleAssociate}>Associates</Nav.Link>
                        <Nav.Link href="#map" onClick={this.handleMap}>Map</Nav.Link>
                    </Nav>
                </Navbar>
                {this.state.customer && this.state.customerList && this.customerLayout()}
                {this.state.associate && this.state.associateList && this.associateLayout()}
                {this.state.map && this.handleMapLayout()}
            </Container>
        )
    }
}

export default AdminPage;