import React, {Component} from 'react';
import {Link} from "react-router-dom";
import '../assets/css/documents.css';
import {connect} from "react-redux";
import {
    appointmentPaymentRequest,
    appointmentPaidRequest,
} from "../redux/actions/register/appointment"
import InjectedStripePopup from "./stripe-popup";

class PaymentsMenu extends Component {
    constructor() {
        super();

        this.state = {
            selectedBtn: 1,
            list: '',
            paidList: '',
            shown_pay_popup: false,
            pay_info: {},

            //invoice
            page_num: '',
            current_page: 1,
            page_neighbours: 4,
            pagination: 6,

            //payment history(paid)
            history_page_num: '',
            history_current_page: 1,
            history_page_neighbours: 4,
            history_pagination: 6,
        }
    }

    componentDidMount() {
        this.initial();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.appointmentPaymentList && this.props.appointmentPaymentList !== prevProps.appointmentPaymentList) {
            this.setState({
                list: this.props.appointmentPaymentList.list,
                page_num: this.props.appointmentPaymentList.page_num,
            })
        }

        if (this.props.paidAppointmentList && this.props.paidAppointmentList !== prevProps.paidAppointmentList) {
            this.setState({
                paidList: this.props.paidAppointmentList.list,
                history_page_num: this.props.paidAppointmentList.page_num,
            })
        }
    }

    initial = () => {
        const {
            appointmentPaymentRequest,
            appointmentPaidRequest
        } = this.props;

        const data_invoice = {
            id: localStorage.client_id,
            current_page: this.state.current_page,
            page_neighbours: this.state.page_neighbours,
            pagination: this.state.pagination,
            state: 1,
        };
        if (appointmentPaymentRequest) {
            appointmentPaymentRequest(data_invoice);
        }

        const data_history = {
            id: localStorage.client_id,
            history_current_page: this.state.history_current_page,
            history_page_neighbours: this.state.history_page_neighbours,
            history_pagination: this.state.history_pagination,
        };

        if (appointmentPaidRequest) {
            appointmentPaidRequest(data_history);
        }

        if (window.location.pathname === '/payments') {
            this.setState({
                selectedBtn: 1,
            })
        } else if (window.location.pathname === '/payments-history') {
            this.setState({
                selectedBtn: 2,
            })
        }
    };

    onPay = (pay_info) => {
        this.setState({
            pay_info: pay_info,
            shown_pay_popup: true,
        });
    };

    hidePayPopup = () => {
        this.setState({
            shown_pay_popup: false,
        })
    };

    onPageClick = (item) => {
        if (this.state.selectedBtn === 1) {
            const {
                appointmentPaymentRequest
            } = this.props;

            this.setState({
                current_page: item,
            });

            const data_invoice = {
                id: localStorage.client_id,
                current_page: item,
                page_neighbours: this.state.page_neighbours,
                pagination: this.state.pagination,
                state: 1,
            };

            if (appointmentPaymentRequest) {
                appointmentPaymentRequest(data_invoice);
            }
        } else {
            const {
                appointmentPaidRequest
            } = this.props;
            this.setState({
                history_current_page: item,
            });

            const data = {
                id: localStorage.client_id,
                history_current_page: item,
                history_page_neighbours: this.state.history_page_neighbours,
                history_pagination: this.state.history_pagination,
            };
            if (appointmentPaidRequest) {
                appointmentPaidRequest(data);
            }
        }
        window.scrollTo(0, 0);
    };

    render() {
        const pageArray = [];
        const history_pageArray = [];

        if (this.state.history_page_num) {
            for (let k = this.state.history_page_num.start_page; k <= this.state.history_page_num.end_page; k++) {
                history_pageArray.push(k);
            }
        }

        if (this.state.page_num) {
            for (let k = this.state.page_num.start_page; k <= this.state.page_num.end_page; k++) {
                pageArray.push(k);
            }
        }

        return (
            <>
                {
                    this.state.shown_pay_popup ? (
                        <InjectedStripePopup payInfo={this.state.pay_info} handleHidePopup={this.hidePayPopup}/>
                    ) : null
                }
                <div className="pt-20">
                    <div className="flex-document documentMenu txt-14 col-disabled-shown">
                        <Link to="/payments">
                            <div
                                className={this.state.selectedBtn === 1 ? "menuSelected menu-documents" : "menu-documents"}
                            >
                                Invoice
                            </div>
                        </Link>
                        <Link to="/payments-history">
                            <div
                                className={this.state.selectedBtn === 2 ? "menuSelected menu-documents" : "menu-documents"}
                            >
                                Payment
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="documents-card txt-14">
                    <div className="table-border">
                        {
                            this.state.selectedBtn === 1 && this.state.list && this.state.list.length === 0 && (
                                <div className="pb-20 txt-14">You do not have any outstanding payment requests. Click the
                                    create button above
                                    and to the right to get started.</div>
                            )
                        }

                        {
                            this.state.selectedBtn === 2 && this.state.paidList && this.state.paidList.length === 0 && (
                                <div className="pb-20 txt-14">You do not have any payment history. Click the create button
                                    above and to the
                                    right to get started.</div>
                            )
                        }

                        <table id="payment-action" cellSpacing={0}>
                            {
                                this.state.selectedBtn === 1 && (
                                    <thead>
                                    <tr className="head-border align-l" style={{backgroundColor: "#0004"}}>
                                        <th>No</th>
                                        <th>Start Date</th>
                                        <th>Requested By</th>
                                        <th>Amount</th>
                                        <th>Date Requested</th>
                                        <th>Type</th>
                                        <th className="align-center">Action</th>
                                    </tr>
                                    </thead>
                                )
                            }

                            {
                                this.state.selectedBtn === 2 && (
                                    <thead>
                                    <tr className="head-border align-l" style={{backgroundColor: "#0004"}}>
                                        <th>No</th>
                                        <th>Session End Date</th>
                                        <th>Paid To</th>
                                        <th>Amount</th>
                                        <th>Date Paid</th>
                                        <th>Type</th>
                                    </tr>
                                    </thead>
                                )
                            }
                            <tbody id="payment">
                            {
                                this.state.selectedBtn === 1 && this.state.list && this.state.list.map((item, key) => {
                                    return !(item.state === 3) ? (
                                        <tr key={key}>
                                            <td>{key + 1}</td>
                                            <td>
                                                <div>
                                                    {
                                                        item.start_time && new Date(item.start_time).toLocaleDateString([], {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                {item.providerInfo[0].name}
                                            </td>
                                            <td>
                                                $ {item.payment}
                                            </td>
                                            <td>
                                                {
                                                    item.requested_date && new Date(item.requested_date).toLocaleDateString([], {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })
                                                }
                                            </td>
                                            <td>
                                                <div>
                                                    {
                                                        item.invite_client === true && "Requested"
                                                    }
                                                </div>
                                                <div>
                                                    {
                                                        item.appointment_type && item.appointment_type
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className="btn-common edit-btn request-btn col-white align-center mouse-cursor"
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
                                            </td>
                                        </tr>
                                    ) : null
                                })
                            }
                            {
                                this.state.selectedBtn === 2 && this.state.paidList && this.state.paidList.map((item, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{key + 1}</td>
                                            <td>
                                                {
                                                    item.actual_end && new Date(item.actual_end).toLocaleDateString([], {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })
                                                }
                                            </td>
                                            <td>
                                                {item.providerInfo[0].name}
                                            </td>
                                            <td>
                                                $ {item.payment}
                                            </td>
                                            <td>
                                                {
                                                    item.payment === 0?
                                                        new Date(item.requested_date).toLocaleDateString([], {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })
                                                        :
                                                        item.paid_date && (
                                                            new Date(item.paid_date).toLocaleDateString([], {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })
                                                        )
                                                }
                                            </td>
                                            <td>
                                                <div>
                                                    {
                                                        item.invite_client === true && "Requested"
                                                    }
                                                </div>
                                                <div>
                                                    {
                                                        item.appointment_type && item.appointment_type
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
                    <div className="help-center-align">
                        <div className="product-btn justify-center" onClick={() => this.onPageClick(1)}>
                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9.60496 14.6383C9.42024 14.6383 9.23359 14.5779 9.07773 14.457L0.923018 8.02084C0.724826 7.86414 0.609375 7.62814 0.609375 7.37704C0.609375 7.12782 0.724826 6.88993 0.923018 6.73512L9.0431 0.332906C9.40485 0.047818 9.934 0.104458 10.2246 0.459402C10.5151 0.814346 10.4574 1.33355 10.0956 1.61863L2.79141 7.37704L10.1322 13.1713C10.4939 13.4564 10.5517 13.9756 10.2611 14.3305C10.0937 14.5326 9.85126 14.6383 9.60496 14.6383Z"
                                    fill="black" fillOpacity="0.65"/>
                            </svg>
                        </div>

                        {
                            this.state.selectedBtn === 1 && this.state.page_num && pageArray && pageArray.map((item, key) => {
                                return (
                                    <div
                                        className={this.state.current_page && this.state.current_page === item ? "product-btn justify-center btn-search" : "product-btn justify-center col-darkBlue"}
                                        key={key}
                                        onClick={() => this.onPageClick(item)}
                                    >
                                        {item}
                                    </div>
                                )
                            })
                        }

                        {
                            this.state.selectedBtn === 2 && this.state.history_page_num && history_pageArray && history_pageArray.map((item, key) => {
                                return (
                                    <div
                                        className={this.state.history_current_page && this.state.history_current_page === item ? "product-btn justify-center btn-search" : "product-btn justify-center col-darkBlue"}
                                        key={key}
                                        onClick={() => this.onPageClick(item)}
                                    >
                                        {item}
                                    </div>
                                )
                            })
                        }

                        <div
                            className="product-btn justify-center"
                            onClick={() => this.onPageClick(
                                this.state.selectedBtn === 1 ?
                                    this.state.page_num && this.state.page_num.total_page
                                    :
                                    this.state.history_page_num && this.state.history_page_num.total_page
                            )}
                        >
                            <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1.39506 14.6383C1.57978 14.6383 1.76643 14.5779 1.92229 14.457L10.077 8.02084C10.2752 7.86414 10.3906 7.62814 10.3906 7.37704C10.3906 7.12782 10.2752 6.88993 10.077 6.73512L1.95692 0.332906C1.59518 0.047818 1.06603 0.104458 0.775474 0.459402C0.484922 0.814346 0.542647 1.33355 0.904394 1.61863L8.2086 7.37704L0.867834 13.1713C0.506087 13.4564 0.448362 13.9756 0.738914 14.3305C0.906319 14.5326 1.14877 14.6383 1.39506 14.6383Z"
                                    fill="black" fillOpacity="0.65"/>
                            </svg>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        appointmentPaymentList: state.registers.appointmentPaymentList,
        paidAppointmentList: state.registers.paidAppointmentList,
    }
};

export default connect(
    mapStateToProps,
    {
        appointmentPaymentRequest,
        appointmentPaidRequest,
    }
)(PaymentsMenu);

