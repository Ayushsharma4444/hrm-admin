import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import { mockDataEmployee } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
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

const Team = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [contractorName, setContractorName] = useState('');
  const [salary, setsalary] = useState('');

console.log(contractorName)

  const pattern = /^[a-zA-Z0-9._%+-]+@ajiledone\.com$/;
  // console.log(email, role, mobileNo, joinDate, firstName, lastName)

  function handleChange(e) {
    setEmail(e.target.value);
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
      url: `/getallemployees`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setEmployeeData(response.data.res);
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
    try {
      const savedResponse = await axios({
        method: "post",
        url: "addemployee",
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobileNo: mobileNo,
          joinDate: joinDate,
          role: role,
          contractor: contractorName,
          salary:salary,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (savedResponse.data.status) {
        setLoading(false);
        toast(savedResponse.data.message, succesOption);
        setEmail(null);
        setFirstName(null);
        setJoinDate(null);
        setRole(null);
        setLastName(null);
        setMobileNo(null);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setEmail(null);
      setFirstName(null);
      setJoinDate(null);
      setRole(null);
      setLastName(null);
      setMobileNo(null);
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
      field: "email",
      headerName: "Email",
      type: "string",
      headerAlign: "left",
      align: "left",
    },
    { field: "mobile", headerName: "Mobile", width: 100 },
    { field: "JoinDate", headerName: "Join Date", width: 100 },
  ];
  console.log(joinDate)
  return (
    <Box m="20px">
      <ToastContainer />
       <div className="popup-header-div">
      <Popup
        trigger={(open) => (
            <button className="employee-button-popup">Add-Employee</button>
        )}
        position="center"
        closeOnDocumentClick
      >
        <h1 className="addemployee-header-name">Add Employees</h1>
        <form onSubmit={handleSubmitInput}>
          <div className="Add-employees-mainDiv">
            <div className="add-firstname">
              <label className="addemployee-label" for="Email">
                First Name
              </label>
              {/* codedbydurgesh */}
              <input
                className="addemployee-input"
                id="First Name"
                type="text"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </div>
            <div className="add-firstname">
              <label className="addemployee-label" for="Email">
                Last Name
              </label>
              <input
                className="addemployee-input"
                id="First Name"
                type="text"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="Add-employees-mainDiv">
            <div className="add-firstname">
              <label className="addemployee-label" for="Email">
                Email
              </label>
              <input
                className="addemployee-input"
                id="First Name"
                type="text"
                onChange={handleChange}
              />
            </div>
            <div className="add-firstname">
              <label className="addemployee-label" for="Email">
                Mobile Number
              </label>
              <input
                className="addemployee-input"
                id="First Name"
                type="text"
                onChange={(e) => {
                  setMobileNo(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="Add-employees-mainDiv">
            <div className="add-firstname">
              <label className="addemployee-label" for="Email">
                Join Date
              </label>
              <input
                className="addemployee-input"
                id="First Name"
                type="text"

                onChange={(e) => {
                  setJoinDate(e.target.value);
                }}
              />
            </div>
            <div className="add-firstname">
              <label className="addemployee-label" for="Email">
                Role
              </label>
              <input
                className="addemployee-input"
                id="First Name"
                type="text"
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              />
            </div>
            
          </div>
          <div className="Add-employees-mainDiv">
            <div className="add-firstname">
              <label className="addemployee-label" for="Email">
                Contractor Name
              </label>
              <input
                className="addemployee-input"
                id="First Name"
                type="text"
                onChange={(e) => {
                  setContractorName(e.target.value);
                }}
              />
            </div>
            <div className="add-firstname">
               <label className="addemployee-label" for="Email">
                Empolyee Salary
              </label>
              <input
                className="addemployee-input"
                id="First Name"
                type="text"
                onChange={(e) => {
                  setsalary(e.target.value);
                }}
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
       </div>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="TEAM" subtitle="welcome to your Team" />
      </Box>
      <div className="">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Contractor</th>

            </tr>
          </thead>
          <tbody>
            {employeeData.map((currEmployee) => {
              return (
                <tr>
                  <td data-column="First Name">{currEmployee.Name}</td>
                  <td data-column="Last Name">
                  {currEmployee.Email}
                  </td>
                  <td data-column="Job Title">{currEmployee.MobileNo}</td>
                  <td data-column="Twitter">{currEmployee.Role}</td>
                  <td data-column="Twitter">{currEmployee.JoinDate}</td>
                  <td data-column="Twitter">{currEmployee.Contractor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* <Box
        m="8px 0 0 0"
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      > */}
      {/* <DataGrid rows={mockDataEmployee} columns={columns} /> */}
    </Box>
    // </Box>
  );
};

export default Team;
