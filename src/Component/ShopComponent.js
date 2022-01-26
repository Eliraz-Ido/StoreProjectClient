import React from "react";
import Cookies from "universal-cookie/es6";
import axios from "axios";
import SaleComponent from "./SaleComponent";

const serverPath = "http://localhost:8989";
const emptyArray = 0;
class ShopComponent extends React.Component{
    state = {
        shopId: "",
        shopName: "",
        sales: []
    }
    correctId = this.props.match.params.shopId - 1;

    componentWillMount() {
        this.setState({
            shopId: this.props.match.params.shopId
        })
        const cookies = new Cookies();
        axios.get(serverPath + "/get-sales-for-one-shop", {
            params: {
                token: cookies.get("myWebsiteToken"),
                shopId: this.props.match.params.shopId
            }
        })
            .then((response) => {
                if (response.data) {
                    this.setState({
                        sales: response.data
                    })
                }
            })
        this.getShops();

    }

    getShops = () => {
        const cookies = new Cookies();
        axios.get(serverPath + "/get-all-shops", {
            params: {
                token: cookies.get("myWebsiteToken")
            }
        })
            .then((response) => {
                if(response.data){
                    this.setState({
                        shopName: response.data[this.correctId].shopName
                    })
                }
            })
    }


    render() {
        return (
            <div>
                <header>Sales For {this.state.shopName} Shop</header>

                <div className={"SalesContainer"}>
                {
                    this.state.sales.length === emptyArray ?
                        <div>There are no sales to this shop</div>
                        :
                    this.state.sales.map((sale) => {
                        return <SaleComponent sale={sale}/>
                    })
                }
            </div>
            </div>
        )
    }
}

export default ShopComponent;