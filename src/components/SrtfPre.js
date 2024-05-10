import React, { useState, useEffect, useRef } from 'react';

const SRTF = ({ rows }) => {
  const [processes, setProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);
  const ganttChartRef = useRef([]);

  useEffect(() => {
    ganttChartRef.current = []; 

    if (rows && rows.length > 0) {
      const sortedRows = rows.slice().sort((a, b) => {
        if (parseInt(a.arrivalTime) !== parseInt(b.arrivalTime)) {
          return parseInt(a.arrivalTime) - parseInt(b.arrivalTime);
        } else {
          return parseInt(a.id) - parseInt(b.id);
        }
      });

      let currentTime = 0;
      let totalWaitingTime = 0;
      let totalTurnaroundTime = 0;
      let completedProcesses = 0;
      const remainingTimes = Array.from({ length: sortedRows.length }, (_, i) => parseInt(sortedRows[i].burstTime));
      let currentProcess = -1;
      let startTime = 0; 

      while (completedProcesses < sortedRows.length) {
        let minRemainingTime = Infinity;
        let selectedProcess = -1;

        for (let i = 0; i < sortedRows.length; i++) {
          if (parseInt(sortedRows[i].arrivalTime) <= currentTime && remainingTimes[i] < minRemainingTime && remainingTimes[i] > 0) {
            minRemainingTime = remainingTimes[i];
            selectedProcess = i;
          }
        }

        if (selectedProcess === -1) {
          currentTime++;
          continue;
        }

        if (currentProcess !== selectedProcess) {
          if (currentProcess !== -1) {
            ganttChartRef.current.push({
              id: sortedRows[currentProcess]?.id,
              startTime: startTime, 
              endTime: currentTime 
            });
          }
          currentProcess = selectedProcess;
          startTime = currentTime; 
        }

        remainingTimes[currentProcess]--;
        currentTime++;

        if (remainingTimes[currentProcess] === 0) {
          completedProcesses++;
          const completionTime = currentTime;
          const waitingTime = completionTime - parseInt(sortedRows[currentProcess]?.arrivalTime) - parseInt(sortedRows[currentProcess]?.burstTime);
          totalWaitingTime += waitingTime;
          const turnaroundTime = waitingTime + parseInt(sortedRows[currentProcess]?.burstTime);
          totalTurnaroundTime += turnaroundTime;

          const newProcess = {
            ...sortedRows[currentProcess],
            startTime: parseInt(sortedRows[currentProcess]?.arrivalTime),
            finishTime: completionTime,
            waitingTime,
            turnaroundTime
          };

          setProcesses(prevProcesses => [
            ...prevProcesses,
            newProcess
          ]);

          ganttChartRef.current.push({
            id: sortedRows[currentProcess]?.id,
            startTime: startTime, 
            endTime: completionTime 
          });

          currentProcess = -1;
        }
      }

      avgWaitingTimeRef.current = totalWaitingTime / sortedRows.length;
      avgTurnaroundTimeRef.current = totalTurnaroundTime / sortedRows.length;
    }
  }, [rows]);

  return (
    <div className='container my-5'>
      <h3>Output for SRTF Algorithm: </h3>
      <div className='d-flex my-4'>
        {ganttChartRef.current.map((entry, index) => (
          <div key={index} className="border border-primary text-center" style={{ height: '500%', width: "20%", background: '#CBDBFF'}}>
            P{entry.id}<br />({entry.startTime} - {entry.endTime})
          </div>
        ))}
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
          {Array.from(new Set(processes.map(process => process.id)))
            .sort((a, b) => a - b)
            .map(processId => {
              const process = processes.find(proc => proc.id === processId);
              return (
                process.finishTime !== undefined && ( 
                  <tr key={process.id}>
                    <td>{`P${process.id}`}</td>
                    <td>{process.arrivalTime}</td>
                    <td>{process.burstTime}</td>
                    <td>{process.startTime}</td>
                    <td>{process.finishTime}</td>
                    <td>{process.waitingTime}</td>
                    <td>{process.turnaroundTime}</td>
                  </tr>
                )
              );
            })}
        </tbody>
      </table>
      <div className="my-4">
        <h5>Average Waiting Time: {avgWaitingTimeRef.current ? avgWaitingTimeRef.current.toFixed(2) : '-'}</h5>
        <h5>Average Turnaround Time: {avgTurnaroundTimeRef.current ? avgTurnaroundTimeRef.current.toFixed(2) : '-'}</h5>
      </div>
    </div>
  );
};

export default SRTF;
