import React from "react";
import Cookies from "universal-cookie/lib";
import axios from "axios";
import SaleComponent from "../Component/SaleComponent";

const serverPath = "http://localhost:8989";
const emptyArray = 0;

class DashboardPage extends React.Component{
    state = {
        sales: []
    }

    componentDidMount() {
        this.getSales()
    }

    getSales = () => {
        const cookies = new Cookies();
        axios.get(serverPath + "/get-sales-for-user", {
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

    render() {
        return (
            <div>
            <header>My Sales</header>
            <div className={"SalesContainer"}>
                {
                    this.state.sales.length === emptyArray ?
                        <div>There are no sales for you:(</div>
                        :
                        this.state.sales.map((sale) => {
                            return(
                                <SaleComponent sale={sale}/>
                            );
                        })
                }
            </div>
            </div>
        );
    }

}
export default DashboardPage;