import { SuspendedPostHogPageView } from '@/components/PostHogProvider'
import React from 'react'

export const dynamic = 'force-dynamic'

const layout = ({ children }) => {
  return (
    <div>
      <SuspendedPostHogPageView />
      {children}
    </div>
  )
}

export default layout