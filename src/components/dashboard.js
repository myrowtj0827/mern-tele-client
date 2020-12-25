import React, {Component} from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import {
	appointmentPaidRequest,
	appointmentPaymentRequest,
	appointmentAccept,
	appointmentCancel,
	getAppointmentList,
	reset,
} from "../redux/actions/register/appointment";
import '../assets/css/dashboard.css';
import InjectedStripePopup from "./stripe-popup";
import DashboardCreateAppointment from "./dashboard-create-appointment";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
	getSimpleUsers,
	getDragList,
	getPhotoByIdRole,
} from "../redux/actions/register/client-register";
import {lastMessageList} from "../redux/actions/register/messages";
import {
	getDocumentSharedWithMe,
} from "../redux/actions/register/documents";

import EditAppointment from "./appointment-edit";
import FirstModal from "./first-login-modal";

const current_page = 1;
const page_neighbours = 1;
const pagination = 6;

class Dashboard extends Component{
	state = {
		show_first_modal: false,
		show: false,
		todayDate: '',
		dd: new Date(),
		weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		today: new Date(),

		invoiceList: '',
		paidList: '',
		shown_pay_popup: false,
		pay_info: {},

		providerList: '',
		messageList: '',
		appointmentList: '',
		provider_page_num: '',
		appointment_page_num: '',

		/**
		 * provider list Page
		 */
		page_num: '',
		client_current_page: current_page,
		client_page_neighbours: page_neighbours,
		client_pagination: pagination,

		/**
		 * last message List
		 */
		deleteData: '',
		requestShow: false,

		message_page_num: '',
		message_current_page: current_page,
		message_page_neighbours: page_neighbours,
		message_pagination: pagination,

		/**
		 * appointment list
		 */
		flag: 1,
		appointment_current_page: current_page,
		appointment_page_neighbours: page_neighbours,
		appointment_pagination: pagination,

		/**
		 * invoice List
		 */
		invoice_page_num: '',
		invoice_current_page: current_page,
		invoice_page_neighbours: page_neighbours,
		invoice_pagination: pagination,

		/**
		 * payment List
		 */
		payment_page_num: '',
		payment_current_page: current_page,
		payment_page_neighbours: page_neighbours,
		payment_pagination: pagination,

		/**
		 * Drag List
		 */
		dragList: '',

		/**
		 * Appointment Modal Info
		 */
		show_request: false,

		/**
		 * Appointment Edit Modal Info
		 */
		edit_show: false,
		itemAppt: '',
		provider: '',
		_id_provider: '',

		/**
		 * recent Document list
		 */
		document_list: '',
	};

	initial = () => {
		const {
			appointmentPaymentRequest,
			appointmentPaidRequest,
			getSimpleUsers,
			lastMessageList,
			getAppointmentList,
			getDocumentSharedWithMe,
		} = this.props;

		if(getSimpleUsers) {
			const role = {
				id: localStorage.client_id,
				role: 'patient',
				client_current_page: this.state.client_current_page,
				client_page_neighbours: this.state.client_page_neighbours,
				client_pagination: this.state.client_pagination,
			};
			getSimpleUsers(role);
		}

		if(lastMessageList) {
			const msg = {
				id: localStorage.client_id,
				message_current_page: current_page,
				message_page_neighbours: page_neighbours,
				message_pagination: pagination,
			};
			lastMessageList(msg);
		}

		if(getAppointmentList){
			const data = {
				flag: 1,
				role: 'client',
				id: localStorage.client_id,
				appointment_current_page: this.state.appointment_current_page,
				appointment_page_neighbours: this.state.appointment_page_neighbours,
				appointment_pagination: this.state.appointment_pagination,
			};
			getAppointmentList(data);
		}

		if(appointmentPaymentRequest){
			const data_invoice = {
				id: localStorage.client_id,
				current_page: this.state.invoice_current_page,
				page_neighbours: this.state.invoice_page_neighbours,
				pagination: this.state.invoice_pagination,
				state: 1,
			};
			appointmentPaymentRequest(data_invoice);
		}

		if(appointmentPaidRequest){
			const data_history = {
				id: localStorage.client_id,
				history_current_page: this.state.payment_current_page,
				history_page_neighbours: this.state.payment_page_neighbours,
				history_pagination: this.state.payment_pagination,
			};
			appointmentPaidRequest(data_history);
		}

		/**
		 * Drag List
		 */
		const {
			getDragList,
		} = this.props;

		if(getDragList) {
			const data = {
				id: localStorage.client_id,
				role: 'client',
			};

			getDragList(data);
		}

		/**
		 * document list
		 */
		if(getDocumentSharedWithMe) {
			const document_data = {
				id: localStorage.client_id,
			};
			getDocumentSharedWithMe(document_data);
		}

		/**
		 * Get Client info
		 */
		const {
			getPhotoByIdRole,
		} = this.props;
		if(getPhotoByIdRole) {
			const data = {
				id: localStorage.client_id,
				role: 'client',
			};
			getPhotoByIdRole(data);
		}
	};

	componentDidMount(){
		this.initial();

		this.setState({
			curTime: new Date().toLocaleTimeString([], {
				year: 'numeric',
				month: 'long',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit'
			}),
			todayDate: this.state.weekday[this.state.dd.getDay()],
		})
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if (this.props.clientInfo && this.props.clientInfo !== prevProps.clientInfo) {
			if(this.props.clientInfo.first_login === null || this.props.clientInfo.first_login === 0) {
				this.setState({
					show_first_modal: true,
				})
			}
		}
		if(this.props.msg_accept && this.props.msg_accept !== prevProps.msg_accept) {
			toast(this.props.msg_accept);

			const {
				reset
			} = this.props;
			clearTimeout(this.tmr);
			this.tmr = setTimeout(function () {
				reset();
				this.tmr = null;
				window.location.href = "/dashboard";
			}, 2500);
		}
		if(this.props.get_recent_document && this.props.get_recent_document !== prevProps.get_recent_document) {
			this.setState({
				document_list: this.props.get_recent_document,
			});
		}
		if(this.props.appointmentPaymentList && this.props.appointmentPaymentList !== prevProps.appointmentPaymentList){
			this.setState({
				invoiceList: this.props.appointmentPaymentList.list,
				invoice_page_num: this.props.appointmentPaymentList.page_num,
			})
		}
		if(this.props.paidAppointmentList && this.props.paidAppointmentList !== prevProps.paidAppointmentList){
			this.setState({
				paidList: this.props.paidAppointmentList.list,
				payment_page_num: this.props.paidAppointmentList.page_num,
			})
		}
		if(this.props.userList && this.props.userList !== prevProps.userList) {
			this.setState({
				providerList: this.props.userList.list,
				provider_page_num: this.props.userList.page_num,
			})
		}
		if(this.props.lastMessagesList && this.props.lastMessagesList !== prevProps.lastMessagesList) {
			this.setState({
				messageList: this.props.lastMessagesList.list,
				message_page_num: this.props.lastMessagesList.page_num,
			});
		}
		if(prevProps.appointmentList !== this.props.appointmentList || this.state.flag !== prevState.flag){
			this.setState({
				appointmentList: this.props.appointmentList.list,
				appointment_page_num: this.props.appointmentList.page_num,
			})
		}

		if(this.props.getDragLists && this.props.getDragLists !== prevProps.getDragLists) {
			this.setState({
				dragList: this.props.getDragLists,
			});
		}
	}

	onAccept = (key) => {
		const {
			appointmentAccept,
		} = this.props;

		const data = {
			id: key,
		};
		if(appointmentAccept){
			appointmentAccept(data);
		}
		this.initial();
	};

	onCancel = (key) => {
		const {
			appointmentCancel,
		} = this.props;
		const data = {
			id: key,
		};
		if(appointmentCancel){
			appointmentCancel(data);
		}
		this.initial();
	};
	onPay = (pay_info) => {
		this.setState({
			pay_info: pay_info,
			shown_pay_popup: true,
		})
	};
	hidePayPopup = () => {
		this.setState({
			shown_pay_popup: false,
		})
	};
	onProviderPageClick = (item) => {
		this.setState({
			client_current_page: item,
		});
		const {
			getSimpleUsers
		} = this.props;
		const data = {
			id: localStorage.client_id,
			role: 'patient',
			client_current_page: item,
			client_page_neighbours: this.state.client_page_neighbours,
			client_pagination: this.state.client_pagination,
		};
		if(getSimpleUsers) {
			getSimpleUsers(data);
		}
	};
	onAppointmentPageClick = (item) => {
		this.setState({
			appointment_current_page: item,
		});
		const {
			getAppointmentList
		} = this.props;
		const data = {
			role: 'client',
			id: localStorage.client_id,
			flag: this.state.flag,
			appointment_current_page: item,
			appointment_page_neighbours: this.state.appointment_page_neighbours,
			appointment_pagination: this.state.appointment_pagination,
		};

		if(getAppointmentList) {
			getAppointmentList(data);
		}
	};
	onInvoicePageClick = (item) => {
		const  {
			appointmentPaymentRequest
		} = this.props;

		this.setState({
			invoice_current_page: item,
		});
		const data_invoice = {
			id: localStorage.client_id,
			current_page: item,
			page_neighbours: this.state.invoice_page_neighbours,
			pagination: this.state.invoice_pagination,
			state: 1,
		};

		if(appointmentPaymentRequest){
			appointmentPaymentRequest(data_invoice);
		}
	};
	onPaidPageClick = (item) => {
		const  {
			appointmentPaidRequest
		} = this.props;
		this.setState({
			payment_current_page: item,
		});
		const data_history = {
			id: localStorage.client_id,
			history_current_page: item,
			history_page_neighbours: this.state.payment_page_neighbours,
			history_pagination: this.state.payment_pagination,
		};
		if(appointmentPaidRequest){
			appointmentPaidRequest(data_history);
		}
	};
	onMessagePageClick = (item) => {
		this.setState({
			message_current_page: item,
		});
		const {
			lastMessageList
		} = this.props;
		const data = {
			id: localStorage.client_id,
			message_current_page: item,
			message_page_neighbours: this.state.message_page_neighbours,
			message_pagination: this.state.message_pagination,
		};
		if (lastMessageList) {
			lastMessageList(data);
		}
	};
	onDay = () => {
		const {
			getAppointmentList
		} = this.props;
		this.setState({
			appointment_current_page: 1,
			flag: 1,
		});
		if(getAppointmentList){
			const data = {
				role: 'client',
				id: localStorage.client_id,
				flag: 1,
				appointment_current_page: 1,
				appointment_page_neighbours: this.state.appointment_page_neighbours,
				appointment_pagination: this.state.appointment_pagination,
			};
			getAppointmentList(data);
		}
	};
	onWeek = () => {
		const {
			getAppointmentList
		} = this.props;
		this.setState({
			appointment_current_page: 1,
			flag: 2,
		});
		if(getAppointmentList){
			const data = {
				role: 'client',
				id: localStorage.client_id,
				flag: 2,
				appointment_current_page: 1,
				appointment_page_neighbours: this.state.appointment_page_neighbours,
				appointment_pagination: this.state.appointment_pagination,
			};
			getAppointmentList(data);
		}
	};
	onMonth = () => {
		const {
			getAppointmentList
		} = this.props;
		this.setState({
			appointment_current_page: 1,
			flag: 3,
		});
		if(getAppointmentList){
			const data = {
				role: 'client',
				id: localStorage.client_id,
				flag: 3,
				appointment_current_page: 1,
				appointment_page_neighbours: this.state.appointment_page_neighbours,
				appointment_pagination: this.state.appointment_pagination,
			};
			getAppointmentList(data);
		}
	};
	onRequested = () => {
		const {
			getAppointmentList
		} = this.props;
		this.setState({
			appointment_current_page: 1,
			flag: 5,
		});
		if(getAppointmentList){
			const data = {
				role: 'client',
				id: localStorage.client_id,
				flag: 5,
				appointment_current_page: 1,
				appointment_page_neighbours: this.state.appointment_page_neighbours,
				appointment_pagination: this.state.appointment_pagination,
			};
			getAppointmentList(data);
		}
	};
	join = (url) => {
		window.location.href = url;
	};

	showModal = () => {
		if (localStorage.getItem('client') === 'true') {
			this.setState({
				show_request: true,
			});
		}
	};
	hideModal = () => {
		this.setState({show_request: false,});
	};

	/**
	 * Edit Appointment Modal
	 */
	showEditModal = (item, provider_list, _id_provider) => {
		if (localStorage.getItem('client') === 'true') {
			this.setState({
				edit_show: true,
				itemAppt: item,
				provider: provider_list,
				_id_provider: _id_provider,
			});
		}
	};

	hideEditModal = () => {
		this.setState({
			edit_show: false,
			itemAppt: '',
			provider: '',
		});
	};

	hideFirstModal = () => {
		this.setState({
			show_first_modal: false,
		})
	};

	render(){
		let providerPageArray = [];
		let appointmentPageArray = [];
		let invoice_pageArray = [];
		let payment_pageArray = [];
		const messagePageArray = [];

		if(this.state.provider_page_num) {
			for (let k = this.state.provider_page_num.start_page; k <= this.state.provider_page_num.end_page; k ++) {
				providerPageArray.push(k);
			}
		}
		if(this.state.appointment_page_num) {
			for (let k = this.state.appointment_page_num.start_page; k <= this.state.appointment_page_num.end_page; k ++) {
				appointmentPageArray.push(k);
			}
		}
		if(this.state.invoice_page_num) {
			for (let k = this.state.invoice_page_num.start_page; k <= this.state.invoice_page_num.end_page; k ++) {
				invoice_pageArray.push(k);
			}
		}
		if(this.state.payment_page_num) {
			for (let k = this.state.payment_page_num.start_page; k <= this.state.payment_page_num.end_page; k ++) {
				payment_pageArray.push(k);
			}
		}
		if (this.state.message_page_num) {
			for (let k = this.state.message_page_num.start_page; k <= this.state.message_page_num.end_page; k++) {
				messagePageArray.push(k);
			}
		}

		return (
			<>
				{
					this.state.shown_pay_popup ? (
						<InjectedStripePopup payInfo={this.state.pay_info} handleHidePopup={this.hidePayPopup}/>
					) : null
				}

				<ToastContainer />
				<div className="flex-space appointment">
					<div
						className=" txt-22 col-darkBlue">Hi, {localStorage.getItem('client') === 'true' ? localStorage.getItem('client_name') : 'Clients'}.
					</div>
					<div className="txt-16 col-heavyDark">{this.state.todayDate}, {this.state.curTime}</div>
					<div
						className="btn-common request justify-center col-white txt-16 mouse-cursor"
						onClick={this.showModal}
					>
						Request Appointment
					</div>
				</div>

				<div className="pt-20 pb-30 flex-grid2 list-gaps2">
					{
						this.state.dragList && this.state.dragList.map((item, key) => {
							return (
								<div className="table-common">
									{
										item['title'].toLowerCase() === "provider list" && (
											<div>
												<div className="patient-header justify-center col-white">
													Provider List
												</div>

												<div className="table-dash txt-14" style={{marginTop: 30}}>
													<div className="table-border table-max">
														<table id="tAppt" cellSpacing={0}>
															<thead>
															<tr>
																<th style={{textAlign: 'left'}}>No</th>
																<th style={{textAlign: 'left'}}>Name</th>
																<th style={{textAlign: 'left'}}>Email</th>
																<th style={{textAlign: 'left'}}>Phone Number</th>
															</tr>
															</thead>
															<tbody>
															{
																this.state.providerList && this.state.providerList.map((item, key) => {
																	let display_phone = '';
																	if(item.phone) {
																		let phone = (item.phone).toString();
																		for (let k = 0; k < phone.length; k ++) {
																			let m = phone.slice(k,k + 1);
																			if (k === 3 || k === 6) {
																				m = "-" + m;
																			}
																			display_phone += m;
																		}
																	}
																	return (
																		<tr key={key}>
																			<td>{key + 1}</td>
																			<td>{item.name}</td>
																			<td>{item.email}</td>
																			<td>{item.phone && display_phone}</td>
																		</tr>
																	)
																})
															}
															</tbody>
														</table>
													</div>

													<div className="pt-30 justify-center">
														<div className="product-btn table justify-center" onClick={() => this.onProviderPageClick(1)}>
															<svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z" fill="black" fillOpacity="0.65"/>
															</svg>
														</div>

														{
															this.state.provider_page_num && providerPageArray && providerPageArray.map((item, key) => {
																return (
																	<div
																		className={this.state.client_current_page && this.state.client_current_page === item ? "product-btn table justify-center btn-search": "product-btn table justify-center col-darkBlue"}
																		key={key}
																		onClick={() => this.onProviderPageClick(item)}
																	>
																		{item}
																	</div>
																)
															})
														}

														<div className="product-btn table justify-center" onClick={() => this.onProviderPageClick(this.state.provider_page_num.total_page)}>
															<svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z" fill="black" fillOpacity="0.65"/>
															</svg>
														</div>
													</div>
												</div>
											</div>
										)
									}

									{
										item['title'].toLowerCase() === "message center" && (
											<div>
												<Link to="/view-messages" className="message-header justify-center col-white">
													Message Center
												</Link>

												<div className="table-dash message-scroll txt-14">
													<div className="table-list"
														 style={{padding: 10}}>
														{
															this.state.messageList && this.state.messageList.map((item, key) => {
																const path = "/view-messages/" + item.id;
																return (
																	<Link to={path} className="messaging flex-space messages col-darkBlue mouse-cursor" key={key}>
																		<div className="justify-left">
																			<img className="message-photo" src={item.photo? item.photo: require('../assets/img/account.svg')} alt="" />
																			<div className="name-pl">{item.name}</div>
																		</div>

																		<div className="">
																			<div className="col-disabled">{item.date}</div>
																			<div>{item.msg}</div>
																		</div>
																	</Link>
																)
															})
														}
													</div>

													<div className="pt-30 justify-center">
														<div className="product-btn table justify-center"
															 onClick={() => this.onMessagePageClick(1)}>
															<svg width="11" height="15" viewBox="0 0 11 15" fill="none"
																 xmlns="http://www.w3.org/2000/svg">
																<path
																	d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
																	fill="black" fillOpacity="0.65"/>
															</svg>
														</div>

														{
															this.state.message_page_num && messagePageArray && messagePageArray.map((item, key) => {
																return (
																	<div
																		className={this.state.message_current_page && this.state.message_current_page === item ? "product-btn table justify-center btn-search" : "product-btn table justify-center col-darkBlue"}
																		key={key}
																		onClick={() => this.onMessagePageClick(item)}
																	>
																		{item}
																	</div>
																)
															})
														}

														<div className="product-btn table justify-center"
															 onClick={() => this.onMessagePageClick(this.state.message_page_num.total_page)}>
															<svg width="11" height="15" viewBox="0 0 11 15" fill="none"
																 xmlns="http://www.w3.org/2000/svg">
																<path
																	d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
																	fill="black" fillOpacity="0.65"/>
															</svg>
														</div>
													</div>
												</div>
											</div>
										)
									}

									{
										item['title'].toLowerCase() === "document list" && (
											<div>
												<div  className="document-header justify-center col-white">
													Document List
												</div>

												<div className="table-dash message-scroll txt-14">
													<div className="table-list"
														 style={{padding: 10}}>
														{
															this.state.document_list && this.state.document_list.map((item, key) => {
																const path = "/documents/";
																return (
																	<div className="messaging flex-space messages col-darkBlue mouse-cursor" key={key}>
																		<div className="flex-space document-list">
																			<Link to={path}>
																				<div className="pt-5 col-heavyDark">{item.filename}</div>
																				<div className="col-darkBlue">{item.recipient[0].name} shared this document with you at
																					{
																						" " + new Date(item.shared_date).toLocaleDateString([], {
																							year: 'numeric',
																							month: 'long',
																							day: '2-digit',
																							hour: '2-digit',
																							minute: '2-digit',
																						})
																					}
																				</div>
																			</Link>
																			<a className="btn-upload download col-white mouse-cursor" href={item.path}>
																				<img className="attached-icon" src={require('../assets/img/download-solid.svg')}
																					 alt=""/> Download
																			</a>
																		</div>
																	</div>
																)
															})
														}
														{
															this.state.document_list && this.state.document_list.length === 0 && (
																<div className="txt-14">You have not shared a document yet</div>
															)
														}
													</div>
												</div>
											</div>
										)
									}

									{
										item['title'].toLowerCase() === "payment list" && (
											<div>
												<Link to="/payments-history" className="payment-header justify-center col-white">
													Payment List
												</Link>

												<div className="table-dash txt-14" style={{marginTop: 30}}>
													<div className="table-border table-max">
														{
															this.state.paidList && this.state.paidList.length === 0 && (
																<div className="pb-20 txt-14">You do not have any payment history. Click the create button above and to the
																	right to get started.</div>
															)
														}
														<table id="payment-action" cellSpacing={0}>
															<thead>
															<tr className="head-border align-l col-black">
																<th>No</th>
																<th>Date</th>
																<th>Paid To</th>
																<th>Amount</th>
																<th>Date Paid</th>
																<th>Type</th>
															</tr>
															</thead>

															<tbody id="payment">
															{
																this.state.paidList && this.state.paidList.map((item, key) => {
																	return (
																		<tr key={key}>
																			<td>{key + 1}</td>
																			<td>
																				{
																					item.session_date && new Date(item.session_date).toLocaleDateString([], {
																						year: 'numeric',
																						month: 'long',
																						day: '2-digit',
																						hour: '2-digit',
																						minute: '2-digit',
																					})
																				}
																			</td>
																			<td>
																				{item.providerInfo[0].name}
																			</td>
																			<td>
																				$ {item.payment}
																			</td>
																			<td>
																				{
																					item.payment === 0?
																						new Date(item.requested_date).toLocaleDateString([], {
																							year: 'numeric',
																							month: 'long',
																							day: '2-digit',
																							hour: '2-digit',
																							minute: '2-digit',
																						})
																						:
																						item.paid_date && (
																							new Date(item.paid_date).toLocaleDateString([], {
																								year: 'numeric',
																								month: 'long',
																								day: '2-digit',
																								hour: '2-digit',
																								minute: '2-digit',
																							})
																						)
																				}
																			</td>
																			<td>
																				<div>
																					{
																						item.invite_client === true && "Requested"
																					}
																				</div>
																				<div>
																					{
																						item.appointment_type && item.appointment_type
																					}
																				</div>
																			</td>
																		</tr>
																	)
																})
															}
															</tbody>
														</table>
													</div>
													<div className="pt-30 justify-center">
														<div className="product-btn table justify-center" onClick={() => this.onPaidPageClick(1)}>
															<svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z" fill="black" fillOpacity="0.65"/>
															</svg>
														</div>
														{
															this.state.payment_current_page && payment_pageArray && payment_pageArray.map((item, key) => {
																return (
																	<div
																		className={this.state.payment_current_page && this.state.payment_current_page === item? "product-btn table justify-center btn-search": "product-btn table justify-center col-darkBlue"}
																		key={key}
																		onClick={() => this.onPaidPageClick(item)}
																	>
																		{item}
																	</div>
																)
															})
														}

														<div
															className="product-btn table justify-center"
															onClick={() => this.onPaidPageClick(this.state.payment_page_num && this.state.payment_page_num.total_page
															)}
														>
															<svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z" fill="black" fillOpacity="0.65"/>
															</svg>
														</div>
													</div>
												</div>
											</div>
										)
									}

									{
										item['title'].toLowerCase() === "invoice list" && (
											<div>
												<Link to="/payments" className="invoice-header justify-center col-white">
													Invoice List
												</Link>

												<div className="table-dash txt-14" style={{marginTop: 30}}>
													<div className="table-border table-max">
														{
															this.state.invoiceList && this.state.invoiceList.length === 0 && (
																<div className="pb-20 txt-14" style={{paddingTop: 10}}>You do not have any outstanding payment requests. Click the create button above
																	and to the right to get started.</div>
															)
														}
														<table id="payment-action" cellSpacing={0}>
															<thead>
															<tr className="head-border align-l col-black">
																<th>No</th>
																<th>Start date</th>
																<th>Requested By</th>
																<th>Amount</th>
																<th>Date Requested</th>
																<th className="align-center">Type</th>
																<th className="align-center">Action</th>
															</tr>
															</thead>

															<tbody id="payment">
															{
																this.state.invoiceList && this.state.invoiceList.map((item, key) => {
																	return !(item.state === 3) ? (
																		<tr key={key}>
																			<td>{key + 1}</td>
																			<td>
																				<div>
																					{
																						new Date(item.start_time).toLocaleDateString([], {
																							year: 'numeric',
																							month: 'long',
																							day: '2-digit',
																							hour: '2-digit',
																							minute: '2-digit',
																						})
																					}
																				</div>
																			</td>
																			<td>
																				{item.providerInfo[0].name}
																			</td>
																			<td>
																				$ {item.payment}
																			</td>
																			<td>
																				{
																					new Date(item.requested_date).toLocaleDateString([], {
																						year: 'numeric',
																						month: 'long',
																						day: '2-digit',
																						hour: '2-digit',
																						minute: '2-digit',
																					})
																				}
																			</td>
																			<td className="align-center">
																				{/*{item.state === 2 ? (*/}
																				{/*	<img src={require('../assets/img/icon-check.svg')} alt=""/>*/}
																				{/*) : null}*/}
																				{
																					item.appointment_type && item.appointment_type
																				}
																			</td>
																			<td>
																				<div className="edit-btn pay-col col-white align-center mouse-cursor"
																					 onClick={() => this.onPay({
																						 appointment_id: item._id,
																						 provider_id: item.provider_id,
																						 provider_name: item.providerInfo[0].name,
																						 start_time: item.start_time,
																						 end_time: item.end_time,
																						 amount: item.payment * 100,
																					 })}>
																					Pay
																				</div>
																			</td>
																		</tr>
																	) : null
																})
															}
															</tbody>
														</table>
													</div>

													<div className="pt-30 justify-center">
														<div className="product-btn table justify-center" onClick={() => this.onInvoicePageClick(1)}>
															<svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z" fill="black" fillOpacity="0.65"/>
															</svg>
														</div>
														{
															this.state.invoice_current_page && invoice_pageArray && invoice_pageArray.map((item, key) => {
																return (
																	<div
																		className={this.state.invoice_current_page && this.state.invoice_current_page === item? "product-btn table justify-center btn-search": "product-btn table justify-center col-darkBlue"}
																		key={key}
																		onClick={() => this.onInvoicePageClick(item)}
																	>
																		{item}
																	</div>
																)
															})
														}

														<div
															className="product-btn table justify-center"
															onClick={() => this.onInvoicePageClick(this.state.invoice_page_num && this.state.invoice_page_num.total_page
															)}
														>
															<svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z" fill="black" fillOpacity="0.65"/>
															</svg>
														</div>
													</div>
												</div>
											</div>
										)
									}

									{
										item['title'].toLowerCase() === "appointment list" && (
											<div>
												<Link className="request-header justify-center col-white mouse-cursor" to="/appointment">
													Appointment List
												</Link>

												<div className="table-dash txt-14">
													<div className="pb-20 justify-left list col-white">
														<div className={this.state.flag === 1? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"} onClick={this.onDay}>Day</div>
														<div className={this.state.flag === 2? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"} onClick={this.onWeek}>Week</div>
														<div className={this.state.flag === 3? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"} onClick={this.onMonth}>Month</div>
														<div className={this.state.flag === 5 ? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"} onClick={this.onRequested}>Requested
														</div>
													</div>

													<div className="appointment-list" style={{overflowX: 'auto'}}>
														{
															this.state.appointmentList && this.state.appointmentList.map((item, key) => {
																const path = '/client-session/' + item._id;
																const pathRoom = '/room/' + item._id;
																let provider_list = '', id_provider;
																if(item.providerInfo && item.providerInfo[0] && item.providerInfo[0].name) {
																	provider_list += item.providerInfo[0].name;
																	id_provider = item.providerInfo[0]._id;
																}
																return (
																	<div
																		className={
																			item.state === 6?
																				"expiration list-p flex-space txt-14"
																				:
																				key % 2 === 0? "even-bg list-p flex-space txt-14" : "list-p flex-space txt-14"

																		}
																		key={key}
																	>
																		<div onClick={() => this.showEditModal(item, provider_list, id_provider)} className="mouse-cursor">
																			<div className="justify-left col-darkBlue">
																				<div className="time-p justify-center">
																					{
																						item.state === 1 && (
																							<img src={require('../assets/img/appointment-creating.svg')} alt="" />
																						)
																					}

																					{
																						item.state === 2 && (
																							<img src={require('../assets/img/appointment-accepting.svg')} alt="" />
																						)
																					}

																					{
																						(item.state === 3 || item.state === 31 || item.state === 32 || item.state === 4) && (
																							<img src={require('../assets/img/appointment-paying.svg')} alt="" />
																						)
																					}

																					{
																						item.state === 5 && (
																							<img src={require('../assets/img/appointment-finishing.svg')} alt="" />
																						)
																					}

																					{
																						item.state === 6 && (
																							<img src={require('../assets/img/appointment-expiration.svg')} alt="" />
																						)
																					}
																				</div>
																				<div>
																					{
																						new Date(item.start_time).toLocaleDateString([], {
																							month: 'long',
																							day: '2-digit',
																							hour: '2-digit',
																							minute: '2-digit',
																						})
																					}
																				</div>
																				<div className="time-p col-disabled">
																					{
																						Number(item.time_distance) === 0
																							?
																							'All Day'
																							:
																							(Number(item.time_distance) >= 60
																									?
																									Math.floor(Number(item.time_distance) / 60) + ' hours ' + Number(item.time_distance) % 60
																									:
																									Number(item.time_distance) % 60
																							) + ' minutes'
																					}
																					{
																						item.online ? ", online" : ""
																					}
																				</div>
																				<div className="time-p">{item.payment} USD</div>
																				<div className="col-blue">{item.providerInfo[0].name}</div>
																				<div className="col-paragraphBg" style={{paddingLeft: 10, paddingRight: 10}}>
																					{ item.invite_client === true && " Requested " }
																					{
																						item.appointment_type && " " + item.appointment_type
																					}
																				</div>
																			</div>
																		</div>

																		<div>
																			{
																				item.state === 1 && (item.role_updated === "client" || (item.role_updated === undefined && item.invite_client === true)) && (
																					<div
																						className="hover-wait btn-join col-white align-center mouse-cursor"
																						onClick={() => this.join(item.start_time, item.end_time, path)}>
																						Created
																					</div>
																				)
																			}
																			{
																				item.state === 1 && (item.role_updated === "provider" || (item.role_updated === undefined && item.invite_client !== true))&& (
																					<div className="">
																						<div className="btn-small justify-center col-selected-bg txt-14 mouse-cursor"
																							 onClick={() => this.onAccept(item._id)}>
																							Approve
																						</div>
																						<div className="btn-deleting justify-center col-paragraphBg txt-14 mouse-cursor"
																							 onClick={() => this.onCancel(item._id)}>
																							Decline
																						</div>
																					</div>
																				)
																			}
																			{
																				item.state === 2 && (
																					//<div className="edit-btn pay-col col-white align-center mouse-cursor"
																					//  onClick={() => this.onPay({
																					// 	 appointment_id: item._id,
																					// 	 provider_id: item.provider_id,
																					// 	 provider_name: item.providerInfo[0].name,
																					// 	 start_time: item.start_time.realTime,
																					// 	 end_time: item.end_time.realTime,
																					// 	 amount: item.payment * 100,
																					//  })}>
																					// Pay
																					//>
																					<div className="btn-expiration">
																						Accepted
																					</div>
																				)
																			}
																			{
																				item.state === 31 && (
																					<div className="btn-join col-white align-center mouse-cursor" onClick={() => this.join(path)}>
																						Join
																					</div>
																				)
																			}
																			{
																				item.state === 32 && (
																					<div className="btn-join col-white align-center mouse-cursor" onClick={() => this.join(path)}>
																						Start
																					</div>
																				)
																			}
																			{
																				item.state === 3 && (
																					<div className="btn-join hover-wait col-white align-center mouse-cursor" onClick={() => this.join(path)}>
																						Wait
																					</div>
																				)
																			}
																			{
																				item.state === 4 && (
																					<div className="btn-join col-white align-center mouse-cursor" onClick={() => this.join(pathRoom)}>
																						Progressing
																					</div>
																				)
																			}
																			{
																				item.state === 5 && (
																					<div className="btn-expiration">Finished</div>
																				)
																			}
																			{
																				item.state === 6 && (
																					<div className="btn-expiration">Expiration</div>
																				)
																			}
																		</div>
																	</div>
																)
															})
														}
													</div>

													<div className="pt-30 justify-center">
														<div className="product-btn table justify-center" onClick={() => this.onAppointmentPageClick(1)}>
															<svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z" fill="black" fillOpacity="0.65"/>
															</svg>
														</div>

														{
															this.state.appointment_page_num && appointmentPageArray && appointmentPageArray.map((item, key) => {
																return (
																	<div
																		className={this.state.appointment_current_page && this.state.appointment_current_page === item? "product-btn table justify-center btn-search": "product-btn table justify-center col-darkBlue"}
																		key={key}
																		onClick={() => this.onAppointmentPageClick(item)}
																	>
																		{item}
																	</div>
																)
															})
														}

														<div className="product-btn table justify-center" onClick={() => this.onAppointmentPageClick(this.state.appointment_page_num.total_page)}>
															<svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z" fill="black" fillOpacity="0.65"/>
															</svg>
														</div>
													</div>
												</div>
											</div>
										)
									}
								</div>
							)
						})
					}
				</div>

				<DashboardCreateAppointment
					show={this.state.show_request}
					handleClose={this.hideModal}
				/>
				{/*  Modal  */}
				<EditAppointment
					itemAppt={this.state.itemAppt}
					edit_show={this.state.edit_show}
					provider={this.state.provider}
					provider_id={this.state._id_provider}
					handleClose={this.hideEditModal}
				/>
				<FirstModal
					show={this.state.show_first_modal}
					handleClose={this.hideFirstModal}
				/>
			</>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		appointmentPaymentList: state.registers.appointmentPaymentList,
		paidAppointmentList: state.registers.paidAppointmentList,

		msg_accept: state.registers.msg_accept,
		msg_cancel: state.registers.msg_cancel,
		error_message: state.registers.error_message,

		userList: state.registers.userList,
		lastMessagesList: state.registers.lastMessagesList,
		appointmentList: state.registers.appointmentList,
		getDragLists: state.registers.getDragLists,
		get_recent_document: state.registers.get_recent_document,

		clientInfo: state.registers.clientInfo,
	}
};

export default connect(
	mapStateToProps,
	{
		appointmentPaymentRequest,
		appointmentPaidRequest,
		appointmentAccept,
		appointmentCancel,
		getSimpleUsers,
		lastMessageList,
		getAppointmentList,
		getDragList,
		getDocumentSharedWithMe,
		reset,
		getPhotoByIdRole,
	}
)(Dashboard);