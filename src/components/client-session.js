import React, {Component} from 'react';
import '../assets/css/dashboard.css';
import {connect} from "react-redux";
import Config from "../config/index";
import {
    appointmentById,
    joinAppointment,
    reset,
} from "../redux/actions/register/appointment";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    getPhotoByIdRole
} from "../redux/actions/register/client-register";
import imgLink from "../assets/img/admin-login.jpg"
class ClientSession extends Component {
    constructor(props) {
        super(props);
        this.tmr = null;

        this.state = {
            appointment: '',
            provider_waiting_room: '',
            client_waiting_room: '',
            listening: false,
            join_state: false,

            flag: 0,
        }
    }

    componentDidMount() {
        const {
            appointmentById,
            joinAppointment,
            getPhotoByIdRole,
        } = this.props;

        const data = {
            id: this.props.match.params && this.props.match.params.id,
            client_id: localStorage.client_id,
            role: 'client',
        };

        if(appointmentById) {
            appointmentById(data)
        }

        if(joinAppointment) {
            joinAppointment(data)
        }
        if(getPhotoByIdRole) {
            getPhotoByIdRole({
                id: localStorage.client_id,
                role: 'client',
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.clientInfo && this.props.clientInfo !== prevProps.clientInfo) {
            this.setState({
                client_waiting_room: this.props.clientInfo.bgRoom,
            })
        }
        if(this.props.getAppointment && prevProps.getAppointment !== this.props.getAppointment) {
            this.setState({
                appointment: this.props.getAppointment,
                provider_waiting_room: this.props.getAppointment[0].userInfo[0],
            });
        }

        if(this.props.msg_join && prevProps.msg_join !== this.props.msg_join) {
            if(this.props.msg_join !== "The provider has not joined yet. Please wait for him to join.") {
                if(this.props.msg_join === "The joining succeed."){
                    window.location.href = "/room/" + this.props.match.params.id;
                } else {
                    let temp = this.state.appointment && this.state.appointment;
                    if(temp.allow === true) {
                        window.location.href = "/room/" + this.props.match.params.id;
                    }
                }
            }
        }
        if(!this.state.listening) {
            this.receiveSSE().then(res => {
            });
            this.setState({
                listening: true,
            })
        }
    }

    receiveSSE = async () => {
        let link = this.props.match.params && this.props.match.params.id;
        const events = new EventSource(Config.SIM_API_URL + `api/events/appointment/` + link);
        events.onmessage = async (event) => {
            const parseData = JSON.parse(event.data);
            console.log("parseData = ", parseData)
            if(parseData === true) {
                this.setState({
                    join_state: true,
                });

                let str = "The provider has just joined for the session. You can join the session by clicking the 'Join' button below.";
                toast(str);
                clearTimeout(this.tmr);
                this.tmr = setTimeout(function () {
                    str = '';
                    this.tmr = null;
                }, 2500);
            } else if(parseData === "The meeting time is already passed.") {
                this.setState({
                    join_state: false,
                });

                let str = parseData;
                toast(str);
                clearTimeout(this.tmr);
                this.tmr = setTimeout(function () {
                    str = '';
                    this.tmr = null;
                }, 3500);
            } else if(parseData === false) {
                this.setState({
                    join_state: false,
                });

                this.onWaiting();
            }
        };
        events.onerror = (err) => {
            console.log("EventSource error: ", err.readyState, err);
        }
    };

    onWaiting = () => {
        let str = "Please wait for the provider until he will join.";
        let link = this.props.match.params.id;
        let n = this.state.flag;
        toast(str);
        clearTimeout(this.tmr);
        this.tmr = setTimeout(function () {
            str = '';
            this.tmr = null;
            if(n === 0) {
                window.location.href = "/client-session/" + link;
                n = 1;
            }
        }, 2500);
        this.setState({
            flag: n,
        })
    };

    currentTimeCalc = (sTime, eTime) => {
        let temp = this.state.appointment && this.state.appointment;
        // let appointmentStartTime = Math.floor((new Date(sTime)).getTime());
        // let appointmentEndTime = Math.floor((new Date(eTime)).getTime());
        // let currentTime = Math.floor((new Date()).getTime());
        let path = "/room/" + this.props.match.params.id;

        // let time1 = appointmentStartTime - currentTime;
        // let time2 = appointmentEndTime - currentTime;

        if(temp.allow === true) {
            window.location.href = path;
            // if(time1 >= 0) { // state = 31
            //     setTimeout(function () {
            //         window.location.href = path;
            //     },  time1);
            // } else if(time2 >= 0) { // state = 32
            //     window.location.href = path;
            // }
        }
    };
    onClose = () => {
        this.props.history.push("/dashboard");
    };
    onJoin = () => {
        this.props.history.push("/room/" + this.props.match.params.id);
    };

    render() {
        let urlLink = imgLink;
        return (
            <>
                {/*<div className="spinning-curtain" style={{display: 'flex'}}>*/}
                {/*    <div className="lds-dual-ring"/>*/}
                {/*</div>*/}

                {/*urlLink ? 'url(' + urlLink + ')'*/}
                {/* <div className="waiting-bg" style={{backgroundImage: 'url(' + Config.SIM_API_URL + 'waiting/' + this.state.imgNum + '.png)'}}>*/}
                {/*<div className="session-bg" style={{backgroundImage: this.state.provider_waiting_room && this.state.provider_waiting_room.bgRoom?*/}
                {/*        'url(' + Config.SIM_API_URL + 'waiting/' + this.state.provider_waiting_room.bgRoom + '.png)'*/}
                {/*        :*/}
                {/*        'url(' + urlLink + ')'}}*/}
                {/*>*/}

                <ToastContainer />
                    <div className="session-bg" style={{backgroundImage: this.state.client_waiting_room?
                            'url(' + Config.SIM_API_URL + 'waiting/' + this.state.client_waiting_room + '.png)'
                            :
                            this.state.provider_waiting_room && this.state.provider_waiting_room.bgRoom?
                                'url(' + Config.SIM_API_URL + 'waiting/' + this.state.provider_waiting_room.bgRoom + '.png)'
                                :
                                'url(' + urlLink + ')'}}
                    >
                    <div className="login-body">
                        <div
                            className="justify-center col-heavyDark txt-26"
                            style={{paddingBottom: 20}}
                        >
                            {/*<img className="logo-img mouse-cursor" src={require('../assets/img/app-logo.svg')} alt=""/>*/}
                            {
                                this.state.provider_waiting_room &&
                                this.state.provider_waiting_room.name

                            }
                        </div>

                        <div className="pb-20 txt-22 col-heavyDark align-center">
                            Please wait until your meeting time or the provider to join
                        </div>

                        <div className="pt-30 txt-14 col-heavyDark">
                            Start Time:
                            {
                                this.state.appointment && (
                                    <span style={{paddingLeft: 20}}>
                                        {new Date(this.state.appointment[0].start_time).toLocaleString()}
                                    </span>
                                )
                            }
                        </div>

                        <div className="pt-20 txt-14 col-heavyDark">
                            {
                                this.state.appointment && (
                                    this.state.appointment[0].end_time && (
                                        <span>End Time:
                                            <span  style={{paddingLeft: 20}}>{new Date(this.state.appointment[0].end_time).toLocaleString()}</span>
                                        </span>
                                    )


                                )
                            }
                        </div>

                        <div className="pt-45 flex-space">
                            <div onClick={this.onClose}>
                                <div className="btn-common txt-16 col-white justify-center mouse-cursor">
                                    Back
                                </div>
                            </div>

                            {
                                this.state.join_state === false ?
                                    <div onClick={this.onClose}>
                                        <div className="btn-common txt-16 col-white justify-center mouse-cursor">
                                            Waiting
                                        </div>
                                    </div>
                                    :
                                    <div onClick={this.onJoin}>
                                        <div className="btn-common txt-16 col-white justify-center mouse-cursor">
                                            Join
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        clientInfo: state.registers.clientInfo,
        getAppointment: state.registers.getAppointment,
        msg_join: state.registers.msg_join,
        spinning: state.registers.spinning,
    }
};

export default connect(
    mapStateToProps,
    {
        reset,
        appointmentById,
        joinAppointment,
        getPhotoByIdRole,
    }
)(ClientSession);