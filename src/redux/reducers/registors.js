import {
	CLIENT_ALL,
	APPOINTMENT_PROVIDER_ALL,

	ALLOW_PROVIDERS,
	REQUEST_INFO,
	RECIPIENT_ALL,
	SENDER_ALL,
	LOGIN_REQUEST,
	RESET_REQUEST,
	CLIENT_INFO,
	CLIENT_FULL,

	PROVIDERS_ID,
	REGISTER_REQUEST,
	SHOW_SPINNING,
	SHOW_FORGOT_PASSWORD,

	POST_ARTICLE,
	PUBLISHED_ALL,
	ARTICLES_ALL,
	ARTICLE_DETAILS,
	ARTICLE_DELETE,
	CATEGORY_LIST,
	UPDATE_ARTICLE,
	ARTICLE_DETAILS_DISPLAY,
	CATEGORY_ADD,
	POST_COMMENT,
	GET_COMMENT_BYID,
	APPOINTMENT_TODAY,
	APPOINTMENT_UPCOMING,
	APPOINTMENT_REQUEST,
	APPOINTMENT_PAYMENT,
	APPOINTMENT_ACCEPT,
	APPOINTMENT_CANCEL,
	APPOINTMENT_PAID, SET_ERROR_MESSAGE,
	APPOINTMENT_LIST_ALL,
	APPOINTMENT_GET,
	APPOINTMENT_JOIN,

	MESSAGES_LIST,
	MESSAGES_LIST_ERROR,
	MESSAGES,
	MESSAGES_ONE_ERROR,
	MESSAGES_EDIT,

	USERS,
	LAST_MESSAGES,
	DRAG_UPDATE,
	GET_DRAG,
	APPOINTMENT_CREATE,
	APPOINTMENT_EDIT,
	APPOINTMENT_DELETE,
	FILE_SHARE,

	CHATBOT_PAGE,
	CHATBOT_ADD,
	CHATBOT_ADD_MESSAGE,
	CHATBOT_DELETE_MESSAGE,
	CHATBOT_ERROR,
	GET_CHATBOT,
	GET_REPLY,
	GET_FAIL,
	RECENT_DOCUMENT,

	CLIENT_MUSIC_BACKGROUND,
	INFO_UPDATE,
	PRACTICE_LIST,
} from "../actions/types/types"

const initialState = {
	msg_dragUpdate: '',
	getDragLists: '',
	clientList: {},
	appointmentClientList: {},
	requestInfo: '',

	recipientList: {},
	senderList: {},

	msg_login: '',
	msg_reset: '',
	msg_register: '',
	clientInfo: '',
	clientFullInfo: '',
	providerIdList: {},
	spinning: false,

	msg_article: '',
	publishedList: '',
	articlesList: '',
	articleDetails: '',
	msg_deleteArticle: '',
	categoryList: '',
	msg_updateArticle: '',
	articleDetailById: '',
	msg_addCategory: '',
	msg_comment: '',
	articleCommentById: '',

	appointmentTodayList: '',
	appointmentUpcomingList: '',
	appointmentPaymentList: '',
	appointmentRequestList: '',
	msg_accept: '',
	msg_cancel: '',
	paidAppointmentList: '',
	account_link: null,
	error_message: '',
	msg_join: '',

	messageList: '',
	msg_messageList: '',
	massage: '',
	getEditError: '',
	getEdit: '',

	userList: '',
	lastMessagesList: '',
	appointmentList: '',
	getAppointment: '',
	msg_appointment: '',
	msg_editAppointment: '',
	msg_deleteAppointment: '',
	getAllowedProviders: '',
	msg_share: '',

	description_page: '',
	get_one_chatbot: '',
	msg_add_chatbot: '',
	msg_delete_chatbot: '',
	msg_error_chatbot: '',
	chatbot_list: '',
	get_msg_result: '',
	msg_fail: '',
	get_recent_document: '',
	msg_info_update: '',
	practiceList: '',
};

export default function(state = initialState, action){
	switch(action.type){
		case PRACTICE_LIST:
			return {
				...state,
				practiceList: action.payload,
			};
		case INFO_UPDATE:
			return {
				...state,
				msg_info_update: action.payload,
			};
		case CLIENT_MUSIC_BACKGROUND:
			return {
				...state,
				backgroundImgMusic: action.payload,
			};

		case RECENT_DOCUMENT:
			return {
				...state,
				get_recent_document: action.payload,
			};

		case GET_REPLY:
			return {
				...state,
				get_msg_result: action.payload,
			};

		case GET_FAIL:
			return {
				...state,
				msg_fail: action.payload,
			};

		case GET_CHATBOT:
			return {
				...state,
				chatbot_list: action.payload,
			};

		case CHATBOT_ADD:
			return {
				...state,
				get_one_chatbot: action.payload,
			};

		case CHATBOT_ADD_MESSAGE:
			return {
				...state,
				msg_add_chatbot: action.payload,
			};

		case CHATBOT_DELETE_MESSAGE:
			return {
				...state,
				msg_delete_chatbot: action.payload,
			};

		case CHATBOT_ERROR:
			return {
				...state,
				msg_error_chatbot: action.payload,
			};


		case CHATBOT_PAGE:
			return {
				...state,
				description_page: action.payload,
			};


		case FILE_SHARE:
			return {
				...state,
				msg_share: action.payload,
			};
		case APPOINTMENT_EDIT:
			return {
				...state,
				msg_editAppointment: action.payload,
			};
		case APPOINTMENT_DELETE:
			return {
				...state,
				msg_deleteAppointment: action.payload,
			};
		case ALLOW_PROVIDERS:
			return {
				...state,
				getAllowedProviders: action.payload,
			};

		case CLIENT_ALL:
			return {
				...state,
				clientList: action.payload,
			};

		case APPOINTMENT_PROVIDER_ALL:
			return {
				...state,
				appointmentProviderList: action.payload,
			};

		case REGISTER_REQUEST:
			return {
				...state,
				msg_register: action.payload,
			};

		case REQUEST_INFO:
			return {
				...state,
				requestInfo: action.payload,
			};

		case RECIPIENT_ALL:
			return {
				...state,
				recipientList: action.payload,
			};

		case SENDER_ALL:
			return {
				...state,
				senderList: action.payload,
			};

		case LOGIN_REQUEST:
			return {
				...state,
				msg_login: action.payload,
			};

		case SHOW_FORGOT_PASSWORD:
			return {
				...state,
				msg_forgot_password: action.payload,
			};

		case RESET_REQUEST:
			return {
				...state,
				msg_reset: action.payload,
			};

		case CLIENT_INFO:
			return {
				...state,
				clientInfo: action.payload,
			};

		case CLIENT_FULL:
			return {
				...state,
				clientFullInfo: action.payload,
			};

		case PROVIDERS_ID:
			return {
				...state,
				providerIdList: action.payload,
			};

		case SHOW_SPINNING:
			return {
				...state,
				spinning: action.payload,
			};

		case POST_ARTICLE:
			return {
				...state,
				msg_article: action.payload,
			};

		case PUBLISHED_ALL:
			return {
				...state,
				publishedList: action.payload,
			};

		case ARTICLES_ALL:
			return {
				...state,
				articlesList: action.payload,
			};

		case ARTICLE_DETAILS:
			return {
				...state,
				articleDetails: action.payload,
			};

		case ARTICLE_DELETE:
			return {
				...state,
				msg_deleteArticle: action.payload,
			};

		case CATEGORY_LIST:
			return {
				...state,
				categoryList: action.payload,
			};
		case UPDATE_ARTICLE:
			return {
				...state,
				msg_updateArticle: action.payload,
			};
		case ARTICLE_DETAILS_DISPLAY:
			return {
				...state,
				articleDetailById: action.payload,
			};
		case CATEGORY_ADD:
			return {
				...state,
				msg_addCategory: action.payload,
			};
		case POST_COMMENT:
			return {
				...state,
				msg_comment: action.payload,
			};
		case GET_COMMENT_BYID:
			return {
				...state,
				articleCommentById: action.payload,
			};
		case APPOINTMENT_TODAY:
			return {
				...state,
				appointmentTodayList: action.payload,
			};
		case APPOINTMENT_UPCOMING:
			return {
				...state,
				appointmentUpcomingList: action.payload,
			};
		case APPOINTMENT_REQUEST:
			return {
				...state,
				appointmentRequestList: action.payload,
			};
		case APPOINTMENT_PAYMENT:
			return {
				...state,
				appointmentPaymentList: action.payload,
			};
		case APPOINTMENT_ACCEPT:
			return {
				...state,
				msg_accept: action.payload,
			};
		case APPOINTMENT_CANCEL:
			return {
				...state,
				msg_cancel: action.payload,
			};
		case APPOINTMENT_PAID:
			return {
				...state,
				paidAppointmentList: action.payload,
			};
		case SET_ERROR_MESSAGE:
			return {
				...state,
				error_message: action.payload,
			};

		case MESSAGES_LIST:
			return {
				...state,
				messageList: action.payload,
			};

		case MESSAGES_LIST_ERROR:
			return {
				...state,
				msg_messageList: action.payload,
			};

		case MESSAGES:
			return {
				...state,
				message: action.payload,
			};

		case MESSAGES_EDIT:
			return {
				...state,
				getEdit: action.payload,
			};

		case MESSAGES_ONE_ERROR:
			return {
				...state,
				getEditError: action.payload,
			};

		case USERS:
			return {
				...state,
				userList: action.payload,
			};
		case LAST_MESSAGES:
			return {
				...state,
				lastMessagesList: action.payload,
			};

		case APPOINTMENT_LIST_ALL:
			return {
				...state,
				appointmentList: action.payload,
			};

		case APPOINTMENT_GET:
			return {
				...state,
				getAppointment: action.payload,
			};

		case APPOINTMENT_JOIN:
			return {
				...state,
				msg_join: action.payload,
			};

		case DRAG_UPDATE:
			return {
				...state,
				msg_dragUpdate: action.payload,
			};

		case GET_DRAG:
			return {
				...state,
				getDragLists: action.payload,
			};

		case APPOINTMENT_CREATE:
			return {
				...state,
				msg_appointment: action.payload,
			};

		default:
			return state;
	}
}
