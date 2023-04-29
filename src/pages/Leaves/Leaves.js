import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
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

const Leaves = () => {
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState("");
  const [status, setStatus] = useState("");
  const [leaveId, setLeaveId] = useState("");
  let token = localStorage.getItem("Token");

  useEffect(() => {
    try {
      let isMounted = true;

      axios({
        method: "get",
        url: `/getemployeeleave`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log(response.data.savedLeaves);
          setLeaves(response.data.savedLeaves);
          setLeaveId(response.data.savedLeaves)
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
  
  console.log(leaveId)

 
    const updateStatus = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axios({
          method: "patch",
          url: "/updateleavestatus",
          data: {
            employeeId: leaveId,
            status: status,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
      } catch (error) {
        console.log(error);
      }
    };
    console.log(status);
 
 
  console.log(leaves);
  console.log(status);
  console.log(leaveId);

  return (
    <div className="Holiday-section">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Leaves" subtitle="Leaves section" />
      </Box>
      <div>
        <div className="">
          <table>
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>No of Dates</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Leave added by</th>
              </tr>
            </thead>
            <tbody>
           {/* codedbydurgesh */}
              {leaves
                ? leaves.map((val) => {
                    return (
                      <tr>
                        <td data-column="First Name">{val.LeaveType}</td>
                        <td data-column="Last Name">{val.From}</td>
                        <td data-column="Job Title">{val.To}</td>
                        <td data-column="Twitter">{val.NoOfDays}</td>
                        <td data-column="Twitter">{val.Reason}</td>
                        <td data-column="Twitter">
                          <select
                            name=""
                            id=""
                            style={{ border: "none", outLine: "none" }}
                            onChange = {(e) => {
                              setStatus(e.target.value)
                              setLeaveId(val._id)
                              // updateStatus()
                            }}
                            onClick={updateStatus}
                          >
                            <option value={status} >{val.Status}</option>
                            <option value="Approve">Approve</option>
                            <option value="Reject">Reject</option>
                          </select>
                        </td>
                        <td data-column="Twitter">{val.EmployeeName.Name}</td>
                      </tr>
                    );
                  })
                : "loading"}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaves;
