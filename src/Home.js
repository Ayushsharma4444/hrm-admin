import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";

import Topbar from "./pages/global/Topbar";

// import Dashboard from "./pages/dashboard";
import Team from "./pages/team";
// import Invoices from "./pages/invoices";
import Contacts from "./pages/contacts";
// import Form from "./pages/form";
import Calendar from "./pages/calendar";
// import Bar from "./pages/bar";
// import Line from "./pages/line";
// import Pie from "./pages/pie";
import FAQ from "./pages/faq";
// import Geography from "./pages/geography";
import { useEffect, useState } from "react";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";
// import Profile from "./pages/Profile/Profile";
import AllEmployee from './pages/team/index';
import Holiday from "./pages/Holidays/Holiday";
import Timesheet from "./pages/timestamp/Timestamp";
import Leaves from "./pages/Leaves/Leaves";
import AttendanceEmployee from "./pages/Attendance(employee)/AttendanceEmployee";
import { useStopwatch } from "react-timer-hook";
import Vendor from "./pages/vendor/Vendor";
import Invoice from "./Invoice/Invoice";
import ContactorInvoice from "./pages/ContactorInvoice/Contratorinvoice";
import QuaryProvider from "./Context/QuaryContext";
import Empolyeeinvoice from "./pages/ContactorInvoice/Empolyeeinvoice";

const Home = () => {
  const navigate = useNavigate();
  const [theme, colorMode] = useMode();

  useEffect(() => {
    if (!localStorage.getItem("Token")) {
      navigate("/login");
    }
  }, []);

  // const previousSession = localStorage.getItem("Timesheet").split(" ");

  // const previousHours = previousSession[0];
  // const previousMinutes = previousSession[1];

  const stopwatchOffset = new Date();
  // stopwatchOffset.setHours(stopwatchOffset.getHours() + +previousHours);
  // stopwatchOffset.setMinutes(stopwatchOffset.getMinutes() + +previousMinutes);


  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false, offsetTimestamp: stopwatchOffset });

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <QuaryProvider>
        <MyProSidebarProvider>
          <div style={{ height: "100%", width: "83%" }}>
            <main>
              <Topbar />
              <Routes>
                <Route path="/" element={<AllEmployee />} />
                <Route path="/vendor" element={<Vendor/>} />
                <Route path="/team" element={<Team />} />
                <Route path="/holiday" element={<Holiday />} />
                <Route path="/leaves" element={<Leaves />} />
                <Route
                  path="/attendanceEmployee"
                  element={
                    <AttendanceEmployee
                      hours={hours}
                      minutes={minutes}
                      seconds={seconds}
                      isRunning={isRunning}
                      start={start}
                      pause={pause}
                      reset={reset}
                    />
                  }
                />
                <Route path="/contacts" element={<Contacts />} />
                {/* <Route path="/invoices" element={<Invoices />} /> */}
                <Route path="/invoice" element={<Invoice />} />
                <Route path="/timesheet/employee-invoice/:pan" element={<Empolyeeinvoice />} /> 
                <Route path="/invoice/contrator/:pan" element={<ContactorInvoice />} /> 
                {/* <Route path="/form" element={<Form />} /> */}
                {/* <Route path="/profile" element={<Profile />} /> */}
                <Route path="/timesheet" element={<Timesheet />} />
                {/* <Route path="/bar" element={<Bar />} /> */}
                {/* <Route path="/pie" element={<Pie />} /> */}
                {/* <Route path="/line" element={<Line />} /> */}
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                {/* <Route path="/geography" element={<Geography />} /> */}
              </Routes>
            </main>
          </div>
        </MyProSidebarProvider>
      </QuaryProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Home;
