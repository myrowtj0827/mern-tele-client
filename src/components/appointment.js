import React, {Component} from 'react';
import {connect} from "react-redux";

import {
    appointmentAppointmentRequest,
    appointmentAccept,
    appointmentCancel,

    getAppointmentList,
} from "../redux/actions/register/appointment";
import '../assets/css/dashboard.css';
import InjectedStripePopup from "./stripe-popup";
import EditAppointment from "./appointment-edit";
import DashboardCreateAppointment from "./dashboard-create-appointment";

class Appointment extends Component{
    state = {
        show: false,
        shown_pay_popup: false,
        pay_info: {},

        appointmentList: '',
        appointment_page_num: '',

        /**
         * appointment list
         */
        flag: 1,
        appointment_current_page: 1,
        appointment_page_neighbours: 1,
        appointment_pagination: 10,
        /**
         * Appointment Edit Modal Info
         */
        edit_show: false,
        itemAppt: '',
        provider: '',
        _id_provider: '',
        /**
         * Appointment Modal Info
         */
        show_request: false,
    };

    initial = () => {
        const {
            getAppointmentList,
        } = this.props;

        if(getAppointmentList){
            const data = {
                role: 'client',
                id: localStorage.client_id,
                flag: this.state.flag,
                appointment_current_page: this.state.appointment_current_page,
                appointment_page_neighbours: this.state.appointment_page_neighbours,
                appointment_pagination: this.state.appointment_pagination,
            };
            getAppointmentList(data);
        }
    };

    componentDidMount(){
        this.initial();
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.appointmentList !== this.props.appointmentList || this.state.flag !== prevState.flag){
            this.setState({
                appointmentList: this.props.appointmentList.list,
                appointment_page_num: this.props.appointmentList.page_num,
            })
        }
    }

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

    render(){
        const appointmentPageArray = [];
        if(this.state.appointment_page_num) {
            for (let k = this.state.appointment_page_num.start_page; k <= this.state.appointment_page_num.end_page; k ++) {
                appointmentPageArray.push(k);
            }
        }

        return (
            <>
                {
                    this.state.shown_pay_popup ? (
                        <InjectedStripePopup payInfo={this.state.pay_info} handleHidePopup={this.hidePayPopup}/>
                    ) : null
                }
                <div className="documents-body flex-space">
                    <div className="txt-24 col-black">Appointment</div>
                    <div
                        className="btn-common request justify-center col-white txt-16 mouse-cursor"
                        onClick={this.showModal}
                    >
                        Request Appointment
                    </div>
                </div>

                <div className="table-common table-p">
                    <div className="table-p txt-14">
                        <div className="pb-20 justify-left list col-white">
                            <div className={this.state.flag === 1? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"} onClick={this.onDay}>Day</div>
                            <div className={this.state.flag === 2? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"} onClick={this.onWeek}>Week</div>
                            <div className={this.state.flag === 3? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"} onClick={this.onMonth}>Month</div>
                            <div className={this.state.flag === 5 ? "btn-selected btn-date mouse-cursor" : "btn-date mouse-cursor"} onClick={this.onRequested}>Requested
                            </div>
                        </div>

                        <div className="appointment-list" style={{overflowX: 'auto'}}>
                            <table id="tAppt" cellSpacing={0}>
                                <thead>
                                <tr>
                                    <th>No</th>
                                    <th>State</th>
                                    <th>Provider Name</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Time Length</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                    <th style={{marginLeft: 20}}>Action</th>
                                </tr>
                                </thead>
                                <tbody>
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
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td onClick={() => this.showEditModal(item, provider_list, id_provider)} className="mouse-cursor">
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
                                                </td>
                                                <td onClick={() => this.showEditModal(item, provider_list, id_provider)} className="mouse-cursor">
                                                    {item.providerInfo[0].name}
                                                </td>
                                                <td onClick={() => this.showEditModal(item, provider_list, id_provider)} className="mouse-cursor">
                                                    <div>
                                                        {
                                                            item.start_time && (
                                                                new Date(item.start_time).toLocaleString([], {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </td>
                                                <td onClick={() => this.showEditModal(item, provider_list, id_provider)} className="mouse-cursor">
                                                    <div>
                                                        {
                                                            item.end_time && (
                                                                new Date(item.end_time).toLocaleString([], {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </td>
                                                <td onClick={() => this.showEditModal(item, provider_list, id_provider)} className="mouse-cursor">
                                                    <div className="time-p">
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
                                                </td>
                                                <td onClick={() => this.showEditModal(item, provider_list, id_provider)} className="mouse-cursor">
                                                    <div className="time-p">{item.payment} USD</div>
                                                </td>
                                                <td>
                                                    <div className="col-paragraphBg" style={{paddingLeft: 20}}>
                                                        { item.invite_client === true && "Requested" }
                                                        {item.appointment_type && " " + item.appointment_type}
                                                    </div>
                                                </td>
                                                <td>
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
                                                                <div className="btn-join hover-wait col-white align-center mouse-cursor">
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
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
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

            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        appointmentRequestList: state.registers.appointmentRequestList,
        msg_accept: state.registers.msg_accept,
        msg_cancel: state.registers.msg_cancel,
        error_message: state.registers.error_message,

        appointmentList: state.registers.appointmentList,
    }
};

export default connect(
    mapStateToProps,
    {
        appointmentAppointmentRequest,

        appointmentAccept,
        appointmentCancel,
        getAppointmentList,
    }
)(Appointment);
