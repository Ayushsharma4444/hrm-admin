import React, { useEffect, useState } from "react";
import { Box,  useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import axios from "../../axios";
import { toast, ToastContainer } from "react-toastify";

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

const Vendor = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [VendorEmail, setVendorEmail] = useState("");
  const [VendorName, setVendorName] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [isValid, setIsValid] = useState(false);

  const pattern = /^[a-zA-Z0-9._%+-]+@ajiledone\.com$/;
  // console.log(VendorEmail, role, mobileNo, joinDate, VendorName, lastName)

  function handleChange(e) {
    setVendorEmail(e.target.value);
    setIsValid(pattern.test(e.target.value));
  }
  useEffect(() => {
    if (!localStorage.getItem("Token")) {
      navigate("/login");
    }
  }, []);

  let token = localStorage.getItem("Token");

  useEffect(() => {
    let isMounted = true;

    axios({
      method: "get",
      url: `/getvendor`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setEmployeeData(response.data.res);
        console.log(response.data.res);
      })
      .catch((err) => {
        console.log(err.response);
        toast(err.response.data.message, errorOption);
      });

    return () => {
      isMounted = false;
    };
  }, [loading]);



  const handleSubmitInput = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(VendorName,
        VendorEmail)
    try {
      const savedResponse = await axios({
        method: "post",
        url: "/addvendor",
        data: {
          vendorName: VendorName,
          vendorEmail: VendorEmail,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (savedResponse.data.status) {
        setLoading(false);
        toast(savedResponse.data.message, succesOption);
        setVendorEmail(null);
        setVendorName(null);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setVendorEmail(null);
      setVendorName(null);
      if (error.response.data.message === "something went wrong") {
        toast(error.response.data.message, errorOption);
      } else {
        toast(error.response.data.message, warningOption);
      }
    }
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "Id" },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      cellClassName: "name-column--cell",
    },
    {
      field: "VendorEmail",
      headerName: "VendorEmail",
      type: "string",
      headerAlign: "left",
      align: "left",
    },
    { field: "mobile", headerName: "Mobile", width: 100 },
    { field: "JoinDate", headerName: "Join Date", width: 100 },
  ];

  return (
    <div id ='vendor'>
    <Box m="20px" >
      <ToastContainer />
      <Popup
       className="my-popup"
        trigger={(open) => (
          <div className="popup-header-div">
            <button className="employee-button-popup">Add-Vendor</button>
          </div>
        )}
        position="center"
        closeOnDocumentClick
      >
        <h1 className="addemployee-header-name">Add Vendor</h1>
        <form onSubmit={handleSubmitInput}>
          <div className="Add-employees-mainDiv" style={{display:'block'}}>
            <div className="add-VendorName" >
              <label className="addemployee-label" for="VendorEmail">
                Vendor Name
              </label>
              <input
                className="addemployee-input"
                id="First Name"
                type="text"
                onChange={(e) => {
                  setVendorName(e.target.value);
                }}
              />
            </div>
            <div className="add-VendorName">
              <label className="addemployee-label" for="VendorEmail">
                Vendor Email
              </label>
              <input
                className="addemployee-input"
                id="First Name"
                type="text"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="add-employee-button-div">
          {isValid ? (
            loading ? (
              <div className="loading-div">
                <button className="loading"></button>
              </div>
            ) : (
              <button className="register-button" type="submit">
                Submit
              </button>
            )
          ) : (
            <button className="register-button" type="submit" disabled>
            Submit
            </button>
          )}
          </div>
        </form>
      </Popup>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Vendor" subtitle="" />
      </Box>
      <div className="">
        <table>
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Vendor Email</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((currEmployee) => {
              return (
                <tr>
                  <td data-column="Vendor Name">{currEmployee.VendorName}</td>
                  <td data-column="Vendor Email">
                  {currEmployee.VendorEmail}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Box>
    </div>
  );
};

export default Vendor;
