import { Box } from "@mui/material";
import React from "react";
import Header from "../../components/Header";
import Popup from "reactjs-popup";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../axios";
import { useState } from "react";
import { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { EmailContext } from "../../Context/Context";
import socket from "../../Socket";

function getDate(date) {
  const dat = new Date(date);
  return dat.toLocaleDateString();
}
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

const Timestamp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dateLoading, setDateLoading] = useState(false);
  const [date, setDate] = useState("");
  const [task, setTask] = useState("");
  const [workingHour, setWorkingHour] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const [hour, setHour] = useState("");

  const [employeesData, setEmployeesData] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [timesheetData, setTimeSheetData] = useState(null);

  const { contractorName } = useContext(EmailContext);

  useEffect(() => {
    if (!localStorage.getItem("Token")) {
      navigate("/login");
    }
  }, []);
  let token = localStorage.getItem("Token");

  // const handleDateSubmit = async (e) => {
  //   e.preventDefault();
  //   setDateLoading(true);

  //   try {
  //     const response = await axios({
  //       method: "post",
  //       url: "/e",
  //       data: {
  //         "employeeName": employeeId,
  //         "timeSheet": {
  //         "Date": date,
  //         "Workinghours": workingHour
  //         }
  //         },
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     console.log(response);
  //     if (response) {
  //       setDateLoading(false);
  //       setDate(null);
  //       toast(response.data.message, succesOption);
  //     }
  //   } catch (error) {
  //     setDateLoading(false);
  //     setDate(null);
  //     if (
  //       error.response.data.message === "Please filled required fields properly"
  //     ) {
  //       toast(error.response.data.message, warningOption);
  //     } else {
  //       toast(error.response.data.message, errorOption);
  //     }
  //   }
  // };

  useEffect(() => {
    try {
      let isMounted = true;

      axios({
        method: "get",
        url: `/getallemployees`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setEmployeesData(response.data.res);
        })
        .catch((err) => {
          console.log(err.response);
          toast(err.response.data.message, errorOption);
        });

      return () => {
        isMounted = false;
      };
    } catch (error) {
      console.log(error);
      toast(error.response.data.message, errorOption);
    }
  }, []);

  useEffect(() => {
    try {
      let isMounted = true;

      axios({
        method: "get",
        url: `/gettimesheet`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setTimeSheetData(response.data.savedTimesheets);
        })
        .catch((err) => {
          console.log(err.response);
          toast(err.response.data.message, errorOption);
        });

      return () => {
        isMounted = false;
      };
    } catch (error) {
      console.log(error);
      toast(error.response.data.message, errorOption);
    }
  }, [dateLoading]);
  console.log(contractorName);
  console.log(employeesData);
  console.log(timesheetData);
  // console.log(timesheetData.savedTimesheets[0].Timesheet[0])

  return (
    <div className="Holiday-section">
      <ToastContainer />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Time sheet" subtitle="Time sheet section" />
      </Box>
      <TableContainer component={Paper} style={{ backgroundColor: "#141b2d" }}>
        <Table aria-label="collapsible table">
          <TableHead style={{ backgroundColor: "#3e4396" }}>
            <TableRow>
              <TableCell />
              <TableCell>Employee Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeesData && timesheetData
              ? employeesData.map((value) => (
                  <Row
                    key={value.Name}
                    row={value}
                    timesheetData={timesheetData}
                    date={date}
                    setDate={setDate}
                    task={task}
                    setTask={setTask}
                    hour={hour}
                    setHour={setHour}
                    dateLoading={dateLoading}
                    setDateLoading={setDateLoading}
                  />
                ))
              : "Loading"}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Timestamp;

function Row(props) {
  const {
    row,
    timesheetData,
    date,
    task,
    setTask,
    setDate,
    hour,
    setHour,
    dateLoading,
    setDateLoading,
  } = props;
  const [open, setOpen] = React.useState(false);
  // const [dateLoading, setDateLoading] = useState(false);
  const [timesheetId, setTimesheetId] = useState("");
  const [editId, setEditId] = useState("");
  const [dateTo, setDateTo] = useState("yyyy-mm-dd");
  const [Dayinput, setDayinput] = useState("");
  const navigate = useNavigate();

  const handleDateSubmit = async (e) => {
    let token = localStorage.getItem("Token");
    e.preventDefault();
    setDateLoading(true);
    setTimesheetId(row._id);
    try {
      const response = await axios({
        method: "post",
        url: "/addtimesheet",
        data: {
          employeeName: timesheetId,
          timeSheet: {
            Date: dateTo,
            Task: task,
            Workinghours: hour,
          },
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response) {
        setDateLoading(false);
        props.setDate(null);
        setTimesheetId(null);
        setDate(null);
        setTask(null);
        setHour(null);
        toast(response.data.message, succesOption);
      }
    } catch (error) {
      setDateLoading(false);
      props.setDate(null);
      if (
        error.response.data.message === "Please filled required fields properly"
      ) {
        toast(error.response.data.message, warningOption);
      } else {
        toast(error.response.data.message, errorOption);
      }
    }
  };

  const handleDateEditSubmit = async (e) => {
    let token = localStorage.getItem("Token");
    e.preventDefault();
    setDateLoading(true);

    try {
      const response = await axios({
        method: "patch",
        url: "/edittimesheetdateforadmin",
        data: {
          employeeName: timesheetId,
          TimesheetDateId: editId,
          Task: task,
          Workinghours: hour,
          customDate: date,
        },
      });
      console.log(response);
      if (response) {
        setDateLoading(false);
        props.setDate(null);
        setEditId(null);
        toast(response.data.message, succesOption);
      }
    } catch (error) {
      setDateLoading(false);
      setEditId(null);
      props.setDate(null);
      if (
        error.response.data.message === "Please filled required fields properly"
      ) {
        toast(error.response.data.message, warningOption);
      } else {
        toast(error.response.data.message, errorOption);
      }
    }
  };

  useEffect(() => {
    // editId('')
  }, []);

  const handleClick = () => {
    console.log("contractor id");
    setTimesheetId(row._id);
    console.log(timesheetId);
  };
  // console.log(timesheetData[0].EmployeeName._id)
  // console.log(timesheetData)

  function getElement(val) {
    if (val.EmployeeName._id === row._id) {
      return val;
    } else {
      return false;
    }
  }

  function reverseDate(val) {
    var arr = val.split("-");
    arr.reverse();
    var newDate = arr.join("-");
    return newDate;
  }
  function sliceDate(val) {
    let dat = val.slice(0, 10);
    return dat;
  }

  const Approvalfun = async (id, date) => {
    try {
      const response = await axios({
        method: "patch",
        url: "/approvetimesheet",
        data: {
          TimesheetId: id,
        },
      });
      // console.log(response);
      if (response) {
        socket.emit("timesheet-approved", {
          timesheetId: id,
          Date: date,
        });
        toast(response.data.message, succesOption);
      }
    } catch (error) {
      toast(error.response.data.message, errorOption);
    }
  };
  const getday = (param) => {
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let daate = param;
    const day0 = weekday[daate.getDay()];
    console.log(day0);
    setDayinput(day0);
  };

  const fetchday = (param) => {
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let daate = new Date(param);
    const day1 = weekday[daate.getDay()];
    console.log(day1);
    return day1;
  };

  console.log(timesheetId);
  console.log(editId);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.Name}
        </TableCell>
        {/* codedbydurgesh */}
        <TableCell>
          <p
            className="btn mr btn-info"
            onClick={() => navigate(`/timesheet/employee-invoice/${row._id}`)}
          >
            Show Invoice
          </p>
        </TableCell>
        <TableCell>
          <div className="popup-header-div">
            <Popup
              className="my-popup"
              trigger={(open) => (
                <button
                  className=" employee-button-popup mgy"
                  onClick={handleClick}
                >
                  Add Timesheet
                </button>
              )}
              position="center"
              closeOnDocumentClick
            >
              <h2 className="holiday-popup-heading">Add Timesheet</h2>
              <form onSubmit={handleDateSubmit}>
                <div className="holiday-popup-main-div">
                  <label className="addholiday-label" htmlFor="Holiday-day">
                    Date
                  </label>
                  <input
                    className="addholiday-input"
                    id="Holiday-day"
                    name="Holiday-day"
                    type="date"
                    onChange={(e) => {
                      // console.log(typeof e.target.value);
                      let date = reverseDate(e.target.value);
                      setDateTo(date);
                      let day = new Date(e.target.value);
                      // console.log(day)
                      getday(day);
                    }}
                  />
                  <label className="addholiday-label" htmlFor="Holiday-day">
                    Day
                  </label>
                  <input
                    disabled
                    className="addholiday-input"
                    id="Holiday-day"
                    name="Holiday-day"
                    type="text"
                    value={Dayinput}
                  />
                  <label className="addholiday-label" htmlFor="Holiday-Name">
                    Employee Working Hour
                  </label>
                  <input
                    className="addholiday-input"
                    id="Holiday-Name"
                    name="Holiday-Name"
                    type="text"
                    onChange={(e) => {
                      setHour(e.target.value);
                    }}
                  />
                  <label className="addholiday-label" htmlFor="Holiday-Date">
                    Employee Task
                  </label>
                  <input
                    className="addholiday-input"
                    id="Holiday-Date"
                    name="Holiday-Date"
                    type="text"
                    onChange={(e) => {
                      setTask(e.target.value);
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
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Working hour history
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Day</TableCell>
                    <TableCell>Task</TableCell>
                    <TableCell>Working Hour</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timesheetData.filter(getElement).length !== 0
                    ? timesheetData
                        .filter(getElement)[0]
                        .Timesheet.map((val) => (
                          <TableRow key={val.Date}>
                            {editId && val._id === editId ? (
                              <>
                                <TableCell>
                                  <input
                                    type="date"
                                    onChange={(e) => {
                                      setDate(e.target.value);
                                      let day = new Date(e.target.value);
                                      getday(day);
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input disabled value={Dayinput} />
                                </TableCell>
                                <TableCell>
                                  <input
                                    onChange={(e) => {
                                      setTask(e.target.value);
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    onChange={(e) => {
                                      setHour(e.target.value);
                                    }}
                                  />
                                </TableCell>
                                <div
                                  className="popup-header-div"
                                  style={{
                                    backgroundColor: "#202738",
                                    justifyContent: "center",
                                  }}
                                >
                                  <button
                                    onClick={() => {
                                      setEditId("");
                                    }}
                                    className="employee-button-popup mgy"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleDateEditSubmit}
                                    className="employee-button-popup mgy"
                                  >
                                    Submit
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <TableCell component="th" scope="row">
                                  {getDate(val.Date)}
                                </TableCell>
                                <TableCell>
                                  {fetchday(getDate(val.Date))}
                                </TableCell>
                                <TableCell>{val.Task}</TableCell>
                                <TableCell>{val.Workinghours}</TableCell>

                                <div
                                  className="popup-header-div"
                                  style={{
                                    backgroundColor: "#202738",
                                    justifyContent: "center",
                                  }}
                                >
                                  {/* <button
                                    className="employee-button-popup mgy"
                                    // onClick={()=>Approvalfun()}
                                  >
                                    Approval
                                  </button> */}
                                  <button
                                    onClick={() => {
                                      Approvalfun(val._id, val.Date);
                                    }}
                                    className="employee-button-popup mgy"
                                  >
                                    Approval
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditId(val._id);
                                      setTimesheetId(row._id);
                                    }}
                                    className="employee-button-popup mgy"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </>
                            )}
                          </TableRow>
                        ))
                    : "No Timesheets"}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
