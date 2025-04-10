import React from 'react'
import HeaderSection from '../(header)/HeaderSection'
import { SuspendedPostHogPageView } from '@/components/PostHogProvider'

const layout = ({ children }) => {
  return (
    <div>
      <SuspendedPostHogPageView />
      <HeaderSection />
      {children}
    </div>
  )
}

export default layout