import React, {Component} from "react";
import {Container,
        Navbar,
        Nav
    } from "react-bootstrap";
import axios from "axios";
import {withRouter} from "react-router-dom";

class AssociatePage extends Component{
    constructor(props) {
        super(props);
        this.state = {};
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

    handleOrder = () => {

    }

    render() {
        return (
            <Container>
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="/home">Walmart</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#order" onClick={this.handleOrder}>Order</Nav.Link>
                    </Nav>
                </Navbar>
            </Container>
        )
    }
}

export default AssociatePage;