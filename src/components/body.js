import React, {Component} from 'react';
import {Redirect, Switch} from "react-router-dom";

import Dashboard from "./dashboard";

import SettingsProfile from "./settings-profile";
import SettingsSecurity from "./settings-security";

import SideBar from "./sidebar";
import Header from "./header";
import Documents from "./documents";
import PrivateRoute from "./private-route";
import DocumentsMydoc from "./documents-mydoc";
import DocumentsShared from "./documents-shared";
import Published from "./articles-published";
import ArticleNew from "./article-new";
import ArticleDetails from "./article-details";
import Payments from "./payment";
import PaymentsMenu from "./payments-menu";
import PaymentsHistory from "./payments-history";
import ViewMessages from "./view-messages";
import Appointment from "./appointment";
import SettingsDrag from "./settings-drag";
import SettingsWaitingRoom from "./settings-waiting-room";
import Config from "../config/index";

/**
 * Chatbot
 */
import Chatbot from "react-chatbot-kit";
import configChat from "../chatbot/config";
import ActionProvider from "../chatbot/ActionProvider";
import MessageParser from "../chatbot/MessageParser";

import { chatDescription} from "../redux/actions/register/chatbot";
import {connect} from "react-redux";
import SettingsPractices from "./settings-practices";

class Body extends Component{
	constructor(props){
		super(props);

		this.state = {
			shown_side_menu: true,
			botVisible: false,
			page_id: false,
			get_reply: '',
		};
	}

	toggleSideMenu = () => {
		this.setState({shown_side_menu: !this.state.shown_side_menu});
	};

	onClickBot = () => {
		this.setState({
			botVisible: !this.state.botVisible,
		})
	};

	onClickBack = () => {
		const {
			chatDescription
		} = this.props;

		const data = {
			pageShown:  !this.props.description_page.pageShown,
			pageNumber: this.props.description_page.pageNumber,
		};
		if(chatDescription) {
			chatDescription(data);
		}
	};
	render(){
		return (
			<>
				<div className="flex-common">
					<div className="header-p phoneShown">
						<Header shownSideMenu={this.state.shown_side_menu}
								toggleSideMenu={this.toggleSideMenu}/>
					</div>
					<div className={`sidebar-width txt-16 col-white ${this.state.shown_side_menu ? '' : 'collapse'}`}>
						<SideBar/>
					</div>

					<div className={`body-width ${this.state.shown_side_menu ? '' : 'collapse'}`}>
						<div className="header-p tabletShown">
							<Header shownSideMenu={this.state.shown_side_menu}
									toggleSideMenu={this.toggleSideMenu}/>
						</div>

						<div className="body-p">
							<Switch>
								<PrivateRoute
									path='/dashboard'
									component={Dashboard}
								/>

								<PrivateRoute
									path='/settings-profile'
									component={SettingsProfile}
								/>
								<PrivateRoute
									path='/settings-security'
									component={SettingsSecurity}
								/>
								<PrivateRoute
									path='/settings-practices'
									component={SettingsPractices}
								/>
								<PrivateRoute
									path="/settings-drag"
									component={SettingsDrag}
								/>
								<PrivateRoute
									path='/settings-waiting'
									component={SettingsWaitingRoom}
								/>

								<PrivateRoute
									path='/view-messages/:id?'
									component={ViewMessages}
								/>

								<PrivateRoute
									path='/payments'
									component={Payments}
								/>
								<PrivateRoute
									path='/payments-menu'
									component={PaymentsMenu}
								/>
								<PrivateRoute
									path='/payments-history'
									component={PaymentsHistory}
								/>

								<PrivateRoute
									path='/documents'
									component={Documents}
								/>
								<PrivateRoute
									path='/documents-mydoc'
									component={DocumentsMydoc}
								/>
								<PrivateRoute
									path='/documents-shared'
									component={DocumentsShared}
								/>

								<PrivateRoute
									path='/published'
									component={Published}
								/>
								<PrivateRoute
									path='/new-article/:id?'
									component={ArticleNew}
								/>
								<PrivateRoute
									path='/article-details/:id'
									component={ArticleDetails}
								/>
								<PrivateRoute
									path='/appointment'
									component={Appointment}
								/>

								<Redirect
									to='/dashboard'
								/>
							</Switch>
						</div>

					{/*	Chatbot*/}
						<div className={this.state.shown_side_menu? "bot-footer": "slide-bot-footer"}>
							<div className="btn-bot" onClick={this.onClickBot}>
								<img className="icon-bot" src={require('../assets/img/message-bot.jpg')} alt="Bot" />
								Message teletherapist
							</div>
						</div>
						{
							this.state.botVisible && (
								<div className="chatbot-form">
									<div className="bot-position">
										{
											this.props.description_page && this.props.description_page.pageShown === true ?
												<div className="react-chatbot-kit-chat-container">
													<div className="react-chatbot-kit-chat-header header-bot">
														<div className="flex-space justify-left">
															<div className="description" onClick={this.onClickBack}>
																<img className="bot-arrow" src={require('../assets/img/bot-arrow.svg')} alt="Bot Back" />
															</div>
															<div className="txt-18">
																{
																	this.props.description_page.pageNumber === 0 && (
																		<div>Help Center</div>
																	)
																}
																{
																	this.props.description_page.pageNumber === 1 && (
																		<div>teletherapist</div>
																	)
																}
																{
																	this.props.description_page.pageNumber === 2 && (
																		<div>teletherapist</div>
																	)
																}

															</div>
														</div>
													</div>
													<div className="react-chatbot-kit-chat-message-container desc-index">
														{
															this.props.description_page.pageNumber === 0 && (
																<>
																	<div className="txt-22 pb-20 pt-30">What is your pricing?</div>
																	<div className="pricing-txt">
																		Need to check out our pricing plans?
																	</div>
																	<p>
																		If you are already on trial, you can quickly subscribe and see our plans under Settings > Subscription when logged in.
																	</p>
																	<p>
																		If you are not yet on trial and just checking things out, click here to see our pricing plan details. You can also sign up for our FREE, no credit card needed 3 day trial on the same page. :)
																	</p>
																	<p>
																		We also offer a 20% non-profit discount!
																	</p>
																	<p>
																		To view our pricing and plans for individual or small (less than 5) providers, check our
																		<a className="col-blue under-line" href={Config.FRONT_URL + "/pricing"}> pricing page here.</a> Our pricing is per provider per month.
																	</p>
																	<p>
																		If you have more than 5 providers in your group practice, our group plans will be applicable.
																	</p>
																	<a className="col-blue under-line" href={Config.FRONT_URL + "/pricing"}> Check those out here.</a>

																	<div className="pt-45 pb-30">
																		<a href={Config.FRONT_URL + "/pricing"} className="btn-selected link-price col-white mouse-cursor" style={{margin: 20}}>Pricing Plans</a>
																	</div>
																</>
															)
														}

														{
															this.props.description_page.pageNumber === 1 && (
																<>
																	<div className="txt-22 pb-20 pt-30">We've got options!</div>
																	<div className="pricing-txt">
																		If you are a visual or auditory learner you'll love our training videos!
																	</div>
																	<div><a className="col-blue under-line txt-14" href={Config.FRONT_URL + "/features-online-session"}>{Config.FRONT_URL + "/features-online-session"}</a></div>
																	<p>
																		If things stick best when you can read step by step instructions we've got you covered! Check our help center.
																	</p>
																	<div><a className="col-blue under-line txt-14" href={Config.FRONT_URL + "/help-center"}>{Config.FRONT_URL + "/help-center"}</a></div>
																	<p>
																		If you still have questions - have no fear! Just let us know what we can assist you with.
																	</p>
																</>
															)
														}

														{
															this.props.description_page.pageNumber === 2 && (
																<>
																	<>
																		<div className="txt-18 pb-20 pt-30">We are happy to help resolve any technical difficulties you might be experiencing!</div>
																		<div className="pricing-txt">
																			Can you provide the following information:
																		</div>
																		<p>
																			Describe in as much detail as you can the problem you are experiencing
																		</p>
																		<p>
																			The Browser and Device you are using
																		</p>
																		<p>
																			The Browser and Device your CLIENT is using
																		</p>

																	</>
																</>
															)
														}
													</div>
												</div>
												:
												<Chatbot
													config={configChat}
													actionProvider={ActionProvider}
													messageParser={MessageParser}
													name={localStorage.client_name}
													get_reply={this.state.get_reply}
												/>
										}
									</div>
								</div>
							)
						}
					</div>
				</div>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		spinning: state.registers.spinning,
		description_page: state.registers.description_page,
	}
};

export default connect(
	mapStateToProps,
	{
		chatDescription,
	}
)(Body);
