import axios from "axios";
import config from "../../../config/index";

import {
    POST_ARTICLE,
    PUBLISHED_ALL,
    ARTICLES_ALL,
    ARTICLE_DETAILS,
    ARTICLE_DELETE,
    CATEGORY_LIST,
    CATEGORY_ADD,
    UPDATE_ARTICLE,
    ARTICLE_DETAILS_DISPLAY,
    POST_COMMENT,
    GET_COMMENT_BYID,
} from "../types/types";

export const postArticle = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/post-article", data)
        .then(res => {
            console.log("Post Success -> ", res.data.msg);
            dispatch({
                type: POST_ARTICLE,
                payload: res.data.msg,
            });

        })
        .catch(err => {
            console.log("Post Failed -> ", err.response.data.msg);
            dispatch({
                type: POST_ARTICLE,
                payload: err.response.data.msg,
            });
        })
};

export const updateArticle = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/update-article", data)
        .then(res => {
            console.log("The article updated successfully -> ", res.data.msg);
            dispatch({
                type: UPDATE_ARTICLE,
                payload: res.data.msg,
            });

        })
        .catch(err => {
            console.log("Update Failed -> ", err.response.data.msg);
            dispatch({
                type: UPDATE_ARTICLE,
                payload: err.response.data.msg,
            });
        })
};

export function articleImageUpload(data) {
    return axios.post(config.SIM_API_URL + "api/documents/file-upload", data);
}

export const getPublishedArticle = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/get-published", data)
        .then(res => {
            dispatch({
                type: PUBLISHED_ALL,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Failed.", err.response.data.msg);
        })
};

export const getAllArticles = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/get-all-articles", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: ARTICLES_ALL,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Failed.", err.response.data.msg);
        })
};

export const getArticleDetails = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/edit-article", data)
        .then(res => {
            console.log(res.data.results);
            dispatch({
                type: ARTICLE_DETAILS,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Failed.", err.response.data.msg);
        })
};

export const getArticleDetailsById = (data) => dispatch =>{
    axios
        .post(config.SIM_API_URL + "api/articles/get-article", data)
        .then(res => {
            console.log(res.data.results);
            dispatch({
                type: ARTICLE_DETAILS_DISPLAY,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Getting of the article's details by Id failed.", err.response.data.msg);
        })
};

export const deleteArticle = (data) => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/delete-article", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: ARTICLE_DELETE,
                payload: res.data.msg,
            });
            window.location.href = '/published';
        })
        .catch(err => {
            console.log("Deleting of the article failed.", err.response.data.msg);
            dispatch({
                type: ARTICLE_DELETE,
                payload: err.response.data.msg,
            });
        })
};

/**
 * Adding the category
 */
export const addCategory = (data) => dispatch => {
    console.log(data);
    axios
        .post(config.SIM_API_URL + "api/articles/add-category", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: CATEGORY_ADD,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            console.log("Adding the category failed.", err.response.data.msg);
            dispatch({
                type: CATEGORY_ADD,
                payload: err.response.data.msg,
            });
        })
};

export const getListCategory = () => dispatch => {
    axios
        .post(config.SIM_API_URL + "api/articles/get-category-list",)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: CATEGORY_LIST,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Getting of the category list failed.", err.response.data.msg);
        })
};


/**
 * Comment
 */
export const postComment = (data) => dispatch => {
    console.log("data = ", data);

    axios
        .post(config.SIM_API_URL + "api/articles/post-comment", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: POST_COMMENT,
                payload: res.data.msg,
            });
        })
        .catch(err => {
            console.log("Posting of the comment failed.", err.response.data.msg);
        })

};

/**
 * Getting the comments by article ID
 * @type {Router}
 */
export const getArticleCommentById = (data) => dispatch => {
    console.log("Article ID For Getting of the comments = ", data);
    axios
        .post(config.SIM_API_URL + "api/articles/get-comment", data)
        .then(res => {
            console.log(res.data.msg);
            dispatch({
                type: GET_COMMENT_BYID,
                payload: res.data.results,
            });
        })
        .catch(err => {
            console.log("Posting of the comment failed.", err.response.data.msg);
        })
};
