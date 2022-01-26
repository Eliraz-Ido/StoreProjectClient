import '../App.css';
import React from "react";
import axios from "axios"
let enterCode = 13;

const serverPath = "http://localhost:8989";
const blue = "#083154";

class LoginPage extends React.Component {
    state = {
        isLoginMode: true,
        username: "",
        password: "",
        errorMessage: "",
        usernameIsTaken: false,
        message: ""
    }

    componentDidMount() {
        document.getElementById("username").focus();
        document.getElementById("loginButton").style.background = blue;
        document.getElementById("signupButton").style.background = "transparent";
        document.getElementById("inputAndButtonsContainer").style.borderRadius = "10px 10px 10px 0";
    }

    focusNext = (event) => {
        if(event.keyCode === enterCode && event.target.id === "username"){
            document.getElementById("password").focus()
        }
        if(event.keyCode === enterCode && event.target.id === "password"){
            if(this.state.isLoginMode){
                this.login()
            }
            else {
                this.createAccount()
            }
        }
    }


    change = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            errorMessage: "",
            message: ""
        })
    }

    changeMode = (event) => {
        if (this.state.isLoginMode) {
            if (event.target.id === "loginButton")
                this.login()
            if (event.target.id === "signupButton") {
                this.setState({
                    isLoginMode: false
                })
                document.getElementById("signupButton").style.background = blue;
                document.getElementById("loginButton").style.background = "transparent";
                document.getElementById("inputAndButtonsContainer").style.borderRadius = "10px 10px 0 10px";

            }
        } else {
            if (event.target.id === "loginButton") {
                this.setState({
                    isLoginMode: true
                })
                document.getElementById("loginButton").style.background = blue;
                document.getElementById("signupButton").style.background = "transparent";
                document.getElementById("inputAndButtonsContainer").style.borderRadius = "10px 10px 10px 0";
            }
            if (event.target.id === "signupButton")
                this.createAccount()
        }
    }

    cleanPage = () => {
        document.getElementById("username").focus();
        this.setState({
            username: "",
            password: "",
            errorMessage: "",
            usernameIsTaken: false,
            message: "",
        })
    }


    login = () => {
        axios.get(serverPath + "/sign-in", {
            params: {
                username: this.state.username,
                password: this.state.password
            }
        })
            .then((response) => {
                if (response.data) {                                       //Sign In was successful
                    this.props.addTokenToApp(response.data)
                } else {
                    axios.get(serverPath + "/is-username-taken", {
                        params: {
                            username: this.state.username
                        }
                    })
                        .then((response) => {
                            if (response.data) {             //Could not sigh in because of wrong password
                                this.setState({
                                    errorMessage: "Wrong Password",
                                    password: "",
                                })
                                document.getElementById("password").focus();

                            } else {
                                this.setState({    //Could not sigh in because user does not exist
                                    username: "",
                                    password: "",
                                    errorMessage: "That Username Does Not Exists! Try Again Or Click The Sign Up Button",
                                })
                                document.getElementById("username").focus();
                                setTimeout(() => this.cleanPage(), 4000)
                            }
                        })
                }
            })
    }


    createAccount = () => {
        axios.get(serverPath + "/is-username-taken", {
            params: {
                username: this.state.username
            }
        })
            .then((response) => {
                if (response.data) {
                    this.setState({
                        username: "",
                        password: "",
                        usernameIsTaken: true,
                        validPassword: true,
                        errorMessage: "This user is Taken! Please try another one"
                    })
                    document.getElementById("username").focus();
                }
            })


        if (this.state.username && this.state.password && !this.state.usernameIsTaken) {
            let data = new FormData();
            data.append("username", this.state.username);
            data.append("password", this.state.password);
            axios.post(serverPath + "/create-account", data)
                .then((response) => {
                    if (response.data) {
                        this.setState({
                            username: "",
                            password: "",
                            usernameIsTaken: false,
                            message: "Created Account successfully:) Now Login!"
                        })

                    }
                })
        }
    }

    render() {
        return (
            <div>
                <div id={"inputAndButtonsContainer"}>
                    <input id={"username"}
                           placeholder={"Enter Username"}
                           onChange={this.change}
                           value={this.state.username}
                           onKeyDown={this.focusNext}/><br/>
                    <input id={"password"}
                           type={"password"}
                           placeholder={"Enter Password"}
                           onChange={this.change}
                           value={this.state.password}
                           onKeyDown={this.focusNext}/><br/>
                </div>
                <button
                    className={"Mode"}
                    id={"loginButton"}
                    onClick={this.changeMode}> Login </button>
                <button
                    className={"Mode"}
                    id={"signupButton"}
                    onClick={this.changeMode} > Signup </button>
                <br/><br/>
                <div id={"message"} >{this.state.message}</div>
                {
                    this.state.errorMessage !== "" && <div className={"errorMessage"}>{this.state.errorMessage}</div>
                }

            </div>
        );
    }

}

export default LoginPage;