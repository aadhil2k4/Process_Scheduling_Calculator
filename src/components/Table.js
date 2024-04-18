import React, { useState } from "react";
import Fcfs from "./Fcfs";
import Sjf from "./Sjf";
import RoundRobinScheduler from "./RR";
import PrioritySJF from "./SJFPriority";

const Table = ({ onEvaluate }) => {
  const [title, setTitle] = useState("FCFS");
  const [priority, setPriority] = useState(false);
  const [quantum, setQuantum] = useState("");
  const [showFcfs, setShowFcfs] = useState(false);
  const [showSjf, setShowSjf] = useState(false);
  const [showRoundRobin, setShowRoundRobin] = useState(false);
  const [showPrioritySJF, setPrioritySJF] = useState(false);

  const [rows, setRows] = useState([
    { id: "1", arrivalTime: "", burstTime: "", priority: "" },
    { id: "2", arrivalTime: "", burstTime: "", priority: "" },
    { id: "3", arrivalTime: "", burstTime: "", priority: "" },
  ]);

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      arrivalTime: "",
      burstTime: "",
      priority: "",
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (removeId) => {
    const updatedRows = rows.filter((row) => row.id !== removeId);
    setRows(updatedRows);
  };

  const setAlgo = (algoName) => {
    setTitle(algoName);
    setPriority(
      algoName === "Priority Preemptive" ||
        algoName === "Priority Non-Preemptive"
    );
    setQuantum(algoName === "Round Robin" ? true : false);
  };

  const handleEvaluate = () => {
    const tableData = rows.map((row) => ({
      id: row.id,
      arrivalTime: row.arrivalTime,
      burstTime: row.burstTime,
      priority: row.priority,
    }));

    onEvaluate(tableData, quantum);

    if (title === "FCFS") {
      setShowFcfs(true);
    } else if (title === "SJF") {
      setShowSjf(true);
    } else if (title === "Round Robin") {
      setShowRoundRobin(true);
    } else if (title === "Priority Non-Preemptive") {
      setPrioritySJF(true);
    }
  };

  return (
    <div style={{ background: "rgba(250, 250, 250, 0.657)" }}>
      <div className="d-flex justify-content-center">
        <div>
          <h1 className="text-center my-4">{title} Algorithm</h1>
        </div>
        <div
          className="dropdown"
          style={{ marginTop: "35px", marginLeft: "40px" }}
        >
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Select Algorithm
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                onClick={() => setAlgo("FCFS")}
                href="/#"
              >
                FCFS
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => setAlgo("SJF")}
                href="/#"
              >
                SJF
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => setAlgo("SRTF")}
                href="/#"
              >
                SRTF
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => setAlgo("Round Robin")}
                href="/#"
              >
                Round Robin
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => setAlgo("Priority Preemptive")}
                href="/#"
              >
                Priority Preemptive
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => setAlgo("Priority Non-Preemptive")}
                href="/#"
              >
                Priority Non-Preemptive
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ marginTop: "3rem" }}>
        {quantum && (
          <div
            style={{ marginLeft: "13rem" }}
            className="d-flex text-center flex-row bd-highlight mb-3"
          >
            <h5>Time Quantum: </h5>{" "}
            <input
              value={quantum}
              onChange={(e) => {
                setQuantum(e.target.value);
              }}
              type="number"
              style={{ width: "70px", height: "30px" }}
              className="form-control border border-dark mx-3"
              id="exampleFormControlInput1"
            ></input>{" "}
          </div>
        )}

        <table
          style={{ width: "70%", margin: "auto" }}
          className="table text-center col-sm table-striped border-dark table-bordered"
        >
          <thead className="text-center">
            <tr>
              <th scope="col">Process</th>
              <th scope="col">Arrival Time</th>
              <th scope="col">Burst Time</th>
              {priority && <th scope="col">Priority</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">P{row.id}</th>
                <td>
                  <input
                    type="number"
                    onChange={(e) => {
                      row.arrivalTime = e.target.value;
                      setRows([...rows]);
                    }}
                    value={row.arrivalTime}
                    style={{ fontSize: "1rem" }}
                    className="form-control text-center form-control-sm border-0 bg-transparent shadow-none outline"
                    id="exampleFormControlInput1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    onChange={(e) => {
                      row.burstTime = e.target.value;
                      setRows([...rows]);
                    }}
                    value={row.burstTime}
                    style={{ fontSize: "1rem" }}
                    className="form-control text-center form-control-sm border-0 bg-transparent shadow-none outline"
                    id="exampleFormControlInput1"
                  />
                </td>
                {priority && (
                  <td>
                    <input
                      type="number"
                      style={{ fontSize: "1rem" }}
                      value={row.priority}
                      onChange={(e) => {
                        row.priority = e.target.value;
                        setRows([...rows]);
                      }}
                      className="form-control text-center form-control-sm border-0 bg-transparent shadow-none outline"
                      id="exampleFormControlInput1"
                    />
                  </td>
                )}
              </tr>
            ))}
            <a href="/#" onClick={addRow}>
              <i
                className="uil uil-plus-circle"
                style={{ fontSize: "30px", color: "black" }}
              ></i>
            </a>
            <a
              href="/#"
              onClick={() => removeRow(rows[rows.length - 1].id)}
              className="mx-3"
            >
              <i
                className="uil uil-minus-circle"
                style={{ fontSize: "30px", color: "black" }}
              ></i>
            </a>
          </tbody>
        </table>
        <div className="text-center">
          <button
            type="button"
            onClick={handleEvaluate}
            className="btn btn-primary"
          >
            Calculate
          </button>
        </div>
      </div>

      {showFcfs && <Fcfs rows={rows} />}
      {showSjf && <Sjf rows={rows} />}
      {showRoundRobin && <RoundRobinScheduler rows={rows} quantum={quantum} />}
      {showPrioritySJF && <PrioritySJF rows={rows} />}
    </div>
  );
};

export default Table;
