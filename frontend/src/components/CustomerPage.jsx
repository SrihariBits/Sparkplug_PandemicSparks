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

        axios.get('http://127.0.0.1:5000/products/order/' + localStorage.getItem("username"))
        .then(res => {
            const cartList = res.data;
            this.setState({cartList: cartList})
            console.log(this.state.cartList);
        })

        axios.get('http://127.0.0.1:5000/user/customer/' + localStorage.getItem("username"))
        .then(res => {
            const userid = res.data["_id"];
            this.setState({userid: userid});
            console.log(this.state.userid);
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
                   "productName": this.state.productList[event.target.value]["description"],
                   "count": localStorage.getItem("quantity")});
        console.log(currentOrder);
    }

    handleFinish = () => {
        let finalOrder = this.state.currentOrder;
        finalOrder["customerID"] = this.state.userid;
        axios.post('http://127.0.0.1:5000/products/order', finalOrder)
            .then(res => {
                console.log(res.data);
            });

        this.setState({currentOrder: {
            "itemset": [],
            "customerID": this.state.userid,
            }
        });
        
        axios.get('http://127.0.0.1:5000/products/order/' + localStorage.getItem("username"))
        .then(res => {
            const cartList = res.data;
            this.setState({cartList: cartList})
            console.log(this.state.cartList);
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
                            Product ID: {this.state.productList[i]["productID"]}
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

    individualProduct = (i) => {
        let product = []
        for(let j=0; j<this.state.cartList[i].itemset.length; j++){
            product.push(
                <b>
                    Product: {this.state.cartList[i].itemset[j].productName}
                    <br />
                    Quantity: {this.state.cartList[i].itemset[j].count}
                    <br />
                    <br />
                </b>
            )
        }
        return product;
    }

    cartListLayout = () => {
        let cartList = []
        for(let i=0; i<this.state.cartList.length; i++){
            cartList.push(
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="primary" eventKey={i}>
                            {"Order " + String(i)}
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={i}>
                        <Card.Body>
                            {this.individualProduct(i)}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            )
        }
        return cartList;
    }

    cartLayout = () => {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Your Cart</Card.Title>
                    <Accordion>
                        {this.cartListLayout()}
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
                {this.state.cart && this.state.cartList && this.cartLayout()}
                {this.state.order && this.state.productList && this.orderLayout()}
            </Container>    
        )
    }
}

export default withRouter(CustomerPage);