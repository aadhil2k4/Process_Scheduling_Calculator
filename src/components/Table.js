import React, { useState } from 'react'
import Fcfs from './Fcfs';


const Table = ({onEvaluate}) => {
    const [title, setTitle] = useState('FCFS');
    const [priority, Setpriority] = useState(false);
    const [quantum, Setquantum] = useState('')
    const [showFcfs, setShowFcfs] = useState(false)

    const [rows, setRows] = useState([
        {id: '1', arrivalTime: '', burstTime: '', priority: ''},
        {id: '2', arrivalTime: '', burstTime: '', priority: ''},
        {id: '3', arrivalTime: '', burstTime: '', priority: ''}
    ]);

    const Addrow =()=>{
        const newRow={
            id: rows.length+1,
            arrivalTime: '',
            burstTime: ''
        };
        setRows([...rows,newRow]);
    }

    const Removerow =(removeid)=>{
        const updatedRows = rows.filter(row => row.id!==removeid)
        setRows(updatedRows)
    }

    const setAlgo = (AlgoName)=>{
        setTitle(AlgoName)
        Setpriority(AlgoName==='Priority Preemptive' || AlgoName==='Priority Non-Preemptive')
        Setquantum(true ? AlgoName==='Round Robin':false)
    }

    const handleEvaluate =()=>{
        const tableData = rows.map(row =>(
            {
                id: row.id,
                arrivalTime: row.arrivalTime,
                burstTime: row.burstTime,
                priority: row.priority
            }
        ))
        onEvaluate(tableData,quantum)
        if(title==='FCFS'){
            setShowFcfs(true)
        }
    }

  return (
    <div style={{background: 'rgba(250, 250, 250, 0.657)'}}>
        <div class="d-flex justify-content-center">
        <div>
        <h1 className='text-center my-4'>{title} Algorithm</h1>
        </div>
        <div class="dropdown" style={{marginTop: "35px", marginLeft: "40px"}}>
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    Select Algorithm
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li><a class="dropdown-item" onClick={()=>setAlgo('FCFS')} href='/#'>FCFS</a></li>
    <li><a class="dropdown-item" onClick={()=>setAlgo('SJF')} href="/#">SJF</a></li>
    <li><a class="dropdown-item" onClick={()=>setAlgo('SRTF')} href="/#">SRTF</a></li>
    <li><a class="dropdown-item" onClick={()=>setAlgo('Round Robin')} href="/#">Round Robin</a></li>
    <li><a class="dropdown-item" onClick={()=>setAlgo('Priority Preemptive')} href="/#">Priority Preemptive</a></li>
    <li><a class="dropdown-item" onClick={()=>setAlgo('Priority Non-Preemptive')} href="/#">Priority Non-Preemptive</a></li>
  </ul>
</div>
</div>
<div className='container' style={{marginTop: '3rem'}}>
{quantum && <div style={{marginLeft: '13rem'}} className='d-flex text-center flex-row bd-highlight mb-3'><h5>Time Quantum: </h5> <input value={quantum} onChange={(e)=>{Setquantum(e.target.value)}} type="number" style={{width: '70px', height: '30px'}} class="form-control border border-dark mx-3" id="exampleFormControlInput1"></input> </div>}

<table style={{width: "70%", margin: "auto"}} class="table text-center col-sm table-striped border-dark table-bordered">
  <thead className='text-center'>
    <tr>
      <th scope="col">Process</th>
      <th scope="col">Arrival Time</th>
      <th scope="col">Burst Time</th>
      {priority && <th scope="col">Priority</th>}
    </tr>
  </thead>
  <tbody>
    {
        rows.map(row=>(
            <tr key={rows.id}>
            <th scope="row">P{row.id}</th>
            <td><input type="number" onChange={(e)=>{row.arrivalTime=e.target.value; setRows([...rows])}} value={row.arrivalTime} style={{fontSize: "1rem"}} class="form-control text-center form-control-sm border-0 bg-transparent shadow-none outline" id="exampleFormControlInput1" /></td>
            <td><input type="number" onChange={(e)=>{row.burstTime=e.target.value;setRows([...rows])}} value={row.burstTime} style={{fontSize: "1rem"}} class="form-control text-center form-control-sm border-0 bg-transparent shadow-none outline" id="exampleFormControlInput1" /></td>
            {priority && <td><input type="number" style={{fontSize: "1rem"}} value={row.priority} onChange={(e)=>{row.priority=e.target.value;setRows([...rows])}} class="form-control text-center form-control-sm border-0 bg-transparent shadow-none outline" id="exampleFormControlInput1" /></td>
}
          </tr>
          
        ))
    }

<a href='/#' onClick={Addrow}><i class="uil uil-plus-circle" style={{fontSize: "30px", color: "black"}}></i></a>
<a href='/#' onClick={()=>Removerow(rows[rows.length-1].id)} className='mx-3'><i class="uil uil-minus-circle" style={{fontSize: "30px", color: "black"}}></i></a>

  </tbody>
</table>
<div class="text-center">
  <button type="button" onClick={handleEvaluate} class="btn btn-primary">Calcuate</button>
</div>

</div>
{showFcfs && (
                <Fcfs rows={rows} />
            )}    </div>
  )
}

export default Table