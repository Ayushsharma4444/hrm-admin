import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";

import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../axios";

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
const Contacts = () => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("inside this function");
    if (!localStorage.getItem("Token")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    let token = localStorage.getItem("Token");
    try {
      let isMounted = true;

      axios({
        method: "get",
        url: `/getallemployeeprofile`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log(response.data.resp);
          setInfo(response.data.resp);
        })
        .catch((err) => {
          console.log(err.response.data);
          toast(err.response.data.message, errorOption);
        });

      return () => {
        isMounted = false;
      };
    } catch (error) {
      console.log(error);
      toast(error.response.data.message, errorOption);
    }
  }, [loading]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "registrarId", headerName: "Registrar Id", width: 100 },
    {
      field: "name",
      headerName: "Name",
      cellClassName: "name-column--cell",
      width: 200,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 100,
    },
    { field: "phone", headerName: "Phone Number", width: 100 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "address", headerName: "Address", width: 250 },
    { field: "city", headerName: "City", width: 100 },
    { field: "zipCode", headerName: "Zip Code", width: 100 },
  ];
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="CONTACTS" subtitle="welcome to you Contacts" />
      </Box>
      <div>
        <div className="" style={{ overflowX: "scroll" }}>
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Mobile No.</th>
                
                <th>Team</th>
                <th>Join Date</th>
                <th>Role</th>
                <th>Gender</th>
                <th>IFSCcode</th>
                <th>Aadhar No</th>
                <th>Bank Acc No</th>
                <th>Bank Name</th>
                <th>Pan No</th>
                <th>Address</th>
                <th>Martial Status</th>
                <th>Nationality</th>
                <th>Religion</th>
                <th>Emergency Contact Name</th>
                <th>Emergency Contact Number</th>
                <th>Emergency Contact Relationship</th>
              </tr>
            </thead>
            <tbody>
              {info
                ? info.map((val) => {
                    return (
                      <tr>
                        <td data-column="Name">{val.EmployeeId.Name}</td>
                        <td data-column="Email">{val.EmployeeId.Email}</td>
                        <td data-column="MobileNo">{val.EmployeeId.MobileNo}</td>
                        <td data-column="Team">{val.Team}</td>
                        <td data-column="JoinDate">{val.EmployeeId.JoinDate}</td>
                        <td data-column="Role">{val.EmployeeId.Role}</td>
                        <td data-column="Gender">{val.Gender}</td>
                        <td data-column="IFSCcode">{val.IFSCcode}</td>
                        <td data-column="IdNo">{val.IdNo}</td>
                        <td data-column="BankAccNo">{val.BankAccNo}</td>
                        <td data-column="BankName">{val.BankName}</td>
                        <td data-column="PanNo">{val.PanNo}</td>
                        <td data-column="Address">{val.Address}</td>
                        <td data-column="Martial Status">{val.MartialStatus}</td>
                        <td data-column="Nationality">{val.Nationality}</td>
                        <td data-column="Religion">{val.Religion}</td>
                        <td data-column="Emergency Name">
                          {val.EmergencyContactName}
                        </td>
                        <td data-column="Emergency Number">
                          {val.EmergencyContactNumber}
                        </td>
                        {/* <td data-column="Job Title">{val.JoinDate}</td> */}
                        <td data-column="Emergency Relationship">
                          {val.EmergencyContactRelationship}
                        </td>                      
                      </tr>
                    );
                  })
                : "loading"}
            </tbody>
          </table>
        </div>
      </div>
    </Box>
  );
};

export default Contacts;
