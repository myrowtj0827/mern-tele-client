import React from 'react';
import {Link} from "react-router-dom";
import {
    reset,
    login,
} from "../redux/actions/register/client-register";
import Config from "../config/index";

import '../assets/css/dashboard.css';
import { connect } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ClientLogin extends React.Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            email: '',
            password: '',
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_login && prevProps.msg_login !== this.props.msg_login) {
            toast(this.props.msg_login);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 4000);
        }
    }

    login = () => {
        const data = {
            role: 'client',
            email: this.state.email,
            password: this.state.password,
        };

        const {
            login
        } = this.props;

        if(login) {
            login(data, this.props.history);
        }
    };

    render() {
        return (
            <>
                <div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>
                <div className="admin-login-bg">
                    <ToastContainer />
                    <div className="login-body">
                        <div style={{paddingBottom: 20}}>
                            <a  href={Config.FRONT_URL + '/pricing/'}>
                                <img className="logo-img mouse-cursor" src={require('../assets/img/app-logo.svg')} alt=""/>
                            </a>
                        </div>
                        <div className="pb-20 txt-16 col-heavyDark align-center">
                            Login as client
                        </div>
                        <span>{this.state.warning_email}</span>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            onChange={(event) => this.setState({email: event.target.value})}
                            required
                        />

                        <span>{this.state.warning_psw}</span>
                        <input
                            id="password"
                            type="password"
                            placeholder="****"
                            onChange={(event) => this.setState({password: event.target.value})}
                            maxLength={8}
                            required
                        />

                        <div className="btn-common txt-16 col-white justify-center mouse-cursor" onClick={this.login}>
                            LOGIN
                        </div>

                        <Link to="/forgot-password">
                            <div className="txt-14 col-heavyDark align-center txt-forgot">Forgot password</div>
                        </Link>
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        msg_login: state.registers.msg_login,
        spinning: state.registers.spinning,
    }
};

export default connect(
    mapStateToProps,
    {
        reset,
        login,
    }
)(ClientLogin);
