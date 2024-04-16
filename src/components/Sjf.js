import React, { useState, useEffect, useRef } from 'react';

const SJF = ({ rows }) => {
  const [processes, setProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (rows && rows.length > 0) {
      let totalWaitingTime = 0;
      let totalTurnaroundTime = 0;

      // Sort processes based on arrival time and burst time
      const sortedRows = rows.slice().sort((a, b) => {
        if (parseInt(a.arrivalTime) === parseInt(b.arrivalTime)) {
          return parseInt(a.burstTime) - parseInt(b.burstTime);
        }
        return parseInt(a.arrivalTime) - parseInt(b.arrivalTime);
      });

      // Calculate waiting time, start time, finish time, and turnaround time for each process
      sortedRows.forEach((row, index) => {
        const startTime = index === 0 ? parseInt(row.arrivalTime) : processes[index - 1].finishTime;
        const waitingTime = startTime - parseInt(row.arrivalTime);
        totalWaitingTime += waitingTime;

        const finishTime = startTime + parseInt(row.burstTime);
        const turnaroundTime = finishTime - parseInt(row.arrivalTime);
        totalTurnaroundTime += turnaroundTime;

        row.waitingTime = waitingTime;
        row.startTime = startTime;
        row.finishTime = finishTime;
        row.turnaroundTime = turnaroundTime;
      });

      // Calculate average waiting time and average turnaround time
      avgWaitingTimeRef.current = totalWaitingTime / sortedRows.length;
      avgTurnaroundTimeRef.current = totalTurnaroundTime / sortedRows.length;

      setProcesses(sortedRows);
    }
  }, [rows]);

  return (
    <div className='container my-5'>
      <h4>Gantt Chart:</h4>
      <div className='d-flex my-4'>
        {processes.map((process)=>(<div className="border border-info text-center bg-light" style={{height: '500%', width: '20%'}}>P{process.id}<br/>({process.startTime}-{process.finishTime})</div>))}
      </div>
      <table style={{ margin: "auto" }} className="table text-center table-bordered">
        <thead>
          <tr className='table-primary'>
            <th scope="col">Process</th>
            <th scope="col">Arrival Time</th>
            <th scope="col">Burst Time</th>
            <th scope="col">Start Time</th>
            <th scope="col">Finish Time</th>
            <th scope="col">Waiting Time</th>
            <th scope="col">Turnaround Time</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <td>{`P${process.id}`}</td>
              <td>{process.arrivalTime}</td>
              <td>{process.burstTime}</td>
              <td>{process.startTime}</td>
              <td>{process.finishTime}</td>
              <td>{process.waitingTime}</td>
              <td>{process.turnaroundTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="my-4">
        <h5>Average Waiting Time: {avgWaitingTimeRef.current ? avgWaitingTimeRef.current.toFixed(2) : '-'}</h5>
        <h5>Average Turnaround Time: {avgTurnaroundTimeRef.current ? avgTurnaroundTimeRef.current.toFixed(2) : '-'}</h5>
      </div>
    </div>
  );
};

export default SJF;
