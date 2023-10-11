import React from 'react'
import { Link } from 'react-router-dom'
import kafHerderLogo1a from '../assets/kaf1.svg'



function NavBar() {


    return (
                
        <div className='NavBar'>
            <div><img className="navBarImage" src={kafHerderLogo1a} alt="Kafherder Logo" /></div>
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