import {
  DollarSign,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

const rentHistory = [
  {
    id: 1,
    month: "November 2025",
    amount: 2500,
    status: "Paid",
    datePaid: "2025-11-05",
    statusColor: "green",
  },
  {
    id: 2,
    month: "October 2025",
    amount: 2500,
    status: "Paid",
    datePaid: "2025-10-08",
    statusColor: "green",
  },
  {
    id: 3,
    month: "September 2025",
    amount: 2500,
    status: "Paid",
    datePaid: "2025-09-03",
    statusColor: "green",
  },
  {
    id: 4,
    month: "August 2025",
    amount: 2500,
    status: "Paid",
    datePaid: "2025-08-07",
    statusColor: "green",
  },
  {
    id: 5,
    month: "July 2025",
    amount: 2500,
    status: "Paid",
    datePaid: "2025-07-05",
    statusColor: "green",
  },
  {
    id: 6,
    month: "June 2025",
    amount: 2500,
    status: "Paid",
    datePaid: "2025-06-10",
    statusColor: "green",
  },
];

const DashBoard = () => {
  const [payPayment, setPayPayment] = useState(false);
  const [payPaymentSuccessFully, setPayPaymentSuccessFully] = useState(false);
  const showPaymentMessage = () => {
    setPayPaymentSuccessFully(true);
    setTimeout(() => {
      setPayPaymentSuccessFully(false);
      setPayPayment(true);
    }, 3000);
  };
  //  --------------------------------------------------------
  const [validating, setvalidating] = useState("");
  const stopValidating =(e)=> {
    e.preventDefault();
    setvalidating("");
    SubmitIssue();
  };
  const [IssueSubmit, setIssueSubmit] = useState(false);
  const SubmitIssue = () => {
    setIssueSubmit(true);
    setTimeout(() => {
      setIssueSubmit(false);
    }, 3000);
  };
  return (
    <div className="p-5 w-full ">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 font-semibold text-xl mb-2">
          Tenant Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome back! Manage your rent and view payment history.
        </p>
      </div>

      {/* --------------------------------------------- */}
      <div className="border border-gray-300 p-4 mt-6 w-full bg-gray-50 rounded-xl">
        <p className="flex text-lg">
          <span className="mt-0.5 text-blue-700">
            <DollarSign />
          </span>{" "}
          Current Rent Status
        </p>

        {/* ----------------------------------------------- */}
        {/* Success Toast */}
        {payPaymentSuccessFully && (
          <div
            className="fixed top-18 right-4 z-5 bg-green-600 text-white
            px-6 py-3 rounded-lg shadow-lg  flex items-center gap-3  transform transition-all duration-400  translate-x-0 opacity-100
            animate-bounce"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Payment processed successfully!</span>
          </div>
        )}
        {/* ---------------------------------------------- */}
        {/* cards section  */}
        <div className="relative">
          <div className="grid md:grid-cols-3 w-full grid-cols-1 gap-8 mt-3">
            <div className="p-5 border border-gray-400 rounded-xl bg-blue-400 hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out ">
              <p className="text-lg ">Shop Number</p>
              <h1 className="font-semibold text-2xl">S-205</h1>
            </div>

            <div className="p-5 border border-gray-400 rounded-xl  hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out ">
              <p className="text-lg ">Monthly Rent</p>
              <h1 className="font-semibold text-2xl">$2,500</h1>
            </div>

            <div className="p-5 border border-gray-400 rounded-xl  hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out ">
              {payPayment ? (
                <div>
                  <p className="text-lg ">Payment Status</p>
                  <h1 className="font-semibold gap-1 text-green-400 flex text-xl">
                    <CheckCircle className="w-5  h-5 mt-1 text-green-400" />
                    Paid
                  </h1>
                </div>
              ) : (
                <div>
                  <p className="text-lg ">Payment Status</p>
                  <h1 className="font-semibold gap-1 text-red-400 flex text-xl">
                    <AlertCircle className="w-5  h-5 mt-1 text-red-400" />{" "}
                    Unpaid
                  </h1>
                </div>
              )}
            </div>
            {/* card section end  */}
          </div>
          {/* --------------------------------------------------- */}
          {payPayment ? (
            <div className="bg-green-50 grid grid-cols-1 mt-4 gap-2  border border-green-200 rounded p-3">
              <div className="flex gap-1.5">
                <h1>
                  <CheckCircle className="w-5 h-5 mt-1 text-green-500 " />
                </h1>
                <p className="text-lg text-gray-600">Payment Confirmed</p>
              </div>
              <p className="text-sm">
                Your December rent has been received. Thank you for your prompt
                payment!
              </p>
            </div>
          ) : (
            <div className="bg-red-50 grid grid-cols-1 mt-4 gap-2  border border-red-200 rounded p-3">
              <div className="flex gap-1.5">
                <h1>
                  <AlertCircle className="w-5 h-5 mt-1 text-red-500 " />
                </h1>
                <p className="text-lg text-gray-600">Payment Due</p>
              </div>
              <p className="text-sm">
                Your December rent of $2,500 is due on December 5, 2025. Please
                make payment to avoid late fees.
              </p>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* button for pay payment  */}
          <div className="flex justify-center items-center w-full ">
            <button
              onClick={() => showPaymentMessage()}
              className="text-lg font-semibold py-2 px-18 mt-3 bg-blue-500 cursor-pointer hover:bg-blue-600  hover:shadow-xl  ease-in-out transition-all duration-450  active:scale-95 p-3 rounded-lg"
            >
              Pay Now
            </button>
          </div>
          {/* ------------------------------------- */}
        </div>
      </div>
      {/* ========================================================== */}

      {/* Issue Success Toast */}
      {IssueSubmit && (
        <div
          className="fixed top-18 right-4 z-5 bg-green-600 text-white
            px-6 py-3 rounded-lg shadow-lg  flex items-center gap-3  transform transition-all duration-400  translate-x-0 opacity-100
            animate-bounce"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Issue reported successfully! Admin will be notified.</span>
        </div>
      )}

      <div className="w-full border border-gray-400 rounded-xl mt-5 p-4">
        <h1 className="flex gap-2 font-semibold">
          <span>
            <MessageSquare className="w-5 h-5 mt-1" />
          </span>
          Report an Issue
        </h1>
        <p className="text-sm pt-3">
          Having a problem? Let us know and we'll get back to you as soon as
          possible.
        </p>

        <form onSubmit={stopValidating}>
          <div className="flex  flex-col  mt-3">
            <label className="mb-2 text-lg" htmlFor="issue">
              Issue Description *
            </label>
            <textarea
              value={validating}
              onChange={(e) => {
                setvalidating(e.target.value);
              }}
              placeholder="Describe your Issue in Detail..."
              required
              id="issue"
              name="issueDescription"
              rows={5}
              className="border resize-none  border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded p-2 w-full"
            ></textarea>
            <p className="text-sm mt-3">
              Your issue will be sent to the admin and displayed on their
              dashboard
            </p>
          </div>
          <div className="flex justify-center items-center">
            <button className="flex gap-3 text-lg font-semibold py-2 px-13 mt-3 bg-blue-500 cursor-pointer hover:bg-blue-600  hover:shadow-xl  ease-in-out transition-all duration-450  active:scale-95 p-3 rounded-lg ">
              {" "}
              <MessageSquare className="w-5 h-5 mt-1" /> Submit Issue{" "}
            </button>
          </div>
        </form>
      </div>
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mt-6">
        <div className="p-5 border text-white border-gray-400 rounded-xl bg-blue-600 hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out">
          <div className="bg-blue-600 py-1 rounded-md w-fit">
            <Calendar className=" text-white" />
          </div>
          <div className="mt-1">
            <h1 className="text-lg font-semibold">5th</h1>
            <p>Due Date (Monthly)</p>
          </div>
        </div>

        <div className="p-5 border  border-gray-400 rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out">
          <div className="bg-green-200 p-2 rounded-md w-fit">
            <CheckCircle className=" text-green-700" />
          </div>
          <div className="mt-1">
            <h1 className="text-lg font-semibold">6</h1>
            <p>Payments Made</p>
          </div>
        </div>

        <div className="p-5 border  border-gray-400 rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out">
          <div className="bg-blue-200 p-2 rounded-md w-fit">
            <DollarSign className=" text-blue-700" />
          </div>
          <div className="mt-1">
            <h1 className="text-lg font-semibold">$15,000</h1>
            <p>Total Paid</p>
          </div>
        </div>

        <div className="p-5 border  border-gray-400 rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out">
          <div className="bg-yellow-200 p-2 rounded-md w-fit">
            <FileText className=" text-yellow-700" />
          </div>
          <div className="mt-1">
            <h1 className="text-lg font-semibold">Dec 31, 2026</h1>
            <p>Agreement End</p>
          </div>
        </div>
      </div>
      {/* ---------------------------------------------------- */}
      <div className="border border-gray-200 p-3 mt-6 rounded-lg bg-gray-100">
        <h1 className="flex gap-3 text-lg font-semibold ">
          <span className=" w-5 h-5">
            <FileText />
          </span>
          Rent History
        </h1>
        <div
          id="custom-scrollbar"
          className="w-full  bg-white mt-4 border border-gray-400 rounded-t-2xl rounded-b-lg overflow-x-scroll lg:overflow-x-hidden  relative"
        >
          <table className="lg:w-full min-w-[1000px] text-left border-collapse">
            {/* Table Head */}
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date Paid</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y">
              {rentHistory.map((e, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors ">
                  <td className="py-2 px-4">{e.month}</td>
                  <td className="py-2 px-4">{e.amount}</td>
                  <td className="py-2 px-4 flex gap-1 text-green-600 bg-green-200  rounded-2xl h-6 w-16 justify-center text-sm mt-2 ml-2   items-center"><span ><CheckCircle className="w-3 h-3 mt-0.5"/></span>{e.status}</td>
                  <td className="py-2 px-4">{e.datePaid || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Extra content outside table */}
          <div className=" pt-2 bg-gray-50  text-center">
            {/* This is outside the table */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
