import React from "react";
import Cookies from "universal-cookie/lib";
import axios from "axios";
import SaleComponent from "../Component/SaleComponent";

const serverPath = "http://localhost:8989";
const emptyArray = 0;

class SearchPage extends  React.Component{
    state = {
        sales: [],
        searchFilter: ""
    }

    componentDidMount() {
        this.getSales()
    }

    getSales = () => {
        const cookies = new Cookies();
        axios.get(serverPath + "/get-all-sales-for-user", {
            params: {
                token: cookies.get("myWebsiteToken")
            }
        })
            .then((response) => {
                if(response.data) {
                    this.setState({
                        sales: response.data
                    })
                }
            })
    }

    change = (e) => {
        this.setState({
            searchFilter: e.target.value
        })
    }

    render() {
        const filteredSales = this.state.sales.filter((object) => {
            return (object.sale.description.toLowerCase().includes(this.state.searchFilter.toLowerCase()) ||
                object.sale.shop.shopName.toLowerCase().includes(this.state.searchFilter.toLowerCase()));
        });
        return (
            <div>
                <header>All Sales</header>
                <input id={"searchBox"} placeholder={"Search"} onChange={this.change} value={this.state.searchFilter}/>
                <div className={"SalesContainer"}>
                    {
                        filteredSales.length === emptyArray ?
                            <div>There are no matches:(</div>
                            :
                            filteredSales.map((object) => {
                                return (
                                    <div>
                                        <SaleComponent
                                            style={{background: object.isRelevantToUser ? "white" : "black"}}
                                            sale={object.sale}/>
                                    </div>
                                );
                            })
                    }
                </div>
            </div>
        )
    }
}
export default SearchPage;