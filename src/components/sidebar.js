import React, {Component} from 'react';
import '../assets/css/sideBar.css';
import {Link} from "react-router-dom";
import Config from "../config/index"
import {
    getPhotoByIdRole,
} from "../redux/actions/register/client-register";
import {connect} from "react-redux";

class Sidebar extends Component{
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            practices: [],
            settingsVisible: false,
            supportVisible: false,
        }
    }
    componentDidMount(){
        const {
            getPhotoByIdRole
        } = this.props;
        getPhotoByIdRole({
            id: localStorage.client_id,
            role: 'client',
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.clientInfo && prevProps.clientInfo !== this.props.clientInfo){
            this.setState({
                account: this.props.clientInfo,
                practices: JSON.parse(this.props.clientInfo.practice_name),
            })
        }
    }

    toggleSettings = () => {
        this.setState({
            settingsVisible: !this.state.settingsVisible,
        });
        if(this.state.settingsVisible === false) {
            this.setState({
                supportVisible: false,
            });
        }
    };
    toggleSupport = () => {
        this.setState({
            supportVisible: !this.state.supportVisible,
        });
        if(this.state.supportVisible === false) {
            this.setState({
                settingsVisible: false,
            });
        }
    };

    render() {
        return (
            <>
                <div className="align-left pt-30 ml-20">
                    {
                        this.state.account && (
                            <>
                                <img
                                    className="photo-header"
                                    src={
                                        this.state.account.photo
                                            ?
                                            this.state.account.photo
                                            :
                                            require('../assets/img/account.svg')}
                                    alt=""
                                />
                                <div className="pt-10">{this.state.account.name && this.state.account.name}</div>
                                <div className="pt-10">
                                    {
                                        this.state.practices && this.state.practices.map((item, key) => {
                                            return (
                                                <div key={key} style={{paddingTop: 5}}>
                                                    {item}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        )
                    }
                    {/*<img className="logo-p" src={require('../assets/img/app-logo-sidebar.svg')} alt="" />*/}
                </div>

                <div className="menu-item mouse-cursor" style={{marginTop: 30}}>
                    <Link className="justify-center" to="/dashboard">
                        <img className="icon-plr" src={require('../assets/img/dashboard-icon.svg')} alt="" />
                        Dashboard
                    </Link>
                </div>

                <div className="menu-item mouse-cursor">
                    <Link className="justify-center"  to="/appointment">
                        <img className="icon-plr" src={require('../assets/img/articles.svg')} alt="" />
                        Appointment
                    </Link>
                </div>

                <div className="menu-item mouse-cursor">
                    <Link className="justify-center" to="/view-messages">
                        <img className="icon-plr" src={require('../assets/img/message-icon.svg')} alt="" />
                        Message
                    </Link>
                </div>

                <div className="menu-item mouse-cursor">
                    <Link className="justify-center" to="/payments">
                        <img className="icon-plr" src={require('../assets/img/payment-icon.svg')} alt="" />
                        Payment
                    </Link>
                </div>

                <div className="menu-item mouse-cursor">
                    <Link className="justify-center" to="/documents">
                        <img className="icon-plr" src={require('../assets/img/documents.svg')} alt="" />
                        Documents
                    </Link>
                </div>

                <div
                    className={this.state.settingsVisible ? 'menu-item mouse-cursor settings-position col-selected-bg' : 'menu-item mouse-cursor settings-position'}
                    onClick={this.toggleSettings}
                >
                    <img className="icon-plr" src={require('../assets/img/settings-icon.svg')} alt="" />
                    Settings
                    {
                        this.state.settingsVisible ?
                            <div className="settings-icon"><img src={require('../assets/img/dorpdown-icon.svg')} alt="" /> </div>
                            :
                            <div className="settings-icon"><img src={require('../assets/img/right-icon.svg')} alt="" /> </div>
                    }

                </div>

                {
                    this.state.settingsVisible && (
                        <div className="span-bg">
                            <div className="collapse-bg settings">
                                <Link to="/settings-profile">
                                    <img className="icon-plr" src={require('../assets/img/dot.svg')} alt="" />
                                    Profile
                                </Link>
                            </div>

                            <div className="collapse-bg settings">
                                <Link to="/settings-security">
                                    <img className="icon-plr" src={require('../assets/img/dot.svg')} alt="" />
                                    Security
                                </Link>
                            </div>
                            <div className="collapse-bg settings">
                                <Link to="/settings-practices">
                                    <img className="icon-plr" src={require('../assets/img/dot.svg')} alt="" />
                                    Practices
                                </Link>
                            </div>
                            <div className="collapse-bg settings">
                                <Link to="/settings-waiting">
                                    <img className="icon-plr" src={require('../assets/img/dot.svg')} alt="" />
                                    Waiting Room
                                </Link>
                            </div>

                            <div className="collapse-bg settings">
                                <Link to="/settings-drag">
                                    <img className="icon-plr" src={require('../assets/img/dot.svg')} alt=""/>
                                    Drag and Drop
                                </Link>
                            </div>
                        </div>
                    )
                }

                <div
                    className={this.state.supportVisible ? 'menu-item mouse-cursor settings-position col-selected-bg' : 'menu-item mouse-cursor settings-position'}
                     onClick={this.toggleSupport}
                >
                    <img className="icon-plr" src={require('../assets/img/support-icon.svg')} alt="" />
                    Support
                    {
                        this.state.supportVisible ?
                            <div className="settings-icon"><img src={require('../assets/img/dorpdown-icon.svg')} alt="" /> </div>
                            :
                            <div className="settings-icon"><img src={require('../assets/img/right-icon.svg')} alt="" /> </div>
                    }

                </div>

                {
                    this.state.supportVisible && (
                        <div className="span-bg">
                            <div className="collapse-bg settings">
                                <Link to="/published">
                                    <img className="icon-plr" src={require('../assets/img/dot.svg')} alt="" />
                                    Blog
                                </Link>
                            </div>
                            <div className="collapse-bg settings">
                                <a href={Config.FRONT_URL + '/help-center/'}>
                                    <img className="icon-plr" src={require('../assets/img/dot.svg')} alt="" />
                                    Go TeleTherapist
                                </a>
                            </div>
                        </div>
                    )
                }
            </>
        )
    }

}
const mapStateToProps = (state) => {
    return {
        clientInfo: state.registers.clientInfo,
    }
};

export default connect(
    mapStateToProps,
    {
        getPhotoByIdRole,
    }
)(Sidebar);

