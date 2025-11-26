import { useParams } from "react-router-dom";
import Tabs from "../../../../components/Tab/Tabs";
import Header from "../../../../components/Header/Header";



const ViewCustomer = () => {

    const { id } = useParams();

    const tabs = [
        {
            key: "overview",
            label: "Overview",
            content: renderOverview()
        },
        {
            key: "comments",
            label: "Comments",
            content: renderComments()
        },
        {
            key: "transactions",
            label: "Transactions",
            content: renderTransactions()
        },
        {
            key: "mails",
            label: "Mails",
            content: renderMails()
        },
        {
            key: "statements",
            label: "Statements",
            content: renderStatements()
        },
    ];

    function renderOverview() {
        return <div>#{id}</div>;

    }
    function renderComments() {
        return <div>Overview content here</div>;

    }
    function renderTransactions() {
        return <div>Overview content here</div>;

    }
    function renderMails() {
        return <div>Overview content here</div>;

    }
    function renderStatements() {
        return <div>Overview content here</div>;

    }

    return (
        <>
            <Header />
            <div style={{ marginLeft: "20px" }}>

                <Tabs tabs={tabs} defaultActiveKey="overview" />

            </div>
        </>
    );



};

export default ViewCustomer;
