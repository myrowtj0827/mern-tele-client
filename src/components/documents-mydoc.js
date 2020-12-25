import React, {Component} from 'react';
import {getSimpleProviders} from "../redux/actions/register/client-register";
import {
	ShareDocument,
	reset,
} from "../redux/actions/register/documents";
import StyledDropzone from "./dropFile";

import '../assets/css/documents.css';
import DocumentsMenu from "./documents-menu";
import {connect} from "react-redux";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class DocumentsMydoc extends Component{
	constructor(){
		super();
		this.tmr = null;
		this.state = {
			arrayList: [],

			role: 'client',
			sender_id: localStorage.client_id,
			recipient_id: '',
			sender_name: localStorage.client_name,
			documents: [],
			filename: '',
		}
	}

	componentDidMount(){
		const {
			getSimpleProviders
		} = this.props;

		if(getSimpleProviders){
			getSimpleProviders({
				id: localStorage.client_id,
				role: 'provider',
			});
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevState.arrayList !== this.state.arrayList){
			this.setState({
				recipient_id: this.state.arrayList[0]._id,
			});
		}

		if(prevProps.providerIdList !== this.props.providerIdList){
			this.setState({
				arrayList: this.props.providerIdList,
			});
		}

		if(this.props.msg_share && this.props.msg_share !== prevProps.msg_share) {
			toast(this.props.msg_share);

			const {
				reset
			} = this.props;
			clearTimeout(this.tmr);
			this.tmr = setTimeout(function () {
				reset();
				this.tmr = null;
			}, 4000);
		}
	}

	handleChange = (key, e) => {
		const value = e.target.value;
		const {documents} = this.state;
		const temp = JSON.parse(JSON.stringify(documents));
		temp[key]['id'] = value;
		this.setState({documents: temp});
	};

	shareWith = (url, id) => {
		const {
			ShareDocument
		} = this.props;
		if(ShareDocument && url){
			if(this.state.arrayList){
				const {arrayList} = this.state;
				const temp = JSON.parse(JSON.stringify(arrayList));
				this.setState({documents: temp});
			}

			const data = {
				role: this.state.role,
				sender_id: this.state.sender_id,
				recipient_id: id,
				path: url,
				filename: this.state.filename,
			};
			ShareDocument(data);

			const {documents} = this.state;
			const temp = JSON.parse(JSON.stringify(documents));
			let p = 0;

			for(let k = 0; k < temp.length; k++){
				if(temp[k].url === url){
					p = k;
					break;
				}
			}
			delete temp.splice(p, 1);
			this.setState({documents: temp});
		}

		if(!url){
			toast("Please choose the file.");
		}
	};

	setFileUploadUrl = (url, name) => {
		if(url === 'Format'){
			this.warningNotify();
		}
		else{
			const {documents} = this.state;
			const temp = JSON.parse(JSON.stringify(documents));

			temp.push({url, id: this.state.recipient_id});
			this.setState({documents: temp});
		}

		this.setState({
			filename: name,
		})
	};

	deleteShare = (url) => {
		if(url){
			const {documents} = this.state;
			const temp = JSON.parse(JSON.stringify(documents));
			let p = 0;

			for(let k = 0; k < temp.length; k++){
				if(temp[k].url === url){
					p = k;
					break;
				}
			}
			delete temp.splice(p, 1);
			this.setState({documents: temp});
		}
	};

	render(){
		const {documents} = this.state;
		return (
			<>
				<ToastContainer/>
				<div className="documents-body">
					<div className="txt-24 col-black">Documents</div>
					<div className="documents-upload-p">
						<div className="flex-document cathy txt-14 justify-left">
							<div className="upload-card align-center">
								<img className="upload-icon" src={require('../assets/img/upload.svg')} alt=""/>

								<div className="document pt-20 pb-20 justify-center">
									<StyledDropzone func={this.setFileUploadUrl}/>
								</div>
								<div className="txt-12">File types accepted include: pdf, docx, txt</div>
							</div>
							<div id="shareWith">
								{
									documents && documents.map((doc, key) => (
										<div className="pt-10 flex-document share-cathy justify-center" key={key}>
											<div>
												<div className="processing flex-document">
													<div className="">
														<img className="attached-icon" src={require('../assets/img/attached.svg')} alt=""/>
													</div>

													<div className="pl-10">
														<div className="flex-document">
															<div>File.docx</div>
															<div className="processing-p">
																<div onClick={() => this.deleteShare(doc.url)}>
																	<img className="attached-icon mouse-cursor" src={require('../assets/img/times.svg')}
																			 alt=""/>
																</div>
															</div>
														</div>

														<div className="progress">
															<div className="progress-value">
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="btn-share txt-14 col-white" onClick={() => this.shareWith(doc.url, doc.id)}>Share
												with:
											</div>
											<select className="txt-14 col-black" value={doc.id} onChange={(e) => this.handleChange(key, e)}>
												{
													this.state.arrayList && this.state.arrayList.map((item, subKey) => {
														return item._id !== localStorage.client_id ? (
															<option key={'option' + subKey} value={item._id}>{item.name}</option>
														) : null
													})
												}
											</select>
										</div>
									))
								}
							</div>
						</div>
					</div>

					<DocumentsMenu/>
				</div>
			</>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		providerIdList: state.registers.providerIdList,
		msg_share: state.registers.msg_share,
	}
};

export default connect(
	mapStateToProps,
	{
		getSimpleProviders,
		ShareDocument,
		reset,
	}
)(DocumentsMydoc);
