import React, {Component} from 'react';
import "../assets/css/dashboard.css"
import {connect} from "react-redux";
import Logout from "./logout-modal";

class Header extends Component{
	constructor(){
		super();

		this.state = {
			account: '',
			show: false,
		}
	}
	showModal = () => {
		this.setState({
			show: true,
		})
	};
	hideModal = () => {
		this.setState({
			show: false,
		})
	};
	render(){
		return (
			<>
				<div className="flex-space header-space">
					<div className="rectangle-menu justify-center mouse-cursor" onClick={this.props.toggleSideMenu}>
						<img
							src={require(this.props.shownSideMenu ? '../assets/img/desktop-menu.svg' : '../assets/img/mobile-menu.svg')}
							alt=""/>
					</div>

					<div className="align-right txt-16 col-heavyDark justify-center">
						<div className="btn-header mouse-cursor " onClick={this.showModal}>
							<div className="flex-space">
								Log Out
							</div>
						</div>
					</div>
				</div>

			{/*	Modal */}
			<Logout
				show={this.state.show}
				handleClose={this.hideModal}
			/>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
	}
};

export default connect(
	mapStateToProps,
	{

	}
)(Header);
