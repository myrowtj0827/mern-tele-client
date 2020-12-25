import axios from "axios";
import config from "../../../config/index";

import {
    RECIPIENT_ALL,
    SENDER_ALL,
    FILE_SHARE,
    RECENT_DOCUMENT,
} from "../types/types";

export function fileUpload(data) {
    return axios.post(config.SIM_API_URL + "api/documents/upload", data);
}

export const reset = () => dispatch => {
    dispatch({
        type: FILE_SHARE,
        payload: '',
    });
};

export const getDocumentRecipients = () => dispatch => {
    axios
        .get(config.SIM_API_URL + "api/documents/document-client-recipient",)
        .then(res => {
            dispatch({
                type: RECIPIENT_ALL,
                payload: res.data.results,
            });

        })
        .catch(err => {
            console.log(err.toString());
        })
};

export const getDocumentSenders = () => dispatch => {
    axios
        .get(config.SIM_API_URL + "api/documents/document-client-sender",)
        .then(res => {
            dispatch({
                type: SENDER_ALL,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log(err.toString());
        })
};

export const ShareDocument = (data) => dispatch => {
    console.log(data);
    axios
        .post(config.SIM_API_URL + "api/documents/share-with", data)
        .then(res => {
            dispatch({
                type: FILE_SHARE,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            dispatch({
                type: FILE_SHARE,
                payload: err.response.data.msg,
            });
        })
};

export const getDocumentSharedWithMe = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/documents/shared-with-me", data)
        .then(res => {
            dispatch({
                type: RECENT_DOCUMENT,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log(err.toString());
        })
};