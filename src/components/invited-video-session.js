import React, {Component} from 'react';
import '../assets/css/dashboard.css';
import config from '../config';
import {
    outAppointment,
    joinAppointment,
    reset,
} from "../redux/actions/register/appointment";
import {connect} from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class InvitedVideoSession extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointment: '',
            listening: false,
            flag: 0,
        }
    }

    componentDidMount() {
        const {
            joinAppointment
        } = this.props;

        const data = {
            id: this.props.match.params && this.props.match.params.id,
            role: 'invited',
            start_session: true,
        };

        if(joinAppointment) {
            joinAppointment(data)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_join && prevProps.msg_join !== this.props.msg_join) {
            if (this.props.msg_join.includes("Error: Request failed with status code 400") === false && this.props.msg_join.includes("Error: Request failed with status code 404") === false && this.props.msg_join.includes("Network Error") === false) {
                toast(this.props.msg_join);
                const {
                    reset
                } = this.props;
                clearTimeout(this.tmr);
                this.tmr = setTimeout(function () {
                    reset();
                    this.tmr = null;
                }, 2500);
            }

            if(this.props.msg_join === "The provider has not joined yet. Please wait for him to join.") {
                window.location.href = "/invited-session/" + this.props.match.params.id;
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
        const events = new EventSource(config.SIM_API_URL + `api/events/appointment/` + link);

        events.onmessage = async (event) => {
            const parseData = JSON.parse(event.data);
            if(parseData === false) {
                this.onWaiting();
            }
        };
        events.onerror = (err) => {
            console.log("EventSource error: ", err.readyState, err);
        }
    };
    onWaiting = () => {
        //let str = "The provider has just left this session.";
        let link = this.props.match.params.id;
        let n = this.state.flag;

        //toast(str);
        clearTimeout(this.tmr);
        this.tmr = setTimeout(function () {
            //str = '';
            this.tmr = null;
            if(n === 0) {
                window.location.href = "/invited-session/" + link;
                n = 1;
            }
        }, 2500);
        this.setState({
            flag: n,
        })
    };
    onClose = () => {
        const {
            outAppointment,
        } = this.props;
        if (outAppointment) {
            const data = {
                id: this.props.match.params && this.props.match.params.id,
                client_id: localStorage.client_id,
                role: "client",
            };
            outAppointment(data);
            this.props.history.push("/client-session/" + this.props.match.params.id);
        }
    };

    render() {
        if(this.state.appointment) console.log(this.state.appointment);
        return (
            <>
                <ToastContainer/>
                <div className="flex-space bg-position">
                    <iframe id={"video-frame"}
                            className={"video-frame"}
                            title='tele-therapy video room'
                            allow={'camera; microphone; display-capture'}
                            src={`${config.WEBRTC_HOST}/TeleTherapistVideoRoom-${this.props.match.params.id}#interfaceConfig.langDetection=true&config.defaultLanguage=%22es%22&config.prejoinPageEnabled=false&userInfo.email=%22${localStorage.client_email}%22&userInfo.displayName=%22${localStorage.client_name}%22`}
                            allowFullScreen={true}/>
                </div>

                <div className="session-logo">
                    <div className="flex-space">
                        <div className="hidden-logo"></div>
                        <div>
                            <img className="session-logo-img" src={require('../assets/img/session-logo.svg')} alt=""/>
                        </div>
                    </div>
                </div>
                <div className="btn-on-off" onClick={this.onClose}></div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        msg_join: state.registers.msg_join,
    }
};

export default connect(
    mapStateToProps,
    {
        outAppointment,
        joinAppointment,
        reset,
    }
)(InvitedVideoSession);
