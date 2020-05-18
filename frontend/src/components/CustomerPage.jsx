import React, {Component} from "react";
import {Navbar, 
        Container, 
        Nav,
        Card,
        Accordion,
        Button
    } from "react-bootstrap";
import {withRouter} from "react-router-dom";
import axios from "axios";

class CustomerPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            cart: true,
            order: false
        };
    }

    componentWillMount() {
        axios.get('http://127.0.0.1:5000/products/product')
        .then(res=> {
            const productList = res.data;
            this.setState({productList: productList});
            console.log(this.state.productList);
        })
    }

    productListLayout = () => {
        let productList = []
        for(let i=0; i<this.state.productList.length; i++){
            productList.push(
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="primary" eventKey={i}>
                            {this.state.productList[i]["description"]}
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={i}>
                        <Card.Body>
                            Product ID: {this.state.productList[i]["_id"]}
                            <br />
                            Product Description: {this.state.productList[i]["description"]}
                            <br />
                            Price: {this.state.productList[i]["unitPrice"] + ' ' + this.state.productList[i]["currencyUnit"]}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            )
        }
        return productList;
    }

    cartLayout = () => {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Your Cart</Card.Title>
                      
                    <Accordion>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="primary" eventKey={0}>
                                    French Fries
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={0}>
                                <Card.Body>Quantity: 3</Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="primary" eventKey={1}>
                                    Butter Garlic Fries
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={1}>
                                <Card.Body>Quantity: 2</Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Card.Body>
            </Card>
        )
    }

    orderLayout = () => {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Place Order</Card.Title>
                    <Accordion>
                        {this.productListLayout()}
                    </Accordion>
                </Card.Body>
            </Card>
        )
    }

    handleCart = () => {
        this.setState({cart: true, order: false});
    }

    handleOrder = () => {
        this.setState({cart: false, order: true});
    }

    render() {
        return (
            <Container>
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="#">Walmart</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#cart" onClick={() => this.handleCart()}>Cart</Nav.Link>
                        <Nav.Link href="#placeorder" onClick={() => this.handleOrder()}>Order</Nav.Link>
                    </Nav>
                </Navbar>
                {this.state.cart && this.cartLayout()}
                {this.state.order && this.state.productList && this.orderLayout()}
            </Container>    
        )
    }
}

export default withRouter(CustomerPage);