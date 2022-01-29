import './App.css';
import React from "react";
import {BrowserRouter} from "react-router-dom";
import {Redirect, Route} from "react-router";
import Cookies from "universal-cookie/lib";

import NavigationBar from "./NavigationBar";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";
import SettingsPage from "./Pages/SettingsPage";
import ShopComponent from "./Component/ShopComponent";
import ShopsPage from "./Pages/ShopsPage";
import SearchPage from "./Pages/SearchPage";
import axios from "axios";
import {IoIosNotificationsOutline} from "react-icons/io";
import AddSalePage from "./Pages/AddSalePage";

const serverPath = "localhost:8989";
const emptyArray = 0;
const closeNotificationTime = 4000;
const iconSize = "40px"


class App extends React.Component {
    cookies = new Cookies();
    ws  = new WebSocket("ws://"+serverPath+"/stream?token=" + this.cookies.get("myWebsiteToken"))

    state = {
        isLoggedIn: false,
        token : "",
        needsToInitializeSettings: false,
        notifications: []
    }

    componentWillMount() {
        const cookies = new Cookies();
        if (cookies.get("myWebsiteToken")) {
            this.setState({
                isLoggedIn: true,
            })
        }
    }

    componentDidMount() {
        this.ws.onmessage = (message) => {
            let notifications = this.state.notifications;
            if(!notifications.includes(JSON.parse(message.data).notification)) {
                notifications.unshift((JSON.parse(message.data).notification));
                this.showNotifications();
                setTimeout(()=> this.showNotifications(), closeNotificationTime)
            }
            this.setState({
                notifications: notifications
            })
        }
    }


    addToken = (token) => {
        const cookies = new Cookies();
        cookies.set("myWebsiteToken", token);
        this.checkIfSettingsNeedToBeInitialized()
        if (cookies.get("myWebsiteToken")) {
            this.setState({
                isLoggedIn: true
            })
        }

    }

    removeToken = () => {
        const cookies = new Cookies();
        cookies.remove("myWebsiteToken");
        this.setState({
            isLoggedIn: false
        })
    }

    checkIfSettingsNeedToBeInitialized = () => {
        const cookies = new Cookies();
        axios.get("http://"+serverPath+"/get-organizations-for-one-user", {
            params: {
                token: cookies.get("myWebsiteToken")
            }
        })
            .then((response) => {
                const organizations = response.data
                const user_organizations = organizations.filter((item) => { return(item.isAMember)})
                if(user_organizations.length === emptyArray) {
                    this.setState({
                        needsToInitializeSettings: true
                    })
                }
                else{
                    this.setState({
                        needsToInitializeSettings: false
                    })
                }

            })
    }

    showNotifications = () => {
        document.getElementById("notificationDropdown").classList.toggle("show");
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    {
                        this.state.isLoggedIn ?
                            <div className={"PageContainer"}>
                                <NavigationBar removeTokenFromApp={this.removeToken}/>

                                <div className={"notificationContainer"} onClick={this.showNotifications}>
                                    <IoIosNotificationsOutline size={iconSize}/>
                                    <span id={"numberOfNotifications"}>{this.state.notifications.length}</span>
                                    <div id={"notificationDropdown"} className={"dropdown-content"}>
                                        {
                                            this.state.notifications.map(notification => {
                                                return(
                                                    <div className={"notification"}>
                                                        {notification}
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>

                                {
                                    this.state.needsToInitializeSettings ?
                                        <Redirect to={"/settings"}/>
                                        : <Redirect to={"/"}/>
                                }
                                <Route path={"/"} component={DashboardPage} exact={true}/>
                                <Route path={"/dashboard"} component={DashboardPage} exact={true}/>
                                <Route path={"/search"} component={SearchPage} exact={true}/>
                                <Route path={"/shops"} component={ShopsPage} exact={true}/>
                                <Route path={"/shops/:shopId"} component={ShopComponent} exact={true}/>
                                <Route path={"/settings"} component={SettingsPage} exact={true}/>
                                <Route path={"/addSale"} component={AddSalePage} exact={true}/>
                            </div>
                            :
                            <div className={"PageContainer"}>
                                <Redirect to={"/"}/>
                                <Route path={"/"} render={() => <LoginPage addTokenToApp={this.addToken}/>}
                                       exact={true}/>
                            </div>
                    }
                </BrowserRouter>
            </div>
        );
    }

}

export default App;
