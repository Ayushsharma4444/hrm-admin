import React, { useContext, useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import axios from "../axios";
import { toast, ToastContainer } from "react-toastify";
import { QuaryContext } from "../Context/QuaryContext";

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

const Invoice = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  // const{ Pan, setPan}= useContext(QuaryContext);

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
      url: `/getcontractors`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        console.log(response.data.savedContractorProfile);
        setEmployeeData(response.data.savedContractorProfile);
      })
      .catch((err) => {
        console.log(err.response);
        toast(err.response.data.message, errorOption);
      });

    return () => {
      isMounted = false;
    };
  }, [loading]);

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
    <Box m="20px">
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="" subtitle="" />
      </Box>
      <div className="">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((currEmployee) => {
              return (
                <tr>
                  {/* {setPan = currEmployee.PanNo} */}
                  <td data-column="Vendor Name">{currEmployee.ContractorName}</td>
                  <td data-column="Vendor Email">
                  {currEmployee.ContractorEmail}
                  </td>
                  <td><p className="btn btn-info" onClick={()=>navigate(`/invoice/contrator/${currEmployee._id}`)} >Invoice</p></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Box>
  );
};

export default Invoice;
