import React from 'react'


// creating dropdown functionalitity.
// check to see if button is on or off. 
// if off, the menu will be hidden
// if on, the menu will be expanded



function Menu() {
  return (
    // <div>
    //     <button>Hamburger Menu</button>
    // </div>
    <>
    <section class="p-menu1">
  <nav id="navbar" class="navigation" role="navigation">
    <input id="toggle1" type="checkbox" />
    <label class="hamburger1" for="toggle1">
      <div class="top"></div>
      <div class="meat"></div>
      <div class="bottom"></div>
    </label>
  
    <nav class="menu1">
      <a class="link1" href="">Settings List</a>
      <a class="link1" href="">Logout</a>

    </nav>
</nav>
</section>
</>
  )
}

export default Menu