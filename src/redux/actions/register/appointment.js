import axios from "axios";
import config from "../../../config";
import {
	APPOINTMENT_PROVIDER_ALL,
	APPOINTMENT_TODAY,
	APPOINTMENT_UPCOMING,
	APPOINTMENT_REQUEST,
	APPOINTMENT_PAYMENT,
	APPOINTMENT_ACCEPT,
	APPOINTMENT_CANCEL,
	APPOINTMENT_PAID, SHOW_SPINNING, SET_ERROR_MESSAGE,
	APPOINTMENT_JOIN,

	APPOINTMENT_LIST_ALL,
	APPOINTMENT_GET,
	APPOINTMENT_CREATE,
	APPOINTMENT_DELETE,
	APPOINTMENT_EDIT,
} from "../types/types";

export const reset = () => dispatch => {
	dispatch({
		type: APPOINTMENT_CREATE,
		payload: '',
	});
	dispatch({
		type: APPOINTMENT_EDIT,
		payload: '',
	});
	dispatch({
		type: APPOINTMENT_DELETE,
		payload: '',
	});
	dispatch({
		type: APPOINTMENT_ACCEPT,
		payload: '',
	});
	dispatch({
		type: APPOINTMENT_JOIN,
		payload: '',
	});
};

export const createAppointment = (data) => dispatch => {
	console.log(data);
	dispatch({type: SHOW_SPINNING, payload: true});
	axios
		.post(config.SIM_API_URL + "api/appointments/create-request-appointment", data)
		.then(res => {
			dispatch({type: SHOW_SPINNING, payload: false});
			dispatch({
				type: APPOINTMENT_CREATE,
				payload: res.data.msg,
			});
		})
		.catch(err => {
			dispatch({type: SHOW_SPINNING, payload: false});
			dispatch({
				type: APPOINTMENT_CREATE,
				payload: err.response.data.msg,
			});
		});
};

export const editAppointment = (data) => dispatch => {
	axios
		.post(config.SIM_API_URL + "api/appointments/edit-appointment", data)
		.then(res => {
			console.log(res.data.results);
			dispatch({
				type: APPOINTMENT_EDIT,
				payload: res.data.msg,
			});

			window.location.href = "/appointment";
		})
		.catch(err => {
			dispatch({
				type: APPOINTMENT_EDIT,
				payload: err.response.data.msg,
			});
		})
};

export const deleteAppointment = (data) => dispatch => {
	axios
		.post(config.SIM_API_URL + "api/appointments/cancel-appointment", data)
		.then(res => {
			dispatch({
				type: APPOINTMENT_DELETE,
				payload: res.data.msg,
			});
			window.location.href = "/appointment";
		})
		.catch(err => {
			dispatch({
				type: APPOINTMENT_DELETE,
				payload: err.response.data.msg,
			});
		})
};

export const appointmentProviders = () => dispatch => {
	axios
		.get(config.SIM_API_URL + "api/appointments/get-providers-appointment",)
		.then(res => {
			dispatch({
				type: APPOINTMENT_PROVIDER_ALL,
				payload: res.data.results,
			});
		})
		.catch(err => {
			console.log("Failed.", err.toString());
		})
};

export const appointmentAccept = (data) => dispatch => {
	axios
		.post(config.SIM_API_URL + "api/appointments/accept-appointment", data)
		.then(res => {
			dispatch({
				type: APPOINTMENT_ACCEPT,
				payload: res.data.msg,
			});
		})
		.catch(err => {
			console.log("Failed.", err.toString());
		})
};

export const appointmentCancel = (data) => dispatch => {
	axios
		.post(config.SIM_API_URL + "api/appointments/cancel-appointment", data)
		.then(res => {
			dispatch({
				type: APPOINTMENT_CANCEL,
				payload: res.data.msg,
			});
		})
		.catch(err => {
			console.log("Failed.", err.toString());
		})
};

export const appointmentToday = (data) => dispatch => {
	axios
		.post(config.SIM_API_URL + "api/appointments/get-today-appointment", data)
		.then(res => {
			dispatch({
				type: APPOINTMENT_TODAY,
				payload: res.data.results,
			});
		})
		.catch(err => {
			console.log("Failed.", err.toString());
		})
};

export const appointmentUpcoming = (data) => dispatch => {
	axios
		.post(config.SIM_API_URL + "api/appointments/get-upcoming-appointment", data)
		.then(res => {
			dispatch({
				type: APPOINTMENT_UPCOMING,
				payload: res.data.results,
			});
		})
		.catch(err => {
			console.log("Failed.", err.toString());
		})
};

export const appointmentPaymentRequest = (data) => dispatch => {
	axios
		.post(config.SIM_API_URL + "api/appointments/get-payment-appointment", data)
		.then(res => {
			dispatch({
				type: APPOINTMENT_PAYMENT,
				payload: res.data.results,
			});
		})
		.catch(err => {
			console.log("Failed.", err.toString());
		})
};

export const appointmentPaidRequest = (data) => dispatch => {
	axios
		.post(config.SIM_API_URL + "api/appointments/get-paid-appointment", data)
		.then(res => {
			dispatch({
				type: APPOINTMENT_PAID,
				payload: res.data.results,
			});
		})
		.catch(err => {
			console.log("Failed.", err.toString());
		})
};

export const appointmentAppointmentRequest = (data) => dispatch => {
	axios
		.post(config.SIM_API_URL + "api/appointments/get-request-appointment", data)
		.then(res => {
			dispatch({
				type: APPOINTMENT_REQUEST,
				payload: res.data.results,
			});
		})
		.catch(err => {
			console.log("Failed.", err.toString());
		});
};

let error_timer = null;
export const payAppointment = (data) => dispatch => {
	dispatch({type: SHOW_SPINNING, payload: true});
	axios
		.post(config.SIM_API_URL + "api/appointments/pay", data)
		.then(res => {
			dispatch({type: SHOW_SPINNING, payload: false});
		})
		.catch(err => {
			dispatch({type: SET_ERROR_MESSAGE, payload: err.response.data.msg});

			window.location.href = "/dashboard";

			if(error_timer !== null){
				clearTimeout(error_timer);
				error_timer = null;
			}

			error_timer = setTimeout(() => {
				dispatch({type: SET_ERROR_MESSAGE, payload: ''});
				error_timer = null;
			}, 10000);
			dispatch({type: SHOW_SPINNING, payload: false});
		});
};

export const getAppointmentList = (data) => dispatch => {
	console.log(data);
	axios
		.post(config.SIM_API_URL + "api/appointments/get-clients-appointment", data)
		.then(res => {
			console.log("appointment Info = ", res.data.results);
			dispatch({
				type: APPOINTMENT_LIST_ALL,
				payload: res.data.results,
			});

		})
		.catch(err => {
			console.log("fail", err.toString());
		})
};

export const appointmentById = (data) => dispatch => {
	axios
		.post(config.SIM_API_URL + "api/appointments/get-appointment", data)
		.then(res => {
			dispatch({
				type: APPOINTMENT_GET,
				payload: res.data.results,
			});
		})
		.catch(err => {
			console.log("Failed.", err.toString());
		})
};

export const joinAppointment = (data) => dispatch => {
	axios
		.post(config.SIM_API_URL + "api/appointments/join-appointment", data)
		.then(res => {
			dispatch({
				type: APPOINTMENT_JOIN,
				payload: res.data.msg,
			});
		})
		.catch(err => {
			console.log("Failed.", err.toString());
			dispatch({
				type: APPOINTMENT_JOIN,
				payload: err.toString(),
			});
		})
};
export const outAppointment = (data) => dispatch => {
	console.log("==================================== ", data);
	axios
		.post(config.SIM_API_URL + "api/appointments/out-appointment", data)
		.then(res => {
			console.log("out appointment = ", res.data.msg);
			dispatch({
				type: APPOINTMENT_JOIN,
				payload: res.data.msg,
			});
		})
		.catch(err => {
			console.log("Failed.", err.toString());
			dispatch({
				type: APPOINTMENT_JOIN,
				payload: err.response.data.msg,
			});
		})
};
export const testAppointment = (data) => dispatch => {
	axios
		.post(config.SIM_API_URL + "api/appointments/test-appointment", data)
		.then(res => {
			dispatch({
				type: APPOINTMENT_JOIN,
				payload: res.data.msg,
			});
		})
		.catch(err => {
			console.log("Failed.", err.toString());
		})
};