import React from "react";
import axios from "axios";
import Cookies from "universal-cookie/lib";

const serverPath = "http://localhost:8989";
const emptyArray = 0;

class SettingsPage extends React.Component{
    state = {
        organizations: []
    }

    componentWillMount() {
       this.getOrganizations()
    }

    getOrganizations = () => {
        const cookies = new Cookies();
        axios.get(serverPath + "/get-organizations-for-one-user", {
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

    changeOrganization = (e) => {
        if(e.target.checked){
            this.addOrganization(e.target.id)
        }
        else {
            this.removeOrganization(e.target.id)
        }
    }

    addOrganization = (id) => {
        const cookies = new Cookies();
        let data = new FormData();
        data.append("token", cookies.get("myWebsiteToken"));
        data.append("orgId", id)
        axios.post(serverPath + "/add-member-to-organization", data)
            .then(() => {
                this.getOrganizations()
            })
    }

    removeOrganization = (id) => {
        const cookies = new Cookies();
        let data = new FormData();
        data.append("token", cookies.get("myWebsiteToken"));
        data.append("orgId", id)
        axios.post(serverPath + "/remove-member-from-organization", data)
            .then(() => {
                this.getOrganizations()
            })
    }

    render() {
        return(
            <div>
                <header>Settings Page</header>
                <div className={"centerText"}>
                {
                    this.state.organizations.length === emptyArray ?
                        <div>There is a problem with the server. Please try reload the page in a few minutes</div>
                        :
                        this.state.organizations.map((user) => {
                            return(
                                <p>
                                    <input id={user.organization.id} type={"checkbox"} checked={user.isAMember} onClick={this.changeOrganization}/>
                                    {user.organization.organizationName}
                                </p>
                            );
                        })
                }
                </div>
            </div>
        );
    }
}
export default SettingsPage;
