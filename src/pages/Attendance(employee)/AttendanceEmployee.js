import { Box } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useStopwatch } from "react-timer-hook";
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
 

const AttendanceEmployee = (props) => {
  const [loading, setLoading] = useState(false);
  const [watch, setWatch] = useState()

  const currentDate = new Date().toLocaleDateString("en-IN", {
    dateStyle: "long",
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("Token")) {
    navigate("/login");
    }
    }, [])

    
  useEffect(() => {
    let token = localStorage.getItem("Token");
    try {
      let isMounted = true;

      axios({
        method: "get",
        url: `/allemployeeworkinghour`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log(response.data.allEmployeeWorkingHour);
          setWatch(response.data.allEmployeeWorkingHour)
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

  return (
    <div>
      <div className="Holiday-section">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Attendance" subtitle="Leaves section" />
      </Box>
      <div>
        <div className="">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Date</th>
                <th>Role</th>
                <th>Mobile No.</th>
                <th>Time Stamp</th>
              </tr>
            </thead>
            <tbody>
              {watch
                ? watch.map((val) => {
                    return (
                      <tr>
                        <td data-column="First Name">{val.Employee.Name}</td>
                        <td data-column="Last Name">{val.Employee.Email}</td>
                        <td data-column="Job Title">{val.Employee.JoinDate}</td>
                        <td data-column="Twitter">{val.Employee.Role}</td>
                        <td data-column="Twitter">{val.Employee.MobileNo}</td>
                        {val.Timesheet.map((item)=>{
                          return(
                            <td data-column="Twitter">{item.Workinghours}</td>
                          )
                        })}
                        
                      </tr>
                    );
                  })
                : "loading"}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AttendanceEmployee;
