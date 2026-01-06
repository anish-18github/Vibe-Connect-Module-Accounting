import './statement.css'


interface Props {
    customer: any;
}

const org = {
    name: 'VC Technologies',
    state: 'Maharashtra',
    country: 'India',
    email: 'support@codeegg.com',
};


const StatementPreview: React.FC<Props> = ({ customer }) => {
    return (
        <div className="statement">
            {/* TOP HEADER */}
            <div className="statement-header">
                <div>
                    <h6>To</h6>
                    <p className="fw-semibold">{customer.salutation}. {customer.display_name}
                        {customer?.address && (
                            <div
                                className="text-muted"
                                style={{ fontSize: '13px', lineHeight: '1.4' }}
                            >
                                <div>{customer.address.address1}</div>

                                <div>
                                    {customer.address.city}
                                </div>

                                <div>
                                    {customer.address.zip_code}, {customer.address.state}
                                </div>

                                <div>{customer.address.country}</div>
                            </div>
                        )}</p>

                </div>

                <div className="text-end">

                    <p className="fw-semibold">{org.name}
                        <div className='text-muted' style={{ fontSize: '13px', lineHeight: '1.4' }}>
                            <div>{org.state}</div>
                            <div>{org.country}</div>
                            <div>{org.email}</div>
                        </div>
                    </p>

                    <h5 className="fw-bold">Statement of Accounts</h5>
                    <p className="text-muted">01/01/2026 to 31/01/2026</p>
                </div>
                
            </div>

            {/* ACCOUNT SUMMARY */}
            <div className="account-summary">
                <h6>Account Summary</h6>
                <table>
                    <tbody>
                        <tr>
                            <td>Opening Balance</td>
                            <td>₹0.00</td>
                        </tr>
                        <tr>
                            <td>Invoiced Amount</td>
                            <td>₹2,000.00</td>
                        </tr>
                        <tr>
                            <td>Amount Received</td>
                            <td>₹2,000.00</td>
                        </tr>
                        <tr className="fw-bold">
                            <td>Balance Due</td>
                            <td>₹0.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* TRANSACTIONS */}
            <table className="statement-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Transactions</th>
                        <th>Details</th>
                        <th>Amount</th>
                        <th>Payments</th>
                        <th>Balance</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>01/01/2026</td>
                        <td>Opening Balance</td>
                        <td>—</td>
                        <td>0.00</td>
                        <td>—</td>
                        <td>0.00</td>
                    </tr>

                    <tr>
                        <td>05/01/2026</td>
                        <td>Invoice</td>
                        <td>INV-00002</td>
                        <td>2,000.00</td>
                        <td>—</td>
                        <td>2,000.00</td>
                    </tr>

                    <tr>
                        <td>05/01/2026</td>
                        <td>Payment Received</td>
                        <td>₹2,000 for INV-00002</td>
                        <td>—</td>
                        <td>2,000.00</td>
                        <td>0.00</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};



export default StatementPreview;
