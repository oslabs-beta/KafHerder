import React from 'react';
import logo from '../assets/kaf1.svg'

function LoginFields () {
    return (
        <div> 
            <img src = {logo} className = 'logo'/> 
            <form>
                <label> UserName <input type="text" name="UserName" /> </label>
                <label> Password <input type="text" name="Password" /> </label> 
                <input type ="submit" value ="Submit" />
                {/* need to forward to Registration Page */}
                <div>Do not have an account? Make one here </div>
            </form>
        </div>
    )
}

export default LoginFields;