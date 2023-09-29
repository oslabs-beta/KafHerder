import React from 'react'
import logo from '../assets/kafHerder9-1.png'


// creating dropdown functionalitity.
// check to see if button is on or off. 
// if off, the menu will be hidden
// if on, the menu will be expanded



function Menu() {
  return (
    // <div>
    //     <button>Hamburger Menu</button>
    // </div>
    // <>
    //   <section className="p-menu1">
    //     <nav id="navbar" className="navigation" role="navigation">
    //       <input id="toggle1" type="checkbox" />
    //       <label className="hamburger1" htmlFor="toggle1">
    //         <div className="top"></div>
    //         <div className="meat"></div>
    //         <div className="bottom"></div>
    //       </label>
    //       <img src="#" alt="KafHerder" className="menuImage" />
    //       <nav className="menu1">
    //         <a className="link1" href="">Settings List</a>
    //         <a className="link1" href="">Logout</a>
    //       </nav>
    //     </nav>
    //   </section>
    // </>
    <>
      <section className="p-menu1">
        <nav id="navbar" className="navigation" role="navigation">
          <input id="toggle1" type="checkbox" />

          <div className="hamburgerAndImageContainer">
            <label className="hamburger1" htmlFor="toggle1">
              <div className="top"></div>
              <div className="meat"></div>
              <div className="bottom"></div>
            </label>
            <img className="menuImage" src={logo} alt="Kafherder Logo" />
          </div>

          <nav className="menu1">
            <a className="link1" href="">Settings List</a>
            <a className="link1" href="">Logout</a>
          </nav>
        </nav>
      </section>
    </>
  )
}

export default Menu