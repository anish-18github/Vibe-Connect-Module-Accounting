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

            {/* FILTER BAR */}
            {/* <div className="statement-filters">
                <select className="statement-select">
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Quarter</option>
                    <option>This Year</option>
                    <option>Yesterday</option>
                    <option>Previous Week</option>
                    <option>Previous Month</option>
                    <option>Previous Quarter</option>
                    <option>Previous Year</option>
                    <option>Custom</option>
                </select>

                <select className="statement-select">
                    <option>Filter By: All</option>
                    <option>Invoices</option>
                    <option>Payments</option>
                    <option>Credits</option>
                </select>
            </div> */}


            {/* TOP HEADER */}
            <div className="statement-header">
                {/* <div>
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

                </div> */}

                {/* <div className="text-end">

                    <p className="fw-semibold">{org.name}
                        <div className='text-muted' style={{ fontSize: '13px', lineHeight: '1.4' }}>
                            <div>{org.state}</div>
                            <div>{org.country}</div>
                            <div>{org.email}</div>
                        </div>
                    </p>

                    <h5 className="fw-bold">Statement of Accounts</h5>
                    <p className="text-muted">01/01/2026 to 31/01/2026</p>
                </div> */}
                <table
                    width="100%"
                    cellPadding={0}
                    cellSpacing={0}
                    style={{ lineHeight: '18px' }}
                >
                    <tbody>
                        {/* ===== ORG DETAILS ROW ===== */}
                        <tr>
                            <td></td>

                            <td width="50%" style={{ textAlign: 'right' }}>
                                <b>{org.name}</b>
                                <br />
                                <span style={{ whiteSpace: 'pre-wrap', fontSize: '13px' }}>
                                    {org.state}
                                    {'\n'}
                                    {org.country}
                                    {'\n'}
                                    {org.email}
                                </span>
                            </td>
                        </tr>

                        {/* SPACER ROW */}
                        <tr style={{ height: '18px' }}></tr>

                        {/* ===== CUSTOMER + STATEMENT ROW ===== */}
                        <tr>
                            {/* CUSTOMER DETAILS */}
                            <td>
                                <table width="50%" cellPadding={0} cellSpacing={0}>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <b>To</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>
                                                    {customer.salutation}. {customer.display_name}
                                                </strong>
                                                {customer?.address && (
                                                    <div
                                                        style={{
                                                            fontSize: '13px',
                                                            lineHeight: '1.4',
                                                            marginTop: '4px',
                                                        }}
                                                    >
                                                        <div>{customer.address.address1}</div>
                                                        <div>{customer.address.city}</div>
                                                        <div>
                                                            {customer.address.zip_code},{' '}
                                                            {customer.address.state}
                                                        </div>
                                                        <div>{customer.address.country}</div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>

                            {/* STATEMENT TITLE */}
                            <td style={{ verticalAlign: 'bottom', textAlign: 'right' }}>
                                <table cellPadding={0} cellSpacing={0} width="100%">
                                    <tbody>
                                        <tr>
                                            <td
                                                style={{
                                                    paddingTop: '6px',
                                                    fontSize: '18px',
                                                    fontWeight: 700,
                                                    paddingBottom: 5,
                                                }}
                                            >
                                                Statement of Accounts
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: 'right' }}>
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        fontSize: '12px',
                                                        borderTop: '1px solid #000',
                                                        borderBottom: '1px solid #000',
                                                        padding: '4px 26px',
                                                    }}
                                                >
                                                    01/01/2026 To 31/01/2026
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>


            </div>

            {/* ACCOUNT SUMMARY */}
            {/* ACCOUNT SUMMARY */}
            <table
                width="100%"
                cellPadding={0}
                cellSpacing={0}
                style={{ lineHeight: '18px' }}
            >
                <tbody>
                    <tr>
                        {/* LEFT EMPTY SPACE */}
                        <td width="50%"></td>

                        {/* RIGHT SUMMARY COLUMN */}
                        <td width="50%" align="right" valign="bottom">
                            <table
                                width="80%"
                                cellPadding={5}
                                cellSpacing={0}
                                border={0}
                                style={{
                                    borderCollapse: 'collapse',
                                    marginRight: '0',   // IMPORTANT
                                    marginLeft: 'auto', // PUSH TO RIGHT
                                }}
                            >
                                <tbody>
                                    {/* HEADER */}
                                    <tr>
                                        <td
                                            colSpan={2}
                                            style={{
                                                backgroundColor: '#e8e8e8',
                                                borderBottom: '1px solid #dcdcdc',
                                                padding: '6px',
                                                fontWeight: 'bold',
                                                fontSize: '13px',
                                                textAlign: 'left',
                                            }}
                                        >
                                            Account Summary
                                        </td>
                                    </tr>

                                    <tr>
                                        <td width="60%" style={{ paddingTop: '6px' }}>
                                            Opening Balance
                                        </td>
                                        <td
                                            width="40%"
                                            style={{
                                                paddingTop: '6px',
                                                textAlign: 'right',
                                            }}
                                        >
                                            ₹ 0.00
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style={{ paddingTop: '4px' }}>
                                            Invoiced Amount
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            ₹ 2,000.00
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Amount Received</td>
                                        <td style={{ textAlign: 'right' }}>
                                            ₹ 2,000.00
                                        </td>
                                    </tr>

                                    <tr>
                                        <td
                                            style={{
                                                paddingTop: '6px',
                                                borderTop: '1px solid #000',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Balance Due
                                        </td>
                                        <td
                                            style={{
                                                paddingTop: '6px',
                                                borderTop: '1px solid #000',
                                                textAlign: 'right',
                                                fontWeight: 600,
                                            }}
                                        >
                                            ₹ 0.00
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>




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

                    {/* BALANCE DUE ROW */}
                    {/* <tr className="balance-due-row">
                        <td colSpan={5} className="text-end fw-semibold">
                            Balance Due
                        </td>
                        <td className="fw-semibold">₹0.00</td>
                    </tr> */}

                </tbody>
            </table>
            <table width="100%" style={{ borderTop: '1px solid #dcdcdc', marginTop: '6px' }}>
                <tbody>
                    <tr>
                        <td width="55%"></td>

                        <td width="45%">
                            <table width="100%">
                                <tbody>
                                    <tr>
                                        <td
                                            width="60%"
                                            align="right"
                                            style={{ padding: '8px 6px', fontWeight: 600 }}
                                        >
                                            Balance Due
                                        </td>
                                        <td
                                            align="right"
                                            style={{ padding: '8px 6px' }}
                                        >
                                            ₹ 0.00
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
};



export default StatementPreview;
