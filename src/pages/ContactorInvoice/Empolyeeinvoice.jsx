import React, { useState, useEffect, useContext  } from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "../../axios";
import { toast, ToastContainer } from "react-toastify";
import { EmailContext } from "../../Context/Context";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Excel from "../Excel/Excel";
import Popup from "reactjs-popup";
import { useParams } from "react-router-dom";


const succesOption = {
  position: "bottom-right",
  type: "success",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const warningOption = {
  position: "bottom-right",
  type: "warning",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const errorOption = {
  position: "bottom-right",
  type: "error",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};



const Empolyeeinvoice = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [tamt, setTamt] = useState(0);
  const [invoiceData, setInvoiceData] = useState();
  const [mesge, setmessage] = useState();
  // const { queryId, setQueryId } = useContext(EmailContext);
  const [dateFrom, setDateFrom] = useState("yyyy-mm-dd");
  const [loading, setLoading] = useState(false)
  const [dateTo, setDateTo] = useState("yyyy-mm-dd");
  const [dateFrom2, setDateFrom2] = useState("yyyy-mm-dd");
  const [dateTo2, setDateTo2] = useState("yyyy-mm-dd");
  const [dateLoading, setDateLoading] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [pdf, setPdf] = useState(null);

  const { pan } = useParams();
  const handleTotal = (newArr) =>{
    var total = 0
    for (var i = 0; i < newArr.length; i++){
      total += Number(newArr[i].Amount)
    }
    // console.log(total)
    return total
  }

  const handleMailSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    const formData = new FormData()
    formData.append('PDF', pdf)

    try {
      const response = await axios.post("/sendtimesheet", formData)

      console.log(response);
      if (response.data.status) {
        toast(response.data.Messgae, succesOption);
        setPdf(null)
      }
    } catch (error) {     
      if (
        error.response.data.message === "Please fill required fields properly"
      ) {
        toast(error.response.data.message, warningOption);
      } else {
        toast(error.response.data.message, errorOption);
      }
    }
  };

  useEffect(()=>{
    if(loading){
      getData()
    }
  }, [loading])

  const getData = () =>{
    try {
      let isMounted = true;

      axios({
        method: "get",
        url: 
        `/getinvoiceofemployee?startDate=${dateFrom}&endDate=${dateTo}&employeeId=${pan}`
      })
        .then((response) => {
          setInvoiceData(response.data.savedInvoice);
          setInvoiceId(response.data.savedInvoice._id)
          setTamt(handleTotal(response.data.savedInvoice.Table))
        })
        .catch((err) => {
          console.log(err.response);
          toast(err.response.data.message, errorOption);
          setmessage(err.response.data.message);
          console.log(mesge)
          // setLoading(err.response.data.message)
        });

      return () => {
        isMounted = false;
      };
    } catch (error) {
      console.log(error);
      toast(error.response.data.message, errorOption);
    }
  }
console.log(invoiceId)
  const handleApproveSubmit = async (e) => {
    let token = localStorage.getItem("Token");
    e.preventDefault();
    // setDateLoading(true);

    try {
      const response = await axios({
        method: "patch",
        url: "/approveinvoicebyadmin",
        data: {
          invoiceId: invoiceId
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response) {
        setLoading(!loading)
        toast(response.data.message, succesOption);
      }
    } catch (error) {
      if (error.response) {
        toast(error.response.data.message, warningOption);
      } else {
        toast(error.response.data.message, errorOption);
      }
    }
  };


  function reverseDate(val) {
    var arr = val.split('-')
    arr.reverse()
    var newDate = arr.join('-')
    return newDate
    }
    function sliceDate(val){
      let dat = val.slice(0,10)
      return dat
    }
 console.log(dateFrom)
//  console.log(loading)
 

  return (
    <>
    <div className="date-invoice">
          <h1>From:</h1>
          <input
            type="date"
            name=""
            id=""
            onChange={(e) => {
              let date = reverseDate(e.target.value)
              setDateFrom(date);
              setDateFrom2(e.target.value)
            }}
            value={dateFrom2}
          />
          <h1>To:</h1>
          <input
            type="date"
            name=""
            id=""
            onChange={(e) => {
              let date = reverseDate(e.target.value)
              setDateTo(date);
              setDateTo2(e.target.value)
            }}
            value={dateTo2}
          />
          <button className="date-submit" onClick={getData}>Submit</button>
         
        </div>
  { invoiceData ? 
  <>
  <div style={{display:'flex', justifyContent:'space-around'}}>
  {invoiceData.Approve?  <Button variant="primary" style={{background:'#2e7d32'}}>Approved</Button>: <Button variant="primary" style={{background:'rgb(255 215 0)',color:'black'}} onClick={handleApproveSubmit} >Approve</Button>}
 
  <ReactHTMLTableToExcel
    id="test-table-xls-button"
    className="download-table-xls-button"
    table="table-to-xls"
    filename="tablexls"
    sheet="tablexls"
    buttonText="Download as XLS"
  />
  <div className="sabnav" >
      {/* <button > */}
        {/* <a href="mail to:pandeyvikas224705@gmail.com">Send Mail</a> */}
        <Popup
          className="my-popup"
          trigger={(open) => (
            <div className="popup-header-div">
              <button className="employee-button-popup" >
              Send Mail
              </button>
            </div>
          )}
          position="center"
          closeOnDocumentClick
        >
          <h2 className="holiday-popup-heading">Send Mail</h2>
          <form onSubmit={handleMailSubmit}>
            <div className="holiday-popup-main-div">
            {pdf && (
              <Box mt={2} textAlign="center">
                <div style={{color:"black"}}>{pdf.name}</div>
              </Box>
            )}


            <input 
                name="file"
                type="file"
                id='excel-file'
                accept="application/pdf"
                onChange={(e) => {
                  setPdf(e.target.files[0]);
                }}
              />
              
              {dateLoading ? (
                <div className="loading-div">
                  <button className=" loading"></button>
                </div>
              ) : (
                <button className="login-button" type="submit">
                  Submit
                </button>
              )}
            </div>
          </form>
        </Popup>
      {/* </button> */}
    </div>
    </div>
  <Excel invoiceData={invoiceData}/>
  
 
  <div className="invoice-index">
  <ToastContainer/>
  
    <div className="invoice-heading">
      <h1>Bill of Supply</h1>
      <p>Original For</p>
    </div>
    <div className="invoice-body">
      <div className="invoice-data">
        <div className="invoice-row">
          <h3>Invoice Number:</h3>
          <span>{invoiceData.InvoiceNo}</span>
        </div>
        <div className="invoice-row">
          <h3>Service Number:</h3>
          <span>{invoiceData.ServiceNo}</span>
        </div>
      </div>

      <div className="invoice-data">
        <div className="invoice-row">
          <h3>Invoice Date:</h3>
          <span>{sliceDate(invoiceData.InvoiceDate)}</span>
        </div>
        <div className="invoice-row">
          <h3>Service Period:</h3>
          <span>
            {sliceDate(invoiceData.DateFrom)} - {sliceDate(invoiceData.DateTo)}
          </span>
        </div>
      </div>
      <div className="invoice-info">
        <div className="buy-sell">
          <h3>Employee</h3>
          {/* <h3 style={{ paddingRight: "330px" }}>Buyer:</h3> */}
        </div>
        <div className="buy-sell">
          <div className="invoice-row">
            <h3>Name:</h3>
            <div className="form__group field">
              <span>{invoiceData.Name}</span>
            </div>
          </div>
          <div className="invoice-row">
            <h3>Company Name:</h3>
            <span>
              <strong>AJILEDONE TECHNOLOGIES PVT. LTD.</strong>
            </span>
          </div>
        </div>
        <div className="buy-sell">
          <div className="invoice-row">
            <h3>Address:</h3>
            <span>{invoiceData.Address}</span>
          </div>
          <div className="invoice-row">
            <h3>Company Address:</h3>
            <address>
              P-31 Second Floor, Gurubagh Colony <br /> Chandigarh Road,
              Ludhiana-141010 <br />
              Supplier State Code : 03 - Punjab
            </address>
          </div>
        </div>
        <div className="buy-sell">
          <div className="invoice-row">
            <h3>Aadhaar:</h3>
            <span>{invoiceData.Aadhar}</span>
          </div>

          <div className="invoice-row">
            <h3>CIN:</h3>
            <span>U72900PB2021PTC053634</span>
          </div>
        </div>
       {/* codedbydurgesh */}
        <div className="buy-sell">
          <div className="invoice-row">
            <h3>Pan Number:</h3>
            <span>{invoiceData.Pan}</span>
          </div>
          <div className="invoice-row">
            <h3>URN:</h3>
            <span>UDYAM-PB-12-0039948</span>
          </div>
        </div>
        <div className="buy-sell">
          <div className="invoice-row">
            <h3>Phone:</h3>
            <span>{invoiceData.Phone}</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}></div>
        <table className="invoice-headings">
          <th className="invoice-head">
            <td>S.NO.</td>
            <td>PARTICULARS</td>
            {/* <td>REMARKS</td> */}
            <td>AMOUNT</td>
          </th>
          {invoiceData.Table.map((val, index) => {
            return (
              <tr className="invoice-head table-data-space">
                <td>{index + 1}</td>
                <td>{val.Particular}</td>
                {/* <td>{val.Remark}</td> */}
                <td>{val.Amount}</td>
              </tr>
            );
          })}

          <div className="invoice-head table-data-space">
            <h3></h3>
            <h3></h3>
            <h3 style={{ paddingLeft: "25%" }}>Total</h3>
            <TextField
              required
              id="standard-required"
              value={tamt}
              type="number"
              variant="standard"
              onChange={(e) => {
                setTamt(e.target.value);
              }}
            />
          </div>
        </table>
        <div className="buy-sell">
          <div className="invoice-row">
            <h3>Amount in words:</h3>
            <span>{invoiceData.AmountInWord}</span>
          </div>
        </div>
        <div className="buy-sell">
          <h3>Bank Details:-</h3>
        </div>
        <div className="buy-sell">
          <div className="invoice-row">
            <h3>Bank Name:</h3>
            <span>{invoiceData.BankName}</span>
          </div>
        </div>
        <div className="buy-sell">
          <div className="invoice-row">
            <h3>A/c No.:</h3>
            <span>{invoiceData.AccountNumber}</span>
          </div>
        </div>
        <div className="buy-sell">
          <div className="invoice-row">
            <h3>Branch & IFSC code:</h3>
            <span>{invoiceData.IFSC}</span>
          </div>
        </div>
        <div className="buy-sell">
          <h3></h3>
          <span></span>
          <h3>For</h3>
          <span></span>
        </div>

        <div className="buy-sell">
          <h3></h3>
          <span></span>

          <span>
            
              <Box mt={2} textAlign="center">
                {/* <div>Image Preview:</div> */}
                <img
                  src= {`https://hrportal-kzxr6.ondigitalocean.app${invoiceData.Sign.slice(17)}`}
                  alt='Sign'
                  height="50px"
                  width="160px"
                  accept="Image/*"
                />
              </Box>
            <h3>
              Authorised Signatory
              <input
                accept="image/*"
                type="file"
                id="select-image"
                style={{ display: "none" }}
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
              <label htmlFor="select-image">
                {/* <Button variant="contained" color="primary" component="span">
                  Upload Image
                </Button> */}
              </label>
            </h3>
          </span>
        </div>
      </div>
    </div>
    <div className="invoice-heading">
      <h1>This is a computer generated invoice</h1>
      <p>JURISDICTION COMES UNDER MSME SUBJECT TO LUDHIANA JURISDICTION</p>
    </div>
  </div> 
  </>
  : 
  <>
  {
    mesge?
    <>
    <div className="notfound_data">
      <h1>{mesge}</h1>
    </div>
    </>
    :
    <>
    <div className="submit_date">
      <h1>Submit date</h1>
    </div>
    </>
  }
  </>}

  </>
  );
};

export default Empolyeeinvoice;