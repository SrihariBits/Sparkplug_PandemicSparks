import React, {Component} from "react";
import {Navbar, 
        Container, 
        Nav,
        Card,
        Accordion,
        Button,
        FormControl,
        FormLabel,
        Row,
        Col
    } from "react-bootstrap";
import {withRouter} from "react-router-dom";
import axios from "axios";

class CustomerPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            cart: true,
            order: false,
            currentOrder: {
                "itemset": [],
                "customerID": localStorage.getItem("username"),
            }
        };
        this.textInput = React.createRef();
    }

    componentWillMount() {
        axios.get('http://127.0.0.1:5000/products/product')
        .then(res=> {
            const productList = res.data;
            this.setState({productList: productList});
            console.log(this.state.productList);
        })
    }

    onChange = (event) => {
        const value = event.target.value;
        localStorage.setItem("quantity", value);
    }

    handleClick = (event) => {
        let currentOrder = this.state.currentOrder;
        currentOrder["itemset"]
            .push({"product": this.state.productList[event.target.value]["_id"],
                   "count": localStorage.getItem("quantity")});
        console.log(currentOrder);
    }

    handleFinish = () => {
        let finalOrder = this.state.currentOrder;
        axios.post('http://127.0.0.1:5000/products/order', finalOrder)
            .then(res => {
                console.log(res.data);
            });
        this.setState({currentOrder: {
            "itemset": [],
            "customerID": localStorage.getItem("username"),
            }
        });
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
                            <br />
                            <FormLabel>Quantity</FormLabel>
                            <FormControl ref={this.textInput} type="text" onChange={this.onChange} />
                            <br />
                            <Button variant="primary" value={i} onClick={this.handleClick}>Add</Button>
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
                    <Card.Title>
                        <Row>
                            <Col md={11}>
                                Place Order
                            </Col>
                            <Col md={1}>
                                <Button variant="primary" onClick={this.handleFinish}>Finish</Button>
                            </Col>
                        </Row>
                    </Card.Title>
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