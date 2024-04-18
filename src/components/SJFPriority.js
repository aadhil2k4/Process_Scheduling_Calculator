import React, { useState, useEffect, useRef } from "react";

const PrioritySJF = ({ rows }) => {
  const [executedProcesses, setExecutedProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (rows && rows.length > 0) {
      let totalWaitingTime = 0;
      let totalTurnaroundTime = 0;

      const readyQueue = [...rows];
      readyQueue.sort((a, b) => {
        if (parseInt(a.priority) !== parseInt(b.priority)) {
          return parseInt(a.priority) - parseInt(b.priority);
        } else {
          return parseInt(a.arrivalTime) - parseInt(b.arrivalTime);
        }
      });

      const updatedExecutedProcesses = [];

      let currentTime = 0;

      while (readyQueue.length > 0) {
        const availableProcesses = readyQueue.filter(
          (process) => parseInt(process.arrivalTime) <= currentTime
        );

        if (availableProcesses.length === 0) {
          currentTime = parseInt(readyQueue[0].arrivalTime);
          continue;
        }

        const selectedProcess = availableProcesses[0]; 

        for (const process of availableProcesses) {
          if (parseInt(process.priority) < parseInt(selectedProcess.priority)) {
            selectedProcess = process;
          } else if (
            parseInt(process.priority) === parseInt(selectedProcess.priority) &&
            parseInt(process.arrivalTime) < parseInt(selectedProcess.arrivalTime)
          ) {
            selectedProcess = process;
          }
        }

        const index = readyQueue.findIndex(
          (process) => process === selectedProcess
        );
        readyQueue.splice(index, 1);

        const waitingTime = currentTime - parseInt(selectedProcess.arrivalTime);
        const turnaroundTime =
          waitingTime + parseInt(selectedProcess.burstTime);

        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;

        updatedExecutedProcesses.push({
          ...selectedProcess,
          waitingTime: waitingTime,
          startTime: currentTime,
          finishTime: currentTime + parseInt(selectedProcess.burstTime),
          turnaroundTime: turnaroundTime,
        });

        currentTime += parseInt(selectedProcess.burstTime);
      }

      avgWaitingTimeRef.current = totalWaitingTime / rows.length;
      avgTurnaroundTimeRef.current = totalTurnaroundTime / rows.length;

      setExecutedProcesses(updatedExecutedProcesses);
    }
  }, [rows]);

  return (
    <div className="container my-5">
      <h4>Gantt Chart:</h4>
      <div className="d-flex my-4">
        {executedProcesses.map((process, index) => (
          <div
            key={index}
            className="border border-info text-center bg-light"
            style={{ height: "500%", width: "20%" }}
          >
            P{process.id}
            <br />({process.startTime}-{process.finishTime})
          </div>
        ))}
      </div>
      <table
        style={{ margin: "auto" }}
        className="table text-center table-bordered"
      >
        <thead>
          <tr className="table-primary">
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
          {executedProcesses.map((process, index) => (
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
        <h5>
          Average Waiting Time:{" "}
          {avgWaitingTimeRef.current
            ? avgWaitingTimeRef.current.toFixed(2)
            : "-"}
        </h5>
        <h5>
          Average Turnaround Time:{" "}
          {avgTurnaroundTimeRef.current
            ? avgTurnaroundTimeRef.current.toFixed(2)
            : "-"}
        </h5>
      </div>
    </div>
  );
};

export default PrioritySJF;