import React, {Component} from 'react';
import {createAppointment, reset} from "../redux/actions/register/appointment";
import {getAllowProviders} from "../redux/actions/register/client-register";

import '../assets/css/dashboard.css';
import {connect} from "react-redux";

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class DashboardCreateAppointment extends Component {
    constructor(props) {
        super(props);

        this.tmr = null;
        this.state = {
            all_day: false,
            recurring: false,
            online: true,

            title: '',
            notes: '',
            client_name: '',
            time_distance: '',

            provider_id: '',
            provider_name: '',

            recurrence_frequency: '',
            startDate: '',
            endDate: '',
            repeat_until: '',

            payer_name: '',
            payment: '',

            modalVisible: false,
            send_data: '',

            providerList: '',

        };

        this.onFormSubmit = this.onFormSubmit.bind(this);

        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.handleRepeatDate = this.handleRepeatDate.bind(this);

        this.onCheckChange = this.onCheckChange.bind(this);
        this.onChange = this.onChange.bind(this);

        this.calcRepeatTime = this.calcRepeatTime.bind(this);
        this.calcFromStartDate = this.calcFromStartDate.bind(this);
        this.calcFromEndDate = this.calcFromEndDate.bind(this);
        this.calcEndTimeFromAllDay = this.calcEndTimeFromAllDay.bind(this);
    }

    componentDidMount() {
        this.initial();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.msg_appointment && prevProps.msg_appointment !== this.props.msg_appointment) {
            toast(this.props.msg_appointment);

            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
                window.location.href = "/dashboard";
            }, 2000);
        }

        if (prevProps.getAllowedProviders !== this.props.getAllowedProviders || prevState.modalVisible !== this.state.modalVisible) {
            this.setState({
                providerList: this.props.getAllowedProviders,
            });
        }

        if(this.state.recurring !== prevState.recurring) {
            this.calcRepeatTime(this.state.startDate);
        }
        if(this.state.all_day !== prevState.all_day) {
            this.calcEndTimeFromAllDay();
        }
        if(this.state.startDate !== prevState.startDate) {
            let start = new Date(this.state.startDate).getTime();
            let end = this.state.endDate;
            if(this.state.all_day === false) {
                if(start >= end) {
                    this.calcFromStartDate(this.state.startDate);
                } else {
                    let microMinutes = 20 * (1000 * 60); // 20 mins
                    this.calcRepeatTime(Math.floor(new Date(this.state.startDate).getTime()/microMinutes + 1) * microMinutes);
                }
            }
        }

        if(this.state.endDate !== prevState.endDate) {
            let start = this.state.startDate;
            let end = new Date(this.state.endDate).getTime();
            if(start >= end) {
                this.calcFromEndDate(this.state.endDate);
            }
        }
    }

    initial = () => {
        const {
            getAllowProviders,
        } = this.props;

        if (getAllowProviders) {
            getAllowProviders({
                id: localStorage.client_id,
            });
        }

        let microMinutes = 20 * (1000 * 60); // 40 mins
        let startDate, endDate;
        startDate = Math.floor(new Date().getTime()/microMinutes + 1) * microMinutes;
        endDate = startDate + microMinutes;

        this.setState({
            startDate: startDate,
            endDate: endDate,
        });

        this.calcRepeatTime(startDate);

        this.setState({
            all_day: false,
            recurring: false,
            online: true,

            title: 'Meeting with ' + localStorage.client_name,
            client_name: '',
            client_id: '',
            time_distance: 20,

            provider_id: '',
            provider_name: '',

            payer_name: '',
            payment: 0,
        })
    };

    // Getting End Date from Start Date
    calcFromStartDate = (date) => {
        let microMinutes = 20 * (1000 * 60); // 40 mins
        let startDate, endDate;
        startDate = Math.floor(new Date(date).getTime()/microMinutes + 1) * microMinutes;
        endDate = startDate + microMinutes;

        if(this.state.all_day === false) {
            startDate = new Date(date).getTime();
            endDate = startDate + microMinutes;

            this.setState({
                startDate: startDate,
                endDate: endDate,
            });
        } else {
            this.setState({
                startDate: startDate,
            });
        }
        this.calcRepeatTime(startDate);
    };

    // Getting Start Date from End Date
    calcFromEndDate = (date) => {
        let microMinutes = 20 * (1000 * 60); // 40 mins
        let startDate, endDate;
        endDate = date.getTime();
        startDate = endDate - microMinutes;

        this.setState({
            startDate: startDate,
            endDate: endDate,
        });

        this.calcRepeatTime(startDate);
    };

    //Repeat Date according to recurring
    calcRepeatTime = (date) => {
        let repeat_until = new Date(date);
        repeat_until.setDate(repeat_until.getDate() + 14); // Repeating 2 times for 2 weeks
        if(this.state.recurring === true) {
            this.setState({
                repeat_until: repeat_until,
                recurrence_frequency: 7,
            })
        } else {
            this.setState({
                repeat_until: '',
                recurrence_frequency: '',
            })
        }
    };

    //End Date according to all day
    calcEndTimeFromAllDay = () => {
        if(this.state.all_day === false) {
            this.calcFromStartDate(new Date(this.state.startDate));
        } else {
            this.setState({
                endDate: '',
            })
        }
    };

    Cancel = () => {
        const {
            handleClose
        } = this.props;
        this.initial();
        this.calcRepeatTime(this.state.startDate);
        handleClose();
    };

    onCheckChange = (e) => {
        this.setState({
            [e.target.id]: e.target.checked,
        });
        //    Recurring
        this.calcRepeatTime(this.state.startDate);
    };

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value || '',
        })
    };

    onSelectChange = (e) => {
        let array_id = [];
        let array_name = [];
        array_id.push(localStorage.client_id);
        array_name.push(localStorage.client_name);
        if(this.state.providerList) {
            this.setState({
                provider_name: this.state.providerList[e.target.value - 1].name,
                provider_id: this.state.providerList[e.target.value - 1]._id,
                client_name: array_name,
                client_id: array_id,
            });
        }
        const {
            createApp
        } = this.props;
        if(createApp) {
            createApp();
        }
    };

    handleStartDate(date) {
        this.setState({
            startDate: date,
        });
    };
    handleEndDate(date) {
        this.setState({
            endDate: date,
        });
    };
    handleRepeatDate(date) {
        this.setState({
            repeat_until: date,
        });
    };

    onFormSubmit(e) {
        e.preventDefault();
    };

    createApp = () => {
        const {
            createAppointment,
        } = this.props;

        const data = {
            all_day: this.state.all_day,
            recurring: this.state.recurring,
            online: this.state.online,
            title: this.state.title,
            notes: this.state.notes,
            invitees_name: this.state.client_name,
            invitees_id: this.state.client_id,
            time_distance: this.state.all_day ? 0 : (this.state.endDate - this.state.startDate) / (1000 * 60),
            start_time: this.state.startDate,
            end_time: this.state.endDate,
            repeat_until: this.state.repeat_until && this.state.repeat_until,
            provider_name: this.state.provider_name,
            provider_id: this.state.provider_id,
            recurrence_frequency: this.state.recurrence_frequency,
            payment: this.state.payment,
        };

        createAppointment(data);
    };

    render() {
        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName}>
                <div className={"spinning-curtain"} style={{display: this.props.spinning ? "flex" : "none"}}>
                    <div className="lds-dual-ring"/>
                </div>
                <ToastContainer/>
                <section className="modal-main">
                    <div className="create-header txt-18 justify-left col-white">Request Appointment</div>
                    <div className="modal-body txt-16 txt-medium col-darkBlue">
                        <div className="flex-space">
                            <div>
                                <label className="container-event align-l">
                                    <span className="">All Day</span>
                                    <input
                                        id="all_day"
                                        type="checkbox"
                                        checked={this.state.all_day}
                                        onChange={this.onCheckChange}
                                    />
                                    <span className="checkMark"/>
                                </label>
                            </div>

                            <div>
                                <label className="container-event align-l">
                                    <span className="">Recurring</span>
                                    <input
                                        id="recurring"
                                        type="checkbox"
                                        checked={this.state.recurring}
                                        onChange={this.onCheckChange}
                                    />
                                    <span className="checkMark"/>
                                </label>
                            </div>
                            <div>
                                <label className="container-event align-l">
                                    <span className="">Online</span>
                                    <input
                                        id="online"
                                        type="checkbox"
                                        checked={this.state.online}
                                        onChange={this.onCheckChange}
                                    />
                                    <span className="checkMark"/>
                                </label>
                            </div>
                        </div>

                        <div className="modal-txt-p">Title</div>

                        <input
                            id="title"
                            type="text"
                            placeholder="Appointment"
                            value={this.state.title}
                            onChange={(e) => this.onChange(e)}
                        />

                        <div className="modal-txt-p">Notes</div>
                        <textarea
                            id="notes"
                            className="notes"
                            placeholder="Add a note about this appointment(optional) ..."
                            value={this.state.notes}
                            onChange={(e) => this.onChange(e)}
                            required
                        />

                        <div className="flex-space pt-10">
                            <form onSubmit={this.onFormSubmit}>
                                <label>Start Date</label>
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={this.handleStartDate}
                                    minDate={new Date()}
                                    dateFormat="MMMM d, yyyy"
                                />
                            </form>
                            {
                                !this.state.all_day && (
                                    <>
                                        <img className="justify-center" style={{marginTop: 30}}
                                             src={require('../assets/img/line-icon.svg')} alt=""/>
                                        <form onSubmit={this.onFormSubmit}>
                                            <label>End Date</label>
                                            <DatePicker
                                                selected={this.state.endDate}
                                                onChange={this.handleEndDate}
                                                minDate={new Date()}
                                                dateFormat="MMMM d, yyyy"
                                                disabled={this.state.all_day}
                                            />
                                        </form>
                                    </>
                                )
                            }
                        </div>

                        <div className="flex-space pt-10">
                            <form onSubmit={this.onFormSubmit}>
                                <label>Start Time</label>
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={this.handleStartDate}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeCaption="Time"
                                    minDate={new Date().getTime()}
                                    dateFormat="h:mm aa"
                                    timeIntervals={20}
                                    showPopperArrow={false}
                                    disabled={this.state.all_day}
                                />
                            </form>

                            {
                                !this.state.all_day && (
                                    <>
                                        <img className="justify-center" style={{marginTop: 30}}
                                             src={require('../assets/img/line-icon.svg')} alt=""/>

                                        <form onSubmit={this.onFormSubmit}>
                                            <label className="">End Time</label>
                                            <DatePicker
                                                selected={this.state.endDate}
                                                onChange={this.handleEndDate}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeCaption="Time"
                                                minDate={new Date().getTime()}
                                                dateFormat="h:mm aa"
                                                timeIntervals={20}
                                                showPopperArrow={false}
                                                disabled={this.state.all_day}
                                            />
                                        </form>
                                    </>
                                )
                            }
                        </div>

                        <div className="flex-grid2 modal-grid2-gaps">
                            {
                                this.state.recurring && (
                                    <div>
                                        <div className="modal-txt-p">Repeat Until</div>
                                        <form className="repeat-until" onSubmit={this.onFormSubmit}>
                                            <div className="">
                                                <DatePicker
                                                    selected={this.state.repeat_until}
                                                    onChange={this.handleRepeatDate}
                                                    dateFormat="MMMM d, yyyy"
                                                    minDate={this.state.endDate}
                                                    disabled={!this.state.recurring}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                )
                            }

                            {
                                this.state.recurring && (
                                    <div>
                                        <div className="modal-txt-p">Recurrence Frequency (Days)</div>
                                        <input
                                            id="recurrence_frequency"
                                            className="until"
                                            type="number"
                                            value={this.state.recurrence_frequency}
                                            onChange={(event) => this.onChange(event)}
                                            disabled={!this.state.recurring}
                                        />
                                    </div>
                                )
                            }
                        </div>

                        <div className="flex-grid2 modal-grid2-gaps">
                            <div>
                                <div className="modal-txt-p">Client</div>
                                <input
                                    id="provider_name"
                                    className="provider"
                                    type="text"
                                    value={localStorage.getItem("client_name")}
                                    disabled={true}
                                />

                                <div className="modal-txt-p">Payment Amount (Usd)</div>
                                <input
                                    id="payment"
                                    className="until"
                                    type="number"
                                    placeholder={this.state.payment}
                                    onChange={(event) => this.onChange(event)}
                                    value={this.state.payment}
                                />
                            </div>
                            <div>
                                <div className="modal-txt-p">Providers</div>
                                <select className="" onChange={this.onSelectChange}>
                                    <option value={'0'}>None</option>
                                    {this.state.providerList && this.state.providerList.map((item, key) => (
                                        <option key={key} value={key + 1}>{item['name']}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex-grid2 modal-grid2-gaps cancel-create-p">
                            <div className="btn-common client mouse-cursor cancel justify-center"
                                 onClick={this.Cancel}>Cancel
                            </div>
                            <div className="btn-common mouse-cursor create justify-center col-white"
                                 onClick={this.createApp}>Create
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        getAllowedProviders: state.registers.getAllowedProviders,

        msg_appointment: state.registers.msg_appointment,
        spinning: state.registers.spinning,
    }
};

export default connect(
    mapStateToProps,
    {
        createAppointment,
        getAllowProviders,
        reset,
    }
)(DashboardCreateAppointment);

