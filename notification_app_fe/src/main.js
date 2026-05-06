import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { schedulerApi } from "./api/schedulerApi";
function App() {
    const [email, setEmail] = useState("you@example.com");
    const [password, setPassword] = useState("pass1234");
    const [token, setToken] = useState("");
    const [depots, setDepots] = useState([]);
    const [selectedDepot, setSelectedDepot] = useState("");
    const [tasks, setTasks] = useState([]);
    const [summary, setSummary] = useState("");
    const [requestId, setRequestId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const loginAndLoadDepots = async () => {
        setLoading(true);
        setError("");
        try {
            const login = await schedulerApi.login(email, password);
            setToken(login.data.accessToken);
            setRequestId(login.requestId || "");
            const depotsResp = await schedulerApi.getDepots(login.data.accessToken);
            setDepots(depotsResp.data.data || []);
            setRequestId(depotsResp.requestId || "");
        }
        catch (e) {
            setError("Failed to login or fetch depots");
        }
        finally {
            setLoading(false);
        }
    };
    const runSchedule = async () => {
        if (!selectedDepot || !token)
            return;
        setLoading(true);
        setError("");
        try {
            const resp = await schedulerApi.scheduleDepot(token, selectedDepot);
            const result = resp.data.data;
            setTasks(result.selectedTasks || []);
            setSummary(`Hours Used: ${result.totalHoursUsed} | Impact: ${result.totalImpactScore}`);
            setRequestId(resp.requestId || "");
        }
        catch {
            setError("Failed to compute schedule");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Container, { maxWidth: "md", sx: { mt: 5, mb: 5 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "Scheduler Dashboard" }), _jsxs(Box, { sx: { display: "grid", gap: 2, mb: 2 }, children: [_jsx(TextField, { label: "Email", value: email, onChange: (e) => setEmail(e.target.value) }), _jsx(TextField, { label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value) }), _jsx(Button, { variant: "contained", onClick: loginAndLoadDepots, disabled: loading, children: "Login + Load Depots" })] }), depots.length > 0 && (_jsxs(Box, { sx: { display: "grid", gap: 2, mb: 2 }, children: [_jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { id: "depot-label", children: "Depot" }), _jsx(Select, { labelId: "depot-label", label: "Depot", value: selectedDepot, onChange: (e) => setSelectedDepot(e.target.value), children: depots.map((d) => (_jsx(MenuItem, { value: d.depotId, children: `${d.depotId} (${d.availableHours}h)` }, d.depotId))) })] }), _jsx(Button, { variant: "outlined", onClick: runSchedule, disabled: loading || !selectedDepot, children: "Run Optimization" })] })), loading && _jsx(CircularProgress, {}), error && _jsx(Alert, { severity: "error", sx: { mt: 2 }, children: error }), requestId && _jsxs(Alert, { severity: "info", sx: { mt: 2 }, children: ["requestId: ", requestId] }), summary && _jsx(Alert, { severity: "success", sx: { mt: 2 }, children: summary }), _jsx(Box, { sx: { mt: 3, display: "grid", gap: 2 }, children: tasks.map((task) => (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", children: ["Task ", task.taskId] }), _jsxs(Typography, { children: ["Duration: ", task.duration, "h"] }), _jsxs(Typography, { children: ["Impact: ", task.impactScore] })] }) }, task.taskId))) })] }));
}
createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
