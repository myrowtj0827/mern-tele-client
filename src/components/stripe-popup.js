import React, {Component} from 'react';
import "../assets/css/stripe-popup.css";
import {CardElement, ElementsConsumer} from '@stripe/react-stripe-js';
// import config from "../config";
import {connect} from "react-redux";
import {payAppointment} from "../redux/actions/register/appointment";

const CARD_OPTIONS = {
	iconStyle: 'solid',
	style: {
		base: {
			iconColor: '#c4f0ff',
			color: '#333',
			fontWeight: 400,
			fontFamily: 'Poppins, sans-serif',
			fontSize: '14px',
			':-webkit-autofill': {color: '#fce883'},
			'::placeholder': {color: '#ccc'},
		},
		invalid: {
			iconColor: '#ffc7ee',
			color: '#ffc7ee',
		},
	},
};

/**
	 appointment_id: item._id,
	 provider_id: item.provider_id,
	 provider_name: item.providerInfo[0].name,
	 start_time: item.start_time.realTime,
	 end_time: item.end_time.realTime,
	 amount: item.payment * 100,
 */
class StripePopup extends Component{
	constructor(props){
		super(props);

		this.error_timer = null;
		this.state = {
			error_message: null,
		};
	}

	doPayment = async () => {
		const card = this.props.elements.getElement(CardElement);
		const result = await this.props.stripe.createToken(card);

		if(result.error){
			this.setState({error_message: result.error.message});

			if(this.error_timer === null){
				this.error_timer = setTimeout(() => {
					this.setState({error_message: null});
					clearTimeout(this.error_timer);
					this.error_timer = null;
				}, 5000);
			}
		}
		else{
			const {payAppointment} = this.props;
			payAppointment({
				appointment_id: this.props.payInfo.appointment_id,
				provider_id: this.props.payInfo.provider_id,
				amount: this.props.payInfo.amount,
			});

			this.props.handleHidePopup();
		}
	};

	render(){
		return (
			<div className={"pay-popup-curtain"}>
				<div className={"pay-container"}>
					<div className={"pt-10"}><b>Provider</b>: {this.props.payInfo.provider_name}</div>
					<div className={"pt-10"}><b>Start time</b>: {new Date(this.props.payInfo.start_time).toLocaleString('en-us')}</div>
					<div className={"pt-10"}><b>End time</b>: {new Date(this.props.payInfo.end_time).toLocaleString('en-us')}</div>
					<div className={"pt-10"}><b>Card info:</b></div>
					<div className={"card-element-cont"}>
						<CardElement options={CARD_OPTIONS}/>
					</div>
					{this.state.error_message ? (
						<div className={"error-message"}>
							{this.state.error_message}
						</div>
					) : null}
					<div className={"button-row"}>
						<button className={`pay-button ${this.props.spinning ? 'disabled' : ''}`}
										onClick={this.props.spinning ? null : this.doPayment}>PAY
						</button>
						<button className={`pay-button ${this.props.spinning ? 'disabled' : ''}`}
										onClick={this.props.spinning ? null : this.props.handleHidePopup}>Cancel
						</button>
					</div>
				</div>
			</div>
		)
	}
}

const InjectedStripePopup = (props) => {
	return (
		<ElementsConsumer>
			{({elements, stripe}) => (
				<StripePopup elements={elements} stripe={stripe} {...props}/>
			)}
		</ElementsConsumer>
	);
};

export default connect(
	state => {
		return {
			spinning: state.registers.spinning
		}
	},
	{
		payAppointment,
	}
)(InjectedStripePopup);
