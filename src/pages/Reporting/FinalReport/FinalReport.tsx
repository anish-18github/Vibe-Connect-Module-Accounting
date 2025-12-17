import { Edit3, Download } from "react-feather"; // Replace LogOut with Download
import { pdf } from '@react-pdf/renderer';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/NavBar";
import { dashboardTabs } from "../../Dashboard/dashboard";
import { useNavigate } from "react-router-dom";


const FinalReport = () => {

    const navigate = useNavigate();

    const exportToPDF = async () => {
        const tableElement = document.querySelector('.item-table-inner');

        if (tableElement) {
            const canvas = await html2canvas(tableElement as HTMLElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 10;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight + 10;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('cash-flow-statement.pdf');
        }
    };


    return (
        <>
            <Header />

            <div style={{ padding: '56px 0px 0px' }}>
                <Navbar tabs={dashboardTabs} />
                <div className="item-card mx-5 my-4">
                    {/* Top bar: Edit / Export buttons */}
                    <div className="d-flex justify-content-between align-items-center mb-3 m-3">
                        <button
                            type="button"
                            className="btn btn-sm d-inline-flex align-items-center border"
                            onClick={() => navigate('/reporting/create-custom-report/profitloss')}
                        >
                            <Edit3 size={14} className="me-1" />
                            Edit Customer Report
                        </button>


                        <button
                            type="button"
                            className="btn btn-sm border d-inline-flex align-items-center"
                            onClick={exportToPDF}
                        >
                            <Download size={14} className="me-1" />
                            Export
                        </button>
                    </div>

                    {/* Org + customer names */}
                    <div className="text-center mb-2">
                        <div className="fw-semibold text-uppercase small text-muted">vc</div>
                        <div className="fw-semibold">Customer A</div>
                    </div>

                    <div className="item-card-header d-flex justify-content-between align-items-center">
                        <span className="item-card-title">Cash Flow Statement</span>
                    </div>

                    <div className="item-card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <table className="table table-sm align-middle item-table-inner">
                                    <thead>
                                        {/* Date row */}
                                        <tr>
                                            <th></th>
                                            <th className="text-end border-start border-end">
                                                <span className="small text-muted">
                                                    29/06/2024 - 05/07/2024
                                                </span>
                                            </th>
                                            <th className="text-end border-start border-end">
                                                <span className="small text-muted">
                                                    29/06/2025 - 05/07/2025
                                                </span>
                                            </th>
                                        </tr>

                                        {/* Labels row */}
                                        <tr>
                                            <th className="fw-medium text-dark">Account</th>
                                            <th className="fw-medium text-dark text-end border-start border-end border-bottom">
                                                Total
                                            </th>
                                            <th className="fw-medium text-dark text-end border-start border-end border-bottom">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr className="table-light">
                                            <td className="fw-semibold">Beginning Cash Balance</td>
                                            <td className="text-end">0.00</td>
                                            <td className="text-end">0.00</td>
                                        </tr>

                                        <tr>
                                            <td className="fw-semibold pt-3">
                                                Cash Flow from Operating Activities
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>

                                        <tr>
                                            <td className="ps-4 fw-semibold text-muted">
                                                Non-cash adjustments
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>

                                        <tr className="table-borderless">
                                            <td className="ps-5">
                                                <a href="#" className="text-primary text-decoration-none">
                                                    Advance Tax
                                                </a>
                                            </td>
                                            <td className="text-end">0.00</td>
                                            <td className="text-end">0.00</td>
                                        </tr>

                                        <tr className="table-borderless">
                                            <td className="ps-5">
                                                <a href="#" className="text-primary text-decoration-none">
                                                    Accounts Payable
                                                </a>
                                            </td>
                                            <td className="text-end">0.00</td>
                                            <td className="text-end">0.00</td>
                                        </tr>

                                        <tr className="table-borderless">
                                            <td className="ps-5">
                                                <a href="#" className="text-primary text-decoration-none">
                                                    Employee Advance
                                                </a>
                                            </td>
                                            <td className="text-end">0.00</td>
                                            <td className="text-end">0.00</td>
                                        </tr>

                                        <tr className="table-borderless">
                                            <td className="ps-5">
                                                <a href="#" className="text-primary text-decoration-none">
                                                    Opening Balance Adjustments
                                                </a>
                                            </td>
                                            <td className="text-end">0.00</td>
                                            <td className="text-end">0.00</td>
                                        </tr>

                                        <tr className="table-borderless">
                                            <td className="ps-5">
                                                <a href="#" className="text-primary text-decoration-none">
                                                    Net Income
                                                </a>
                                            </td>
                                            <td className="text-end">0.00</td>
                                            <td className="text-end">0.00</td>
                                        </tr>

                                        <tr className="table-light">
                                            <td className="ps-4 fw-semibold">Non-cash adjustments Total</td>
                                            <td className="text-end">0.00</td>
                                            <td className="text-end">0.00</td>
                                        </tr>

                                        <tr className="table-light">
                                            <td className="fw-semibold">
                                                Net cash provided by Operating Activities
                                            </td>
                                            <td className="text-end">0.00</td>
                                            <td className="text-end">0.00</td>
                                        </tr>

                                        <tr>
                                            <td className="fw-semibold pt-3">
                                                Cash Flow from Investing Activities
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>

                                        <tr className="table-light">
                                            <td className="fw-semibold">
                                                Net cash provided by Investing Activities
                                            </td>
                                            <td className="text-end">0.00</td>
                                            <td className="text-end">0.00</td>
                                        </tr>

                                        <tr>
                                            <td className="fw-semibold pt-3">
                                                Cash Flow from Financing Activities
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>

                                        <tr className="table-light">
                                            <td className="fw-semibold">
                                                Net cash provided by Financing Activities
                                            </td>
                                            <td className="text-end">0.00</td>
                                            <td className="text-end">0.00</td>
                                        </tr>

                                        <tr className="table-light">
                                            <td className="fw-semibold">Net Change in cash</td>
                                            <td className="text-end">0.00</td>
                                            <td className="text-end">0.00</td>
                                        </tr>

                                        <tr className="table-light">
                                            <td className="fw-semibold">Ending Cash Balance</td>
                                            <td className="text-end">0.00</td>
                                            <td className="text-end">0.00</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <p className="mt-2 mb-0 small text-muted">
                                    **Amount is displayed in your base currency{' '}
                                    <span className="badge bg-success">INR</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </>
    );
}

export default FinalReport;