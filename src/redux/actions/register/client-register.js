import axios from "axios";
import config from "../../../config/index";

import {
    APPOINTMENT_PROVIDER_ALL,
    ALLOW_PROVIDERS,
    REQUEST_INFO,
    LOGIN_REQUEST,
    RESET_REQUEST,
    CLIENT_INFO,
    SHOW_SPINNING,
    REGISTER_REQUEST,
    PROVIDERS_ID,
    CLIENT_FULL,
    SHOW_FORGOT_PASSWORD,

    USERS,
    DRAG_UPDATE,
    GET_DRAG,
    CLIENT_MUSIC_BACKGROUND,

    INFO_UPDATE,
    PRACTICE_LIST,
} from "../types/types";

export const reset = () => dispatch => {
    dispatch({
        type: LOGIN_REQUEST,
        payload: '',
    });
    dispatch({
        type: RESET_REQUEST,
        payload: '',
    });
    dispatch({
        type: REGISTER_REQUEST,
        payload: '',
    });
    dispatch({
        type: INFO_UPDATE,
        payload: '',
    });
    dispatch({
        type: SHOW_FORGOT_PASSWORD,
        payload: '',
    });
};


export const registers = (data, history) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/users/register-client", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            if (res.status === 200) {
                dispatch({
                    type: REGISTER_REQUEST,
                    payload: res.data.msg,
                });
                console.log(res.data.msg);
                history.push("/client-login");
                //window.location.href = "/dashboard";
            }
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: REGISTER_REQUEST,
                payload: err.response.data.msg,
            });
            console.log(err.response.data.msg);
        })
};

export const login = (data, history) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/users/login", data)
        .then(res => {
            if (res.status === 200) {
                dispatch({type: SHOW_SPINNING, payload: false});
                dispatch({
                    type: LOGIN_REQUEST,
                    payload: res.data.msg,
                });
                localStorage.setItem("role", "client");
                localStorage.setItem("client", true);
                localStorage.setItem("client_id", res.data.results._id);
                localStorage.setItem("client_name", res.data.results.name);
                localStorage.setItem("client_email", res.data.results.email);
                history.push("/dashboard");
                //window.location.href = "/dashboard";
            }
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: LOGIN_REQUEST,
                payload: err.response.data.msg,
            });
            console.log(err.response.data.msg);
        })
};

export const logout = (data, history) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/logout", data)
        .then(res => {
            if (res.status === 200) {
                localStorage.setItem("role", '');
                localStorage.setItem("client", '');
                localStorage.setItem("client_id", '');
                localStorage.setItem("client_name", '');
                localStorage.setItem("client_email", '');
                //history.push("/client-login");
                window.location.href = "/client-login";

                console.log(res.data.msg);
            }
        })
        .catch(err => {
            console.log(err.toString());
        })
};
/**
 * Accept terms and conditions
 */
export const acceptTerms = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/accept-terms", data)
        .then(res => {
            console.log(res.data.msg, "accept-terms");
        })
        .catch(err => {
            console.log("fail", err.toString());
        })
};

/**
 * Forgot Password
 * @param data
 * @returns {function(...[*]=)}
 */
export const forgot = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/users/forgot-password", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: SHOW_FORGOT_PASSWORD,
                payload: res.data.msg,
            });
            console.log(res.data.msg);
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: SHOW_FORGOT_PASSWORD,
                payload: err.response.data.msg,
            });
        })
};

export const resetPassword = (data, history) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/reset-password", data)
        .then(res => {
            dispatch({
                type: RESET_REQUEST,
                payload: res.data.msg,
            });
            if(data.flag === "profile") {
            } else {
                history.push("/login");
            }
        })
        .catch(err => {
            dispatch({
                type: RESET_REQUEST,
                payload: err.response.data.msg,
            });
        })
};


/**
 * Only ID, Email, Name, and photo according to the Client ID
 */
export const getPhotoByIdRole = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-photo-user", data)
        .then(res => {
            if (res.data.results !== null) {
                dispatch({
                    type: CLIENT_INFO,
                    payload: res.data.results,
                });
            } else {
                localStorage.setItem("role", '');
                localStorage.setItem("client", '');
                localStorage.setItem("client_id", '');
                localStorage.setItem("client_name", '');
                localStorage.setItem("client_email", '');
                window.location.href = "/client-login";
            }
        })
        .catch(err => {
            console.log(err.toString());
        })
};

/**
 * One Full Information the provider ID
 */
export const getFullUserByIdRole = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-info-user", data)
        .then(res => {
            dispatch({
                type: CLIENT_FULL,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log(err.toString());
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
            console.log(err.toString());
        })
};

export const getRequest = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-request", data)
        .then(res => {
            dispatch({
                type: REQUEST_INFO,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log(err.toString());
        })
};

/**
 * Only ID, Name, and Email List according to role
 */
export const getSimpleProviders = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-users", data)
        .then(res => {
            if (res.data.results.length !== 0) {
                dispatch({
                    type: PROVIDERS_ID,
                    payload: res.data.results,
                });
            } else {
                localStorage.setItem("role", '');
                localStorage.setItem("client", '');
                localStorage.setItem("client_id", '');
                localStorage.setItem("client_name", '');
                localStorage.setItem("client_email", '');
                window.location.href = "/client-login";
            }
        })
        .catch(err => {
            console.log(err.toString());
        })
};

/**
 * Only ID, Name, and Email List of the allowed providers
 */
export const getAllowProviders = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-allow-providers", data)
        .then(res => {
            dispatch({
                type: ALLOW_PROVIDERS,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log(err.toString());
        })
};

export const ClientInfo = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/clients/get-client", data)
        .then(res => {
            dispatch({
                type: CLIENT_INFO,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log(err.toString());
        })
};

/**
 * Only ID, Name, Email, phone number List according to role
 */
export const getSimpleUsers = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-user-list", data)
        .then(res => {
            if(res.data.results.length !== 0){
                dispatch({
                    type: USERS,
                    payload: res.data.results,
                });
            }
            console.log(res.data.results);
        })
        .catch(err => {
            console.log("Failed.", err);
        })
};


/**
 * User Information Updating
 */
export const clientInfoUpdate = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/users/user-profile", data)
        .then(res => {
            dispatch({type: SHOW_SPINNING, payload: false});
                localStorage.setItem("client", true);
                localStorage.setItem("client_id", data.id);
                localStorage.setItem("client_name", data.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()),);
                localStorage.setItem("client_email", data.email);
                console.log(res.data.msg);
            dispatch({
                type: INFO_UPDATE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({type: SHOW_SPINNING, payload: false});
            console.log(err.response.data.msg);
            dispatch({
                type: INFO_UPDATE,
                payload: err.response.data.msg,
            });
        })
};

export const clientAddressUpdate = (data) => dispatch => {
    dispatch({type: SHOW_SPINNING, payload: true});
    axios
        .post(config.SIM_API_URL + "api/users/address-update", data)
        .then(res => {
           console.log(res.data);
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: INFO_UPDATE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            console.log(err.response.data.msg);
            dispatch({type: SHOW_SPINNING, payload: false});
            dispatch({
                type: INFO_UPDATE,
                payload: err.response.data.msg,
            });
        })
};


/**
 * Drag
 * @param data
 * @returns {function(...[*]=)}
 */
export const updateDragDrop = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/drag-update", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: DRAG_UPDATE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            console.log("fail", err.toString());
        })
};

export const getDragList = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-drag", data)
        .then(res => {
            dispatch({
                type: GET_DRAG,
                payload: res.data.results,
            });

        })
        .catch(err => {
            console.log("fail", err.toString());
        })
};

/**
 * Room background Image update
 */
export const roomImg = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/room-image", data)
        .then(res => {
            if (res.status === 200) {
                console.log(res.data.msg);
            }
        })
        .catch(err => {
            if (err.status === 400) {
                console.log(err.response.data.msg);
            }
        })
};

export const musicImageByIdRole = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-background-user", data)
        .then(res => {
            dispatch({
                type: CLIENT_MUSIC_BACKGROUND,
                payload: res.data.results,
            });
            console.log(res.data.msg);

        })
        .catch(err => {
            if (err.status === 400) {
                console.log(err.response.data.msg);
            }
        })
};

/**
 * Getting the practice names of the client
 */
export const getPractice = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/users/get-client-practices", data)
        .then(res => {
            dispatch({
                type: PRACTICE_LIST,
                payload: res.data.results,
            })
        }).catch(err => {
        console.log(err.toString());
    })
};

