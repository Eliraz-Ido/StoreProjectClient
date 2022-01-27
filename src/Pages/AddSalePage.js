import React from "react";
import Cookies from "universal-cookie/lib";
import axios from "axios";

const serverPath = "http://localhost:8989";
const emptyArray = 0;
const idPosition = 1;
class AddSalePage extends  React.Component{
    state = {
        organizations: [],
        selectedOrg: [],
        shops: [],
        selectedShop: "",
        isRelevantToAll: false,
        description: "",
        startDate: "",
        endDate: "",
    }

    componentDidMount() {
        this.getOrganizations();
        this.getShops();
    }

    getOrganizations = () => {
        const cookies = new Cookies();
        axios.get(serverPath + "/get-all-organizations", {
            params: {
                token: cookies.get("myWebsiteToken")
            }
        })
            .then((response) => {
                if(response.data) {
                    this.setState({
                        organizations: response.data
                    })
                }
            })
    }

    getShops = () => {
        const cookies = new Cookies();
        axios.get(serverPath + "/get-all-shops", {
            params: {
                token: cookies.get("myWebsiteToken")
            }
        })
            .then((response) => {
                if(response.data) {
                    this.setState({
                        shops: response.data
                    })
                }
            })
    }

    change = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    changeOrganizationStatus = (event) => {
        if(!event.target.checked) {
            let newOrganizations = this.state.selectedOrg.filter((id) => {
                return(id !== event.target.id)
            });
            this.setState({
                selectedOrg: newOrganizations
            })
        }
        else {
            let organizations = this.state.selectedOrg;
            organizations.push(event.target.id);
            this.setState({
                selectedOrg: organizations
            })
        }
    }

    selectShop = (event) => {
        this.setState({
            selectedShop: event.target.id
        })
    }

    changeRelevantToAll = () => {
        let relevant = this.state.isRelevantToAll;
        this.setState({
            isRelevantToAll: !relevant
        })
    }

    addSale = () => {
        const cookies = new Cookies();
        let data = new FormData();
        data.append("token", cookies.get("myWebsiteToken"));
        data.append("orgIds", this.state.selectedOrg)
        data.append("shopId", this.state.selectedShop)
        data.append("description", this.state.description)
        data.append("startDate", this.state.startDate)
        data.append("endDate", this.state.endDate)
        data.append("isRelevantToAll", this.state.isRelevantToAll)
        axios.post(serverPath + "/add-sale", data)
            .then((response) => {
                this.setState({
                    selectedOrg: [],
                    selectedShop: "",
                    isRelevantToAll: false,
                    description: "",
                    startDate: "",
                    endDate: "",
                })
            })
    }

    render() {
        return (
            <div >
                <header>Add Sale Page</header><br/>
                <input type={"button"}
                       disabled={
                           this.state.startDate === "" ||
                           this.state.endDate === "" ||
                           this.state.description === "" ||
                           this.state.selectedShop === "" ||
                           (!this.state.isRelevantToAll &&
                           this.state.selectedOrg.length === emptyArray)
                       }
                       value={"Add Sale"}
                       onClick={this.addSale}/>
                <div id={"addSalePage"}>
                <form >
                    <label>Select Organizations:</label><br/>
                    {
                        this.state.organizations.map((org) => {
                            return(
                                <p>
                                    <input id={org.id}
                                           type={"checkbox"}
                                           checked={this.state.selectedOrg.includes(org.id.toString())}
                                           onChange={this.changeOrganizationStatus}/>
                                    <label>{org.organizationName}</label><br/>
                                </p>
                            );
                        })
                    }
                    <br/>
                    <input type={"checkbox"}
                           checked={this.state.isRelevantToAll}
                           onChange={this.changeRelevantToAll}/>
                    <label>Is Relevant To All</label><br/>
                </form>

                    <form>
                        <label>Select One Shop</label>

                        {
                        this.state.shops.map((shop) => {
                            return(
                                <p>
                                    <input id={shop.id}
                                           name={"shop"}
                                           type={"radio"}
                                           checked={this.state.selectedShop === shop.id.toString()}
                                           onChange={this.selectShop}/>
                                    <label >{shop.shopName}</label><br/>
                                </p>
                            );
                        })
                    }
                    </form>
                <form>
                    <label>Sale description:</label><br/>
                    <textarea id={"description"} value={this.state.description} onChange={this.change}/><br/>
                    <label>Start Date: </label>
                    <input id={"startDate"} type={"datetime-local"} value={this.state.startDate} onChange={this.change}/><br/>
                    <label>End Date: </label>
                    <input id={"endDate"} type={"datetime-local"} value={this.state.endDate} onChange={this.change}/>
                </form>
                </div>
            </div>
        )
    }
}
export default AddSalePage;