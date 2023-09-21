import React from 'react';
import logo from '../assets/logo.png'
function RegistrationFields () {
    return (
        <div> 
            <img src = {logo} className = 'logo'/> 
            <form>
                <label> Email <input type="text" name="Email" /> </label>
                <label> UserName <input type="text" name="UserName" /> </label> 
                <label> Password <input type="text" name="Password" /> </label> 
                <label> Retype Password <input type="text" name="Retype Password" /> </label> 
                <input type ="submit" value ="Submit" />
                {/* need to forward to Registration Page */}
            </form>
        </div>
    )
}

export default RegistrationFields;