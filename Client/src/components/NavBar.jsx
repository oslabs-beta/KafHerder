import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/kafHerder9-1.png'



function NavBar() {


    return (
                
        <div className='NavBar'>
            <div><img className="navBarImage" src={logo} alt="Kafherder Logo" /></div>
            <div className='NavBarOptions'>
                <ul>
                    <li>
                        <Link to="/homepage">Home</Link>
                    </li>
                    <li>
                        <Link to="/repartition">Repartition</Link>
                    </li>
                    <li><a>Logout</a></li>
                </ul>
            </div>
        </div>
        
    )
}

export default NavBar