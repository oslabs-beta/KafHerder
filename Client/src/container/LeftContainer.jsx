import React from 'react'
import Menu from '../components/Menu'
import ClusterForm from '../components/ClusterForm'
import PartitionForm from '../components/PartitionComponents/PartitionForm'
import { useLocation } from 'react-router-dom'

function LeftContainer() {

  // use location hook 
  const location = useLocation();
  // create a renderContent function that will change between location pathnames
  // use the renderContent function to render the correct component
  const renderContent = () => {
    // /homepage returns <ClusterForm />
    if (location.pathname === '/homepage') {
      return <ClusterForm />
    // /repartition returns <PartitionForm />
    } else if (location.pathname === '/repartition') {
      return <PartitionForm />
    }
  }
 
  return (
    <>
      <div className='LeftContainer' style={{ minWidth: '300px'}}>
        {renderContent()}
      </div>
    </>
  )
}

export default LeftContainer