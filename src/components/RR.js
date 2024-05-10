import React, { useState, useEffect, useRef } from 'react';

const RoundRobinScheduler = ({ rows, quantum }) => {
  const [processes, setProcesses] = useState([]);
  const [processes1, setProcesses1] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (rows && rows.length > 0 && quantum > 0) {
      // Sort rows by arrival time
      const sortedRows = rows.slice().sort((a, b) => parseInt(a.arrivalTime) - parseInt(b.arrivalTime));

      let currentTime = 0;
      let remainingBurstTimes = sortedRows.map((row) => parseInt(row.burstTime));
      let waitingTimes = new Array(sortedRows.length).fill(0);
      let turnaroundTimes = new Array(sortedRows.length).fill(0);

      const updatedProcesses = [];

      while (remainingBurstTimes.some((bt) => bt > 0)) {
        for (let i = 0; i < sortedRows.length; i++) {
          const burstTime = remainingBurstTimes[i];

          if (burstTime > 0) {
            const executeTime = Math.min(quantum, burstTime);
            const start = currentTime; // Keep track of the actual start time
            currentTime += executeTime;
            remainingBurstTimes[i] -= executeTime;

            const turnaroundTime = currentTime - parseInt(sortedRows[i].arrivalTime);
            const waitingTime = turnaroundTime - parseInt(sortedRows[i].burstTime);

            waitingTimes[i] = waitingTime;
            turnaroundTimes[i] = turnaroundTime;

            updatedProcesses.push({
              ...sortedRows[i],
              startTime: start, // Set the actual start time
              finishTime: currentTime,
              waitingTime,
              turnaroundTime,
            });
          }
        }
      }

      const finalProcesses = [];

      for(let i = 0; i < sortedRows.length; i++) {
        let index = 0;
        for(let j = 0; j < updatedProcesses.length; j++) {
          if (updatedProcesses[j].id === sortedRows[i].id) {
            index = j;
          }
        }
        finalProcesses[i] = updatedProcesses[index];
      }

      const totalWaitingTime = waitingTimes.reduce((acc, val) => acc + val, 0);
      const totalTurnaroundTime = turnaroundTimes.reduce((acc, val) => acc + val, 0);

      avgWaitingTimeRef.current = totalWaitingTime / sortedRows.length;
      avgTurnaroundTimeRef.current = totalTurnaroundTime / sortedRows.length;

      setProcesses(updatedProcesses);
      setProcesses1(finalProcesses); // Set processes1 with updatedProcesses
    }
  }, [rows, quantum]);

  return (
    <div className="container my-5">
      <h4>Output for Round Robin Algorithm:</h4>
      <div className="d-flex my-4">
        {processes.map((process) => (
          <div key={process.id} className="border border-primary text-center" style={{ height: '500%', width: '20%' ,background: '#CBDBFF'}}>
            P{process.id}<br />
            ({process.startTime}-{process.finishTime})
          </div>
        ))}
      </div>
      <table className="table text-center table-bordered" style={{ margin: 'auto' }}>
        <thead>
          <tr className="table-primary">
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
          {processes1.map((process) => (
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

export default RoundRobinScheduler;