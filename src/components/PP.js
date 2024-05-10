import React, { useState, useEffect } from 'react';

const PreemptivePriority = ({ rows }) => {
  const [processes, setProcesses] = useState([]);
  const [ganttChart, setGanttChart] = useState([]);
  const [avgWaitingTime, setAvgWaitingTime] = useState(0);
  const [avgTurnaroundTime, setAvgTurnaroundTime] = useState(0);

  useEffect(() => {
    if (rows && rows.length > 0) {
      const sortedRows = rows.slice().sort((a, b) => parseInt(a.arrivalTime) - parseInt(b.arrivalTime));

      let currentTime = 0;
      let totalWaitingTime = 0;
      let totalTurnaroundTime = 0;
      const remainingTimes = sortedRows.map(row => parseInt(row.burstTime));
      const priorities = sortedRows.map(row => parseInt(row.priority));
      const startTimes = Array(sortedRows.length).fill(null);
      const finishTimes = Array(sortedRows.length).fill(null);
      const completedProcesses = new Set();
      const timeline = []; 

      while (completedProcesses.size < sortedRows.length) {
        let highestPriority = Infinity;
        let selectedProcess = -1;

        for (let i = 0; i < sortedRows.length; i++) {
          if (!completedProcesses.has(i) && parseInt(sortedRows[i].arrivalTime) <= currentTime && priorities[i] < highestPriority) {
            highestPriority = priorities[i];
            selectedProcess = i;
          }
        }

        if (selectedProcess === -1) {
          timeline.push(null); 
          currentTime++;
          continue;
        }

        if (startTimes[selectedProcess] === null) {
          startTimes[selectedProcess] = currentTime;
        }

        remainingTimes[selectedProcess]--;
        timeline.push(selectedProcess); 
        currentTime++;

        if (remainingTimes[selectedProcess] === 0) {
          completedProcesses.add(selectedProcess);
          finishTimes[selectedProcess] = currentTime;
          const waitingTime = Math.max(0, finishTimes[selectedProcess] - parseInt(sortedRows[selectedProcess].arrivalTime) - parseInt(sortedRows[selectedProcess].burstTime));
          totalWaitingTime += waitingTime;
          const turnaroundTime = waitingTime + parseInt(sortedRows[selectedProcess].burstTime);
          totalTurnaroundTime += turnaroundTime;
        }
      }

      const newGanttChart = [];
      let lastProcessIndex = -1;
      let lastProcessStartTime = -1;

      for (let i = 0; i < timeline.length; i++) {
        const currentProcessIndex = timeline[i];
        if (currentProcessIndex !== null) {
          if (lastProcessIndex !== currentProcessIndex) {
            if (lastProcessIndex !== -1) {
              newGanttChart.push({
                id: sortedRows[lastProcessIndex].id,
                startTime: lastProcessStartTime,
                finishTime: i
              });
            }
            lastProcessIndex = currentProcessIndex;
            lastProcessStartTime = i;
          }
        } else {
          if (lastProcessIndex !== -1) {
            newGanttChart.push({
              id: sortedRows[lastProcessIndex].id,
              startTime: lastProcessStartTime,
              finishTime: i
            });
            lastProcessIndex = -1;
            lastProcessStartTime = -1;
          }
        }
      }

      if (lastProcessIndex !== -1) {
        newGanttChart.push({
          id: sortedRows[lastProcessIndex].id,
          startTime: lastProcessStartTime,
          finishTime: timeline.length
        });
      }

      setGanttChart(newGanttChart);

      const newProcesses = [];
      for (let i = 0; i < sortedRows.length; i++) {
        const waitingTime = Math.max(0, finishTimes[i] - parseInt(sortedRows[i].arrivalTime) - parseInt(sortedRows[i].burstTime));
        const turnaroundTime = waitingTime + parseInt(sortedRows[i].burstTime);
        newProcesses.push({
          ...sortedRows[i],
          startTime: startTimes[i],
          finishTime: finishTimes[i],
          waitingTime,
          turnaroundTime
        });
      }
      setProcesses(newProcesses);

      setAvgWaitingTime(totalWaitingTime / sortedRows.length);
      setAvgTurnaroundTime(totalTurnaroundTime / sortedRows.length);
    }
  }, [rows]);

  return (
    <div className='container my-5'>
      <h3>Output for Priority Preemptive Algorithm:</h3>
      <div className='d-flex my-4'>
        {ganttChart.map((entry, index) => (
          <div key={index} className="border border-primary text-center" style={{ height: "500%", width: "20%", background: '#CBDBFF'}}>
            P{entry.id} <br/> ({entry.startTime} - {entry.finishTime})
          </div>
        ))}
      </div>
      <table style={{ margin: "auto" }} className="table text-center table-bordered">
        <thead>
          <tr className='table-primary'>
            <th scope="col">Process</th>
            <th scope="col">Arrival Time</th>
            <th scope="col">Burst Time</th>
            <th scope="col">Priority</th>
            <th scope="col">Start Time</th>
            <th scope="col">Finish Time</th>
            <th scope="col">Waiting Time</th>
            <th scope="col">Turnaround Time</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process, index) => (
            <tr key={index}>
              <td>{`P${process.id}`}</td>
              <td>{process.arrivalTime}</td>
              <td>{process.burstTime}</td>
              <td>{process.priority}</td>
              <td>{process.startTime}</td>
              <td>{process.finishTime}</td>
              <td>{process.waitingTime}</td>
              <td>{process.turnaroundTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="my-4">
        <h5>Average Waiting Time: {avgWaitingTime ? avgWaitingTime.toFixed(2) : '-'}</h5>
        <h5>Average Turnaround Time: {avgTurnaroundTime ? avgTurnaroundTime.toFixed(2) : '-'}</h5>
      </div>
    </div>
  );
};

export default PreemptivePriority;
