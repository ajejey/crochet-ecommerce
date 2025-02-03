import React from 'react'
import HeaderSection from '../(header)/HeaderSection'

const layout = ({ children }) => {
  return (
    <div>
        <HeaderSection />
        {children}
        </div>
  )
}

export default layout