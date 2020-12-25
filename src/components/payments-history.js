import React, { Component } from 'react';
import '../assets/css/documents.css';
import PaymentsMenu from "./payments-menu";
class PaymentsHistory extends Component {
    render() {
        return (
            <>
                <div className="documents-body">
                    <div className="txt-24 col-black">Payments</div>
                    <PaymentsMenu />
                </div>
            </>
        )
    }
}
export default PaymentsHistory;