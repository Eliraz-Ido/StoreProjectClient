import React from "react";
import {Link} from "react-router-dom";
import Cookies from "universal-cookie/es6";
import axios from "axios";

const serverPath = "http://localhost:8989";
const emptyArray = 0;

class ShopsPage extends React.Component {
    state = {
        shops: []
    }

    componentWillMount() {
        this.getShops()
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
                        shops: response.data
                    })
                }
            })
    }

    render() {
        return(
            <div>
                <header>Shops page</header>
            <div>
                <div className={"centerText"}>
                    {
                        this.state.shops.length === emptyArray ?
                            <div>There are no shops</div>
                            :
                            this.state.shops.map(shop => {
                                return (
                                    <div>
                                        <Link to={"shops/" + shop.id}>
                                            {shop.shopName}
                                        </Link>
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
            </div>
        )
    }
}
export default ShopsPage;