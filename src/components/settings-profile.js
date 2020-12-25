import React, {Component} from 'react';
import {connect} from "react-redux";

import CountriesList from "./country-list";
import StateProvince from "./state-province";
import {
	reset,
	getFullUserByIdRole,
	clientInfoUpdate,
	clientAddressUpdate,
} from "../redux/actions/register/client-register";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/settings.css';
import SettingsHeader from "./settings-header";

class SettingsProfile extends Component{
	constructor(){
		super();
		this.tmr = null;
		this.state = {
			account: '',
			warning_email: '',

			name: '',
			email: '',
			phone: '',
			updated_date: new Date().toLocaleTimeString([], {
				year: 'numeric',
				month: 'long',
				day: '2-digit',
				hour: 'numeric',
				minute: '2-digit'
			}),
			photo: '',
			gender: '',
			age: '',

			address1: '',
			address2: '',
			city: '',
			state_province: '',
			zip_code: '',
			country: 'US',
		}
	}

	componentDidMount(){
		const {
			getFullUserByIdRole
		} = this.props;
		if(getFullUserByIdRole){
			const data = {
				id: localStorage.client_id,
				role: 'client',
			};

			getFullUserByIdRole(data);
		}

		this.setState({
			country: 'US',
			state_province: 'Alabama',
		})
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(this.props.clientFullInfo && prevProps.clientFullInfo !== this.props.clientFullInfo){
			this.setState({
				account: this.props.clientFullInfo,
				photo: this.props.clientFullInfo.photo,
				country: this.props.clientFullInfo.country ? this.props.clientFullInfo.country: "US",
				gender: this.props.clientFullInfo.gender? this.props.clientFullInfo.gender: 'Male',
			});
			if(this.props.clientFullInfo.state_province) {
				this.setState({
					state_province: this.props.clientFullInfo.state_province,
				})
			}
		}

		if((this.state.country !== 'US') && (prevState.country !== this.state.country)){
			this.setState({
				state_province: '',
			});
		}

		if(this.props.msg_info_update && this.props.msg_info_update !== prevProps.msg_info_update) {
			toast(this.props.msg_info_update);
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

	handleCountryChange = (e) => {
		this.setState({
			country: e.target.value,
		});
	};

	handleProvinceChange = (e) => {
		this.setState({
			state_province: e.target.value,
		});
	};

	onGender = (e) => {
		this.setState({
			gender: e.target.value,
		});
	};

	onChange = (e) => {
		if(this.state.email){
			let temp = this.state.email.includes('@') && this.state.email.includes('.');
			if(temp === false){
				this.setState({
					warning_email: "Please input the valid email.",
				});
			}
			else{
				this.setState({
					warning_email: "",
				});
			}
		}
		this.setState({[e.target.id]: e.target.value || ''});
	};

	onPhoneChange = (e) => {
		this.setState({[e.target.id]: parseFloat(e.target.value || 0)});
	};

	infoUpdate = () => {
		if(this.state.email){
			let temp = this.state.email.includes('@') && this.state.email.includes('.');
			if(temp === false){
				this.setState({
					warning_email: "Please input the valid email.",
				});
				return;
			}
		}
		const data = {
			id: this.state.account._id,
			name: this.state.name ? this.state.name : this.state.account.name,
			email: this.state.email ? this.state.email : this.state.account.email,
			phone: this.state.phone ? this.state.phone : this.state.account.phone,
			updated_date: this.state.updated_date ? this.state.updated_date : this.state.account.updated_date,
			photo: this.state.photo ? this.state.photo : this.state.account.photo,
			role: 'client',

			gender: this.state.gender,
			age: this.state.age? new Date().getFullYear() - this.state.age: (this.state.account.age? this.state.account.age: ''),
		};

		const {
			clientInfoUpdate,
		} = this.props;

		clientInfoUpdate(data);
	};

	addressUpdate = () => {
		const data = {
			id: this.state.account._id,
			address1: this.state.address1 ? this.state.address1 : this.state.account.address1,
			address2: this.state.address2 ? this.state.address2 : this.state.account.address2,
			city: this.state.city ? this.state.city : this.state.account.city,
			state_province: this.state.state_province ? this.state.state_province : this.state.account.state_province,
			zip_code: this.state.zip_code ? this.state.zip_code : this.state.account.zip_code,
			country: this.state.country ? this.state.country : this.state.account.country,
			updated_date: this.state.updated_date ? this.state.updated_date : this.state.account.updated_date,
			role: 'client',
		};

		const {
			clientAddressUpdate
		} = this.props;

		clientAddressUpdate(data);
	};

	photoUpload = (e) => {
		const url = e.target.files[0];
		if(url){
			const reader = new FileReader();
			reader.onload = fileEvent => {
				this.cropImage(fileEvent.target.result, 128)
					.then(croppedImg => {
						this.setState({
							photo: croppedImg,
						})
					})
					.catch(err => {
						console.log(err);
					});
			};
			reader.readAsDataURL(url);
		}
	};

	cropImage = (url, size, key) => {
		return new Promise(resolve => {
			// this image will hold our source image data
			const inputImage = new Image();
			// we want to wait for our image to load
			inputImage.onload = () => {
				// let's store the width and height of our image
				const minLength = Math.min(inputImage.naturalWidth, inputImage.naturalHeight);
				// calculate the position to draw the image at
				const offsetX = (inputImage.naturalWidth - minLength) / 2;
				const offsetY = (inputImage.naturalHeight - minLength) / 2;
				// create a canvas that will present the output image
				const outputImage = document.createElement('canvas');
				// set it to the same size as the image
				outputImage.width = size;
				outputImage.height = size;
				// draw our image at position 0, 0 on the canvas
				const ctx = outputImage.getContext('2d');
				ctx.drawImage(inputImage, offsetX, offsetY, minLength, minLength, 0, 0, size, size);
				resolve(outputImage.toDataURL('image/png', 0.4));
			};
			// start cropping
			inputImage.src = url;
		})
	};

	render(){
		return (
			<>
				<div className="setting-body-p">
					<div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
						<div className="lds-dual-ring"/>
					</div>
					<SettingsHeader/>
					<div>
						<ToastContainer/>
					</div>
					<div className="btnBar-pt">
						<div className="profile-grid5">
							<div className="photo-box">
								<div className="photo-upBg linear-bg">
									<img
										className="photo-virtual"
										src={
											this.state.photo
												?
												this.state.photo
												:
												require('../assets/img/virtual-uploadPhoto.svg')}
										alt=""
									/>
								</div>
								<div className="new-photo-pt align-center">
									<div className="pb-20 txt-24 col-darkBlue justify-center">{this.state.account.name}</div>
									<input
										type="file"
										id="owner_picture"
										accept="image/*"
										className="custom-file-input"
										onChange={(event) => this.photoUpload(event)}
										required
									/>

									<div className="txt-12 col-lightColor">
										{
											this.state.account.updated_date ? 'Updated at ' + this.state.account.updated_date : "Updated at September 10, 2020 12: 00 PM"
										}
									</div>
								</div>
							</div>

							<div className="info-box">
								<div className="txt-18 txt-medium col-darkBlue">User Info</div>
								<div className="pt-30 col-heavyDark">Name</div>
								<input
									id={'name'}
									type="text"
									className="userInfo"
									placeholder={this.state.account.name}
									value={this.state.name}
									onChange={this.onChange}
									required
								/>

								<div className="pt-30 col-heavyDark">Email</div>
								<input
									id={'email'}
									type="email"
									className="userInfo"
									placeholder={this.state.account.email}
									value={this.state.email}
									onChange={this.onChange}
									required
								/>
								<span>{this.state.warning_email}</span>

								<div className="flex-space">
									<div className='gender-age'>
										<div className="pt-20 col-heavyDark">Gender</div>
										<select
											className="col-black"
											defaultValue={this.state.gender && this.state.gender}
											onChange={this.onGender}
										>
											<option value="Male" selected={this.state.gender && this.state.gender === "Male" && true}>Male</option>
											<option value="Female" selected={this.state.gender && this.state.gender === "Female" && true}>Female</option>
										</select>
									</div>

									<div className='gender-age'>
										<div className="pt-20 col-heavyDark">Age</div>
										<input
											id={'age'}
											type="number"
											placeholder={this.state.account.age? new Date().getFullYear() - this.state.account.age: "Age"}
											value={this.state.age}
											onChange={this.onChange}
											required
										/>
									</div>
								</div>

								<div className="pt-30 col-heavyDark">Phone</div>
								<div className="flex-space">
									<input
										id={'phone'}
										type="tel"
										placeholder={this.state.account.phone ? this.state.account.phone : 1234567890}
										value={this.state.phone}
										onChange={this.onPhoneChange}
										required
									/>
									<div className="btn-common userInfo mouse-cursor" onClick={this.infoUpdate}>Update</div>
								</div>
							</div>
						</div>

						<div className="pt-20">
							<div className="info-address">
								<div className="txt-18 col-darkBlue">My Address</div>
								<div className="txt-16 col-heavyDark pt-20">Address Line 1</div>
								<input
									id={'address1'}
									type="text"
									placeholder={this.state.account.address1 ? this.state.account.address1 : ''}
									value={this.state.address1}
									onChange={this.onChange}
									required
								/>

								<div className="txt-16 col-heavyDark pt-20">Address Line 2</div>
								<input
									id={'address2'}
									type="text"
									placeholder={this.state.account.address2 ? this.state.account.address2 : ''}
									value={this.state.address2}
									onChange={this.onChange}
									required
								/>

								<div className="txt-16 col-heavyDark pt-20">City</div>
								<input
									id={'city'}
									type="text"
									placeholder={this.state.account.city ? this.state.account.city : ''}
									value={this.state.city}
									onChange={this.onChange}
									required
								/>
								<div className="txt-16 col-heavyDark pt-20">State / Province / Region</div>
								{
									this.state.country && this.state.country === "US" ?
										<select value={this.state.state_province} onChange={this.handleProvinceChange}>
											<StateProvince/>
										</select>
										:
										<input
											id={'state_province'}
											type="text"
											placeholder={this.state.account.state_province ? this.state.account.state_province : ''}
											value={this.state.state_province}
											onChange={this.onChange}
											required
										/>
								}

								<div className="txt-16 col-heavyDark pt-20">ZIP / Postal Code</div>
								<input
									id={'zip_code'}
									type="text"
									placeholder={this.state.account.zip_code ? this.state.account.zip_code : ''}
									value={this.state.zip_code}
									onChange={this.onChange}
									required
								/>
								<div className="txt-16 col-heavyDark pt-20">Country</div>
								<select value={this.state.country} onChange={this.handleCountryChange}>
									<CountriesList/>
								</select>
								<div className="update-pt">
									<div className="btn-common address mouse-cursor" onClick={this.addressUpdate}>Update</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		spinning: state.registers.spinning,
		clientFullInfo: state.registers.clientFullInfo,
		msg_info_update: state.registers.msg_info_update,
	}
};

export default connect(
	mapStateToProps,
	{
		reset,
		getFullUserByIdRole,
		clientInfoUpdate,
		clientAddressUpdate
	}
)(SettingsProfile);
