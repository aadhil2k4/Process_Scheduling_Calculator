import React, { useState, useEffect, useRef } from 'react';

const SJF = ({ rows }) => {
  const [executedProcesses, setExecutedProcesses] = useState([]); 
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (rows && rows.length > 0) {
      let totalWaitingTime = 0;
      let totalTurnaroundTime = 0;

      const readyQueue = [...rows]; 

      readyQueue.sort((a, b) => parseInt(a.arrivalTime) - parseInt(b.arrivalTime));

      const updatedExecutedProcesses = [];

      let currentTime = 0; 

      while (readyQueue.length > 0) {
        
        const availableProcesses = readyQueue.filter(process => parseInt(process.arrivalTime) <= currentTime);

        if (availableProcesses.length === 0) {
          currentTime = parseInt(readyQueue[0].arrivalTime);
          continue;
        }

        const shortestJob = availableProcesses.reduce((minProcess, currentProcess) => {
          return parseInt(currentProcess.burstTime) < parseInt(minProcess.burstTime) ? currentProcess : minProcess;
        });

        currentTime += parseInt(shortestJob.burstTime);

        const index = readyQueue.findIndex(process => process === shortestJob);
        readyQueue.splice(index, 1);

        const waitingTime = currentTime - parseInt(shortestJob.arrivalTime) - parseInt(shortestJob.burstTime);
        const turnaroundTime = waitingTime + parseInt(shortestJob.burstTime);

        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;

        updatedExecutedProcesses.push({
          ...shortestJob,
          waitingTime: waitingTime,
          startTime: currentTime - parseInt(shortestJob.burstTime),
          finishTime: currentTime,
          turnaroundTime: turnaroundTime
        });
      }

      avgWaitingTimeRef.current = totalWaitingTime / rows.length;
      avgTurnaroundTimeRef.current = totalTurnaroundTime / rows.length;

      setExecutedProcesses(updatedExecutedProcesses);
    }
  }, [rows]); 

  return (
    <div className='container my-5'>
      <h3>Output for SJF Algorithm: </h3>
      <div className='d-flex my-4'>
        {executedProcesses.map((process, index) => (
          <div
            key={index}
            className="border border-primary text-center" style={{ height: '500%', width: '20%', background: '#CBDBFF'}}
          >
            P{process.id}
            <br />
            ({process.startTime}-{process.finishTime})
          </div>
        ))}
      </div>
      <table style={{ margin: 'auto' }} className="table text-center table-bordered">
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
          {executedProcesses.map((process, index) => (
            <tr key={index}>
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
