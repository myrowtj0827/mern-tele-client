import React from 'react';
import {reset, resetPassword } from "../redux/actions/register/client-register";

import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Config from "../config";

class ClientResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            role: 'client',
            new_password: '',
            confirm_password: '',
            id: '',
        }
    }

    componentDidMount() {
        let path = window.location.href;
        let arrayLink = path.split('/');

        this.setState({
            id: arrayLink[arrayLink.length - 1],
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_reset_password && prevProps.msg_reset_password !== this.props.msg_reset_password) {
            toast(this.props.msg_reset_password);

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

    reset = () => {
        const {
            resetPassword
        } = this.props;

        if(resetPassword) {
            resetPassword(this.state, this.props.history);
        }
    };

    back = () => {
        this.props.history.push('/forgot-password');
    };

    render() {
        return (
            <>
                <div>
                    <ToastContainer/>
                </div>

                <div className="admin-login-bg">
                        <div className="login-body">
                            <div className="pb-20">
                                <a  href={Config.FRONT_URL + '/pricing/'}>
                                    <img className="logo-img mouse-cursor" src={require('../assets/img/app-logo.svg')} alt=""/>
                                </a>
                            </div>

                            <input
                                type="password"
                                placeholder="Password"
                                onChange={(event) => this.setState({new_password: event.target.value})}
                                maxLength={8}
                                required
                            />

                            <input
                                type="password"
                                placeholder="Confirm Password"
                                onChange={(event) => this.setState({confirm_password: event.target.value})}
                                maxLength={8}
                                required
                            />

                            <div className="flex-space">
                                <div className="btn-common forgot txt-16 col-white justify-center mouse-cursor" onClick={this.back}>
                                    BACK
                                </div>
                                <div className="btn-common forgot txt-16 col-white justify-center mouse-cursor" onClick={this.reset}>
                                    CHANGE
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
        msg_reset_password: state.registers.msg_reset_password,
    }
};

export default connect(
    mapStateToProps,
    {reset, resetPassword,}
)(ClientResetPassword);
