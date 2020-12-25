import React from 'react';
import {connect} from "react-redux";
import {
    reset,
    registers,
    getRequest,
} from "../redux/actions/register/client-register";
import '../assets/css/dashboard.css';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Config from "../config";

class RegisterClient extends React.Component {
    constructor(props) {
        super(props);
        this.tmr = null;
        this.state = {
            requestId: '',
            client_name: '',
            client_email: '',
            client_password: '',
            client_confirm_password: '',

            warning_name: '',
            warning_email: '',
            warning_psw: '',
            warning_confirm_psw: '',
            warning_accept: '',

            accept_state: false,

            arrayRequestList: '',
            requestInfos: '',
            loading: false,
        }
    }

    componentDidMount() {
        const {
            getRequest
        } = this.props;

        if (getRequest) {
            const data = {
                id: this.props.match.params.id
            };
            getRequest(data);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.requestInfo !== this.props.requestInfo) {
            this.setState({
                requestInfos: this.props.requestInfo,
            });
        }

        if(this.props.msg_register && prevProps.msg_register !== this.props.msg_register) {
            toast(this.props.msg_register);
            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 4000);
        }

    };

    acceptChange = () => {
        this.setState({accept_state: !this.state.accept_state});
    };

    register = () => {
        let nFlag = false;
        const {
            registers,
        } = this.props;

        if (nFlag === false) {
            const data = {
                name: this.state.requestInfos[0].client_name,
                email: this.state.requestInfos[0].client_email,
                password: this.state.client_password,
                confirm_password: this.state.client_confirm_password,
                request_id: this.state.requestInfos[0]._id,
                provider_id: this.state.requestInfos[0].provider_id,
                accept_state: this.state.accept_state,
                role: 'client',
            };

            registers(data, this.props.history);
        }
    };

    render() {
        if (this.state.requestInfos.length > 0) {
            return (
                <>
                    {/*<div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>*/}
                    {/*    <div className="lds-dual-ring"/>*/}
                    {/*</div>*/}
                    <div>
                        <ToastContainer/>
                    </div>

                    <div className="admin-login-bg">
                        <div className="register-body">
                            <div style={{paddingBottom: 20}}>
                                <a  href={Config.FRONT_URL + '/pricing/'}>
                                    <img className="logo-img mouse-cursor" src={require('../assets/img/app-logo.svg')} alt=""/>
                                </a>
                            </div>
                            <div className="pb-20 txt-16 col-heavyDark align-center">
                                You’re signing in TeleTherapist as a client by invitation.
                            </div>

                            <input
                                type="text"
                                value={this.state.requestInfos[0].client_name}
                                disabled={true}
                                required
                            />

                            <input
                                type="email"
                                value={this.state.requestInfos[0].client_email}
                                disabled={true}
                                required
                            />

                            <span>{this.state.warning_psw}</span>
                            <input
                                type="password"
                                placeholder="Password"
                                onChange={(event) => this.setState({client_password: event.target.value})}
                                maxLength={8}
                                required
                            />

                            <span>{this.state.warning_confirm_psw}</span>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                onChange={(event) => this.setState({client_confirm_password: event.target.value})}
                                maxLength={8}
                                required
                            />

                            <span>{this.state.warning_accept}</span>
                            <div className="pb-10">
                                <label className="container-event align-left">
                                    <span className="txt-16 col-darkBlue">
                                        <span className="col-part-bg">I accept the</span> Terms of Service
                                    </span>
                                    <input
                                        type="checkbox"
                                        defaultChecked={this.state.accept_state}
                                        onChange={this.acceptChange}
                                        required
                                    />
                                    <span className="checkMark"/>
                                </label>
                            </div>

                            <div className="btn-common txt-16 col-white justify-center mouse-cursor"
                                 onClick={this.register}>
                                REGISTER
                            </div>
                        </div>
                    </div>
                </>
            )
        } else {
            return 0;
        }
    }
}

const mapStateToProps = (state) => {
    return {
        requestInfo: state.registers.requestInfo,
        msg_register: state.registers.msg_register,
        spinning: state.registers.spinning,
    }
};

export default connect(
    mapStateToProps,
    {reset, registers, getRequest}
)(RegisterClient);