import { SuspendedPostHogPageView } from '@/components/PostHogProvider'
import React from 'react'

const layout = ({ children }) => {
  return (
    <div>
      <SuspendedPostHogPageView />
      {children}
    </div>
  )
}

export default layout