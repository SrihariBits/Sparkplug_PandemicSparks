import React from 'react';  
import './Popup.css';  

class Popup extends React.Component {  
  render() {  
        return (  
            <div className='popup'>  
                <div className='popup_inner'>
                    <p id="containerTitle">Items</p>
                    {this.props.products.map((product, index) => <p id="product" key={index}>{product.productId}</p> )}  
                    <button onClick={this.props.closePopup}>close</button>  
                </div>  
            </div>  
        );  
    }  
}  

export default Popup;
