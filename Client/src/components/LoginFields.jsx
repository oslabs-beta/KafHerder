import React from 'react';
import logo from '../assets/logo.png'
function LoginFields () {
    return (
        <div> 
            <img src = {logo} className = 'logo'/> 
            <form>
                <label> UserName <input type="text" name="UserName" /> </label>
                <label> Password <input type="text" name="Password" /> </label> 
                <input type ="submit" value ="Submit" />
            </form>
        </div>
    )
}

export default LoginFields;