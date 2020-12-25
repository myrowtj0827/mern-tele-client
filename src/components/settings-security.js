import React, { Component } from 'react';
import { resetPassword } from "../redux/actions/register/client-register";
import SettingsHeader from "./settings-header";
import '../assets/css/settings.css';
import {connect} from "react-redux";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class SettingsSecurity extends Component {
    constructor() {
        super();

        this.state = {
            current_psw: '',
            new_psw: '',
            confirm_psw: '',
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_reset && prevProps.msg_reset !== this.props.msg_reset) {
            toast(this.props.msg_reset);
            console.log(this.props.msg_reset);
        }
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value || ''});
    };

    update = () => {
        const {
            resetPassword
        } = this.props;

        const data = {
            id: localStorage.client_id,
            password: this.state.current_psw,
            new_password: this.state.new_psw,
            confirm_password: this.state.confirm_psw,
            flag: 'profile',
            role: 'client',
        };
        resetPassword(data, this.props.history);
    };

    render() {

        return (
            <>
                <div className="setting-body-p">
                    <SettingsHeader/>
                    <div className="change-password-position">
                        <div>
                            <ToastContainer />
                        </div>
                        <div className="card-common txt-16 txt-medium">
                            <div className="pt-30 col-darkBlue">Change Password</div>
                            <div className="pt-20 col-heavyDark">Current Password</div>
                            <input
                                type="text"
                                id={"current_psw"}
                                placeholder="********************"
                                value={this.state.current_psw}
                                onChange={this.onChange}
                                maxLength={8}
                                required
                            />

                            <div className="pt-20 col-heavyDark">New Password</div>
                            <input
                                type="password"
                                id={"new_psw"}
                                placeholder="********************"
                                value={this.state.new_psw}
                                onChange={this.onChange}
                                maxLength={8}
                                required
                            />

                            <div className="pt-20 col-heavyDark">Confirm</div>
                            <input
                                type="password"
                                id={"confirm_psw"}
                                placeholder="********************"
                                value={this.state.confirm_psw}
                                onChange={this.onChange}
                                maxLength={8}
                                required
                            />
                            <div className="change-btn-p btn-common col-white align-center mouse-cursor" onClick={this.update}>Update</div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        msg_reset: state.registers.msg_reset,
    }
};

export default connect(
    mapStateToProps,
    { resetPassword }
)(SettingsSecurity);