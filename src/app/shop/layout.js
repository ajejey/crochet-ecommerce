import React from 'react'
import HeaderSection from '../HeaderSection'

const layout = ({ children }) => {
    return (
        <div>
            <HeaderSection />
            <div className="mt-16">
                {children}
            </div>
        </div>
    )
}

export default layout