import React from 'react';
import '../assets/css/documents.css';
import PaymentsMenu from "./payments-menu";

function Payments() {
    return (
        <>
            <div className="documents-body">
                <div className="txt-24 col-black">Invoices and Payments</div>
                <PaymentsMenu/>
            </div>
        </>
    )
}
export default Payments;
