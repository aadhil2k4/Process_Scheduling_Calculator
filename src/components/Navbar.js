import React from 'react'

const Navbar = () => {
  return (
    <div>
        <nav className="navbar navbar-light bg-dark">
  <div className="container-fluid">
    <a className="navbar-brand text-light" href="/">OS-Scheduling Algorithms</a>
    <div className='d-flex'><a href="/"><i style={{color: 'white', fontSize: '2rem'}} class="uil uil-github"></i></a></div>
  </div>
</nav>
    </div>
  )
}

export default Navbar