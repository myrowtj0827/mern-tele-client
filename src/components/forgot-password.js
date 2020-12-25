import React from 'react';
import {
    reset,
    forgot,
} from "../redux/actions/register/client-register";

import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Config from "../config";

class ClientForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            email: '',
            msg: '',
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_forgot_password && prevProps.msg_forgot_password !== this.props.msg_forgot_password) {
            toast(this.props.msg_forgot_password);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 3000);
        }
    };

    send = () => {
        const {
            forgot
        } = this.props;

        const data = {
            email: this.state.email,
            role: 'client',
        };
        forgot(data);
    };

    back = () => {
        this.props.history.push('/client-login');
    };

    render() {
        return (
            <>
                <div>
                    <ToastContainer/>
                </div>

                <div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>
                <div className="admin-login-bg">
                    <div className="login-body">
                        <div className="pb-20">
                            <a  href={Config.FRONT_URL + '/pricing/'}>
                                <img className="logo-img mouse-cursor" src={require('../assets/img/app-logo.svg')} alt=""/>
                            </a>
                        </div>
                        <div className="pt-10 pb-20 justify-center col-darkBlue">{this.state.msg}</div>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            onChange={(event) => this.setState({email: event.target.value})}
                            required
                        />

                        <div className="flex-space">
                            <div className="btn-common forgot txt-16 col-white justify-center mouse-cursor" onClick={this.back}>
                                BACK
                            </div>
                            <div className="btn-common forgot txt-16 col-white justify-center mouse-cursor" onClick={this.send}>
                                SEND
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        spinning: state.registers.spinning,
        msg_forgot_password: state.registers.msg_forgot_password,
    }
};

export default connect(
    mapStateToProps,
    {
        reset,
        forgot,
    }
)(ClientForgotPassword);
