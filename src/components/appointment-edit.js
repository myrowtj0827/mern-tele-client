import React, {Component} from 'react';
import '../assets/css/dashboard.css';
import {connect} from "react-redux";

import {
    createAppointment,
    reset,
    editAppointment,
    deleteAppointment,
} from "../redux/actions/register/appointment";
import {
    getAllowProviders,
} from "../redux/actions/register/client-register";

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class EditAppointment extends Component {
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

            payment: '',

            modalVisible: false,
            send_data: '',
            providerList: '',

            flag_start: true,
            flag_check: true,
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
        if(this.props.itemAppt && this.state.flag_start === true) {
            this.initial();
            this.setState({
                flag_start: false,
            })
        }
        if(this.props.msg_editAppointment && prevProps.msg_editAppointment !== this.props.msg_editAppointment) {
            toast(this.props.msg_editAppointment);

            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
               this.props.history.push('/dashboard');
            }, 4000);
        }

        if(this.props.msg_deleteAppointment && prevProps.msg_deleteAppointment !== this.props.msg_deleteAppointment) {
            toast(this.props.msg_deleteAppointment);

            const {
                reset
            } = this.props;
            clearTimeout(this.tmr);
            this.tmr = setTimeout(function () {
                reset();
                this.tmr = null;
            }, 4000);
        }

        if (prevProps.getAllowedProviders !== this.props.getAllowedProviders || prevState.modalVisible !== this.state.modalVisible) {
            this.setState({
                providerList: this.props.getAllowedProviders,
            });
        }

        if(this.state.recurring !== prevState.recurring) {
            this.calcRepeatTime(this.state.startDate);
        }
        if(this.state.all_day !== prevState.all_day && this.state.flag_check === false) {
            this.calcEndTimeFromAllDay();
        }

        if(this.state.startDate !== prevState.startDate && this.state.flag_start === false && (this.state.endDate !== '' && this.state.endDate !== 0)) {
            let start = new Date(this.state.startDate).getTime();
            let end = this.state.endDate;
            if(this.state.all_day === false) {
                if(start >= end) {
                    if(this.state.endDate !== null) {
                        this.calcFromStartDate(this.state.startDate);
                    }
                } else {
                    let microMinutes = 20 * (1000 * 60); // 20 mins
                    this.calcRepeatTime(Math.floor(new Date(this.state.startDate).getTime()/microMinutes + 1) * microMinutes);
                }
            }
        }
        if(this.state.endDate !== prevState.endDate && (this.state.endDate !== '' && this.state.endDate !== 0)) {
            console.log("this.state.endDate = ", this.state.endDate)
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
            itemAppt,
        } = this.props;

        if (getAllowProviders) {
            getAllowProviders({
                id: localStorage.client_id,
            });
        }
        console.log(itemAppt, new Date(itemAppt.end_time))
        this.setState({
            all_day: itemAppt.all_day,
            recurring: itemAppt.recurring,
            online: itemAppt.online,

            title: itemAppt.title,
            notes: itemAppt.notes,
            client_name: localStorage.client_name,
            time_distance: 20,
            provider_name: this.props.provider && this.props.provider,
            provider_id: this.props.provider_id && this.props.provider_id,

            payment: itemAppt.payment,
            startDate: new Date(itemAppt.start_time).getTime(),
            endDate: itemAppt.end_time !== null ? new Date(itemAppt.end_time).getTime(): '',
            repeat_until: itemAppt.repeat_until !== null ? new Date(itemAppt.repeat_until).getTime(): '',
            recurrence_frequency: itemAppt.recurrence_frequency? itemAppt.recurrence_frequency : '',
        });

        let array_id = [];
        let array_name = [];
        array_id.push(localStorage.client_id);
        array_name.push(localStorage.client_name);

        if(this.state.providerList) {
            this.setState({
                client_name: array_name,
                client_id: array_id,
            });
        }
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
        this.calcRepeatTime(this.state.startDate);

        this.setState({
            all_day: '',
            recurring: '',
            online: '',

            title: '',
            notes: '',
            client_name: '',
            time_distance: 20,
            provider_name: this.props.provider && this.props.provider,
            provider_id: this.props.provider_id && this.props.provider_id,

            payment: '',
            startDate: '',
            endDate: '',
            repeat_until: '',
            recurrence_frequency: '',
            flag_start: true,
            flag_check: true,
        });

        let array_id = [];
        let array_name = [];
        array_id.push(localStorage.client_id);
        array_name.push(localStorage.client_name);

        if(this.state.providerList) {
            this.setState({
                client_name: array_name,
                client_id: array_id,
            });
        }

        handleClose();
    };

    onCheckChange = (e) => {
        this.setState({
            [e.target.id]: e.target.checked,
        });
        if(e.target.id === "all_day") {
            this.setState({
                flag_check: false,
            })
        }
        //    Recurring
        this.calcRepeatTime(this.state.startDate);
    };

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value || '',
        })
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
        console.log(this.state.startDate)
    };

    onUpdate = () => {
        const {
            createAppointment,
        } = this.props;

        const data = {
            _id: this.props.itemAppt._id,
            all_day: this.state.all_day,
            recurring: this.state.recurring,
            online: this.state.online,
            title: this.state.title,
            notes: this.state.notes,
            provider_name: this.state.provider_name,
            provider_id: this.state.provider_id,
            time_distance: this.state.all_day ? 0 : (this.state.endDate - this.state.startDate) / (1000 * 60),
            start_time: this.state.startDate,
            end_time: this.state.all_day === false? this.state.endDate: '',
            repeat_until: this.state.repeat_until && this.state.repeat_until,
            invitees_name: this.state.client_name,
            invitees_id: this.state.client_id,
            recurrence_frequency: this.state.recurrence_frequency,
            payment: this.state.payment,
            update_flag: true,
        };
        createAppointment(data);
    };

    onDelete = () => {
        if(this.props.itemAppt && this.props.itemAppt.invite_client !== true) {
            toast("You can not delete this appointment having your permission.");
            return null;
        } else {
            const {
                deleteAppointment
            } = this.props;

            const data = {
                id: this.props.itemAppt._id,
            };
            if(deleteAppointment) {
                deleteAppointment(data);
            }
        }
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

    render() {
        const showHideClassName = this.props.edit_show ? "modal display-block" : "modal display-none";
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
                                        disabled={this.props.itemAppt.editable_state !== 1}
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
                                        disabled={this.props.itemAppt.editable_state !== 1}
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
                                        disabled={this.props.itemAppt.editable_state !== 1}
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
                            disabled={this.props.itemAppt.editable_state !== 1}
                        />

                        <div className="modal-txt-p">Notes</div>
                        <textarea
                            id="notes"
                            className="notes"
                            placeholder="Add a note about this appointment(optional) ..."
                            value={this.state.notes}
                            onChange={(e) => this.onChange(e)}
                            disabled={this.props.itemAppt.editable_state !== 1}
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
                                    disabled={this.props.itemAppt.editable_state !== 1}
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
                                                disabled={this.state.all_day || this.props.itemAppt.editable_state !== 1}
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
                                    disabled={this.state.all_day || this.props.itemAppt.editable_state !== 1}
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
                                                disabled={this.state.all_day || this.props.itemAppt.editable_state !== 1}
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
                                                    disabled={!this.state.recurring || this.props.itemAppt.editable_state !== 1}
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
                                            disabled={!this.state.recurring || this.props.itemAppt.editable_state !== 1}
                                        />
                                    </div>
                                )
                            }
                        </div>
                        <div className="flex-grid2 modal-grid2-gaps">
                            <div className="modal-txt-p">
                                <div className="">Payment Amount (Usd)</div>
                                <input
                                    id="payment"
                                    className="until"
                                    type="number"
                                    placeholder={this.state.payment}
                                    onChange={(event) => this.onChange(event)}
                                    value={this.state.payment}
                                    disabled={this.props.itemAppt.editable_state !== 1}
                                />
                            </div>
                            <div>
                                <div className="modal-txt-p">Providers</div>
                                <select className="" onChange={this.onSelectChange} disabled>
                                    <option value={'0'}>None</option>
                                    {this.state.providerList && this.state.providerList.map((item, key) => (
                                        this.props.provider_id && this.props.provider_id === item._id?
                                            <option key={key} value={key + 1} selected={true}>{item['name']}</option>
                                            :
                                            <option key={key} value={key + 1}>{item['name']}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="modal-pt flex-space edit-appt">
                            <div className="btn-deletes mouse-cursor justify-center" onClick={this.onDelete}>Delete</div>

                            <div className="flex-space edit-appt">
                                <div className="btn-cancel mouse-cursor justify-center" onClick={this.Cancel}>Cancel</div>
                                {
                                    this.props.itemAppt.editable_state === 1 && (
                                        <div className="btn-payment mouse-cursor justify-center col-white" onClick={this.onUpdate}>Update</div>
                                    )
                                }
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

        msg_editAppointment: state.registers.msg_editAppointment,
        msg_deleteAppointment: state.registers.msg_deleteAppointment,
        spinning: state.registers.spinning,
    }
};

export default connect(
    mapStateToProps,
    {
        createAppointment,
        getAllowProviders,
        reset,

        editAppointment,
        deleteAppointment,
    }
)(EditAppointment);

