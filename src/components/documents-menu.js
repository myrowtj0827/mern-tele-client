import React, {Component} from 'react';
import {Link} from "react-router-dom";
import '../assets/css/documents.css';
import {
	getDocumentRecipients,
	getDocumentSenders,
} from "../redux/actions/register/documents";

import {connect} from "react-redux";
import Config from "../config/index";

class DocumentsMenu extends Component{
	constructor(){
		super();

		this.state = {
			arrayDocumentRecipients: [],
			arrayDocumentSenders: [],

			selectedBtn: 1,
			flag_nobody: 1,
		}
	}

	componentDidMount(){
		if(window.location.pathname === '/documents'){
			this.setState({
				selectedBtn: 1,
			})
		}
		else if(window.location.pathname === '/documents-mydoc'){
			this.setState({
				selectedBtn: 2,
			})
		}
		else if(window.location.pathname === '/documents-shared'){
			this.setState({
				selectedBtn: 3,
			})
		}

		const {
			getDocumentRecipients,
			getDocumentSenders,
		} = this.props;

		if(getDocumentRecipients){
			getDocumentRecipients();
		}

		if(getDocumentSenders){
			getDocumentSenders();
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(this.props.recipientList && prevProps.recipientList !== this.props.recipientList){
			this.setState({
				arrayDocumentRecipients: this.props.recipientList,
			});
		}

		if(this.props.senderList && prevProps.senderList !== this.props.senderList){
			this.setState({
				arrayDocumentSenders: this.props.senderList,
			});
		}
	}

	render(){
		return (
			<>
				<div className="pt-20">
					<div className="flex-document documentMenu txt-14 col-disabled-shown">
						<Link to="/documents">
							<div
								className={this.state.selectedBtn === 1 ? "menuSelected menu-documents" : "menu-documents"}
							>
								Shared with me
							</div>
						</Link>
						<Link to="/documents-mydoc">
							<div
								className={this.state.selectedBtn === 2 ? "menuSelected menu-documents" : "menu-documents"}
							>
								Owned by me
							</div>
						</Link>
						<Link to="/documents-shared">
							<div
								className={this.state.selectedBtn === 3 ? "menuSelected menu-documents" : "menu-documents"}
							>
								Shared by TeleTherapist
							</div>
						</Link>
					</div>
				</div>

				<div className="documents-card txt-14">
					{
						this.state.selectedBtn === 1 && (this.state.arrayDocumentSenders && this.state.arrayDocumentSenders.map((item, Keys) => {
							return item.role === 'provider' && item.recipient_id === localStorage.client_id ? (
								<div key={Keys}>
									<div className="flex-space">
										<div>
											<div className="pt-5 col-heavyDark">{item.filename} shared with <span
												className="col-darkBlue">{item.sender[0].name}</span>.
											</div>
										</div>
										<a className="btn-upload download col-white mouse-cursor" href={item.path}>
											<img className="attached-icon" src={require('../assets/img/download-solid.svg')}
													 alt=""/> Download
										</a>
									</div>

									<hr/>
								</div>
							) : null
						}))
					}

					{
						this.state.selectedBtn === 1 && (this.state.arrayDocumentSenders.length === 0 &&
							<div className="txt-14">Nobody has shared a document with you yet.</div>
						)
					}

					{
						this.state.selectedBtn === 2 && (this.state.arrayDocumentRecipients && this.state.arrayDocumentRecipients.map((item, Key) => {
							return item.role === 'client' && item.sender_id === localStorage.client_id ? (
								<div key={Key}>
									<div className="flex-space">
										<div>
											<div className="pt-5 col-heavyDark">{item.filename}<span
												className="col-darkBlue"> shared with {item.recipient[0].name}</span>.
											</div>
										</div>
										<a className="btn-upload download col-white mouse-cursor" href={item.path}>
											<img className="attached-icon" src={require('../assets/img/download-solid.svg')}
													 alt=""/> Download
										</a>
									</div>
									<hr/>
								</div>
							) : null
						}))
					}

					{
						this.state.selectedBtn === 2 && (this.state.arrayDocumentRecipients.length === 0 &&
							<div className="txt-14">You have not shared a document yet. Use the panel above to get started.</div>
						)
					}

					{
						this.state.selectedBtn === 3 && (
							<div className="txt-14">
								<div className="flex-space">
									<div>
										<div className="col-darkBlue">Client Information Template</div>
										<div className="pt-5 col-heavyDark">Contains basic client information for first time clients.</div>
									</div>

									<a className="btn-upload download col-white mouse-cursor" href={Config.SIM_API_URL + 'help/1.pdf'}>
										<img className="attached-icon" src={require('../assets/img/download-solid.svg')} alt=""/> Download
									</a>
								</div>

								<hr/>

								<div className="flex-space">
									<div>
										<div className="col-darkBlue">Client Information Template</div>
										<div className="pt-5 col-heavyDark">Contains basic client information for first time clients.</div>
									</div>

									<a className="btn-upload download col-white mouse-cursor" href={Config.SIM_API_URL + 'help/2.pdf'}>
										<img className="attached-icon" src={require('../assets/img/download-solid.svg')} alt=""/> Download
									</a>
								</div>

								<hr/>

								<div className="flex-space">
									<div>
										<div className="col-darkBlue">Client Information Template</div>
										<div className="pt-5 col-heavyDark">Contains basic client information for first time clients.</div>
									</div>

									<a className="btn-upload download col-white mouse-cursor" href={Config.SIM_API_URL + 'help/4.jpg'}>
										<img className="attached-icon" src={require('../assets/img/download-solid.svg')} alt=""/> Download
									</a>
								</div>
							</div>
						)
					}
				</div>
			</>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		recipientList: state.registers.recipientList,
		senderList: state.registers.senderList,
	}
};

export default connect(
	mapStateToProps,
	{
		getDocumentRecipients,
		getDocumentSenders,
	}
)(DocumentsMenu);

