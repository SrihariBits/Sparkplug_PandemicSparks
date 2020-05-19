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

class AdminPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            customer: true,
            associate: false,
        };
    }

    handleCustomer = () => {
        this.setState({customer: true, associate: false});
    }

    handleAssociate = () => {
        this.setState({customer: false, associate: true});
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
                    </Nav>
                </Navbar>
                {this.state.customer && this.customerLayout()}
                {this.state.associate && this.associateLayout()}
            </Container>
        )
    }
}

export default AdminPage;