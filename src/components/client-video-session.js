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

class ClientVideoSession extends Component {
	constructor(props) {
		super(props);
		this.state = {
			appointment: '',
			listening: false,
		}
	}

	componentDidMount() {
		const {
			joinAppointment
		} = this.props;

		const data = {
			id: this.props.match.params && this.props.match.params.id,
			client_id: localStorage.client_id,
			role: 'client',
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

			if(this.props.msg_join === "The provider has not joined yet. Please wait for him to join." || this.props.msg_join === "This session already has finished.") {
				window.location.href = "/client-session/" + this.props.match.params.id;
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
		let len;
		let link = this.props.match.params && this.props.match.params.id;
		const events = new EventSource(config.SIM_API_URL + `api/events/appointment/` + link);

		events.onmessage = async (event) => {
			const parseData = JSON.parse(event.data);
			console.log(parseData, ++len, "==================************8");
			if(parseData === false) {
				clearTimeout(this.tmr);
				this.tmr = setTimeout(function () {
					this.tmr = null;
					window.location.href = "/client-session/" + link;
				}, 2500);
			}
		};
		events.onerror = (err) => {
			console.log("EventSource error: ", err.readyState, err);
			window.location.href = "/client-session/" + link;
		}
	};
	onClose = () => {
		const {
			outAppointment,
		} = this.props;
		const data = {
			id: this.props.match.params && this.props.match.params.id,
			client_id: localStorage.client_id,
			role: "client",
		};
		if (outAppointment) {
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
					<iframe
						id={"video-frame"}
						className="video-frame"
						title='tele-therapy video room'
						allow={'camera; microphone; display-capture'}
						//src={`${config.WEBRTC_HOST}/TeleTherapistVideoRoom-${this.props.match.params.id}#interfaceConfig.langDetection=true&config.defaultLanguage=%22en%22&userInfo.email=%22${localStorage.client_email}%22&userInfo.displayName=%22${localStorage.client_name}%22`}
						src={`${config.WEBRTC_HOST}/TeleTherapistVideoRoom-${this.props.match.params.id}#interfaceConfig.langDetection=true&config.defaultLanguage=%22es%22&config.prejoinPageEnabled=false&userInfo.email=%22${localStorage.client_email}%22&userInfo.displayName=%22${localStorage.client_name}%22`}
						allowFullScreen={true}
					/>
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
)(ClientVideoSession);
