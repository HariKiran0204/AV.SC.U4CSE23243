import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { schedulerApi } from "./api/schedulerApi";

interface Depot {
  depotId: string;
  availableHours: number;
}

interface Task {
  taskId: string;
  duration: number;
  impactScore: number;
}

function App() {
  const [email, setEmail] = useState("you@example.com");
  const [password, setPassword] = useState("pass1234");
  const [token, setToken] = useState("");
  const [depots, setDepots] = useState<Depot[]>([]);
  const [selectedDepot, setSelectedDepot] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
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
    } catch (e) {
      setError("Failed to login or fetch depots");
    } finally {
      setLoading(false);
    }
  };

  const runSchedule = async () => {
    if (!selectedDepot || !token) return;
    setLoading(true);
    setError("");
    try {
      const resp = await schedulerApi.scheduleDepot(token, selectedDepot);
      const result = resp.data.data;
      setTasks(result.selectedTasks || []);
      setSummary(`Hours Used: ${result.totalHoursUsed} | Impact: ${result.totalImpactScore}`);
      setRequestId(resp.requestId || "");
    } catch {
      setError("Failed to compute schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" gutterBottom>Scheduler Dashboard</Typography>
      <Box sx={{ display: "grid", gap: 2, mb: 2 }}>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" onClick={loginAndLoadDepots} disabled={loading}>Login + Load Depots</Button>
      </Box>

      {depots.length > 0 && (
        <Box sx={{ display: "grid", gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="depot-label">Depot</InputLabel>
            <Select labelId="depot-label" label="Depot" value={selectedDepot} onChange={(e) => setSelectedDepot(e.target.value)}>
              {depots.map((d) => (
                <MenuItem key={d.depotId} value={d.depotId}>{`${d.depotId} (${d.availableHours}h)`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={runSchedule} disabled={loading || !selectedDepot}>Run Optimization</Button>
        </Box>
      )}

      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {requestId && <Alert severity="info" sx={{ mt: 2 }}>requestId: {requestId}</Alert>}
      {summary && <Alert severity="success" sx={{ mt: 2 }}>{summary}</Alert>}

      <Box sx={{ mt: 3, display: "grid", gap: 2 }}>
        {tasks.map((task) => (
          <Card key={task.taskId}>
            <CardContent>
              <Typography variant="h6">Task {task.taskId}</Typography>
              <Typography>Duration: {task.duration}h</Typography>
              <Typography>Impact: {task.impactScore}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
