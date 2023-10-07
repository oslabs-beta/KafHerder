import React from 'react'
import Menu from '../components/Menu'
import ClusterForm from '../components/ClusterForm'

function Navbar() {
  return (
    <>
      <div className='Navbar' style={{ minWidth: '300px'}}>
        {/* <Menu /> */}
        <ClusterForm />
      </div>
    </>
  )
}

export default Navbar