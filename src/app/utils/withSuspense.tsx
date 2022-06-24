import { Spinner } from "palette"
import React, { Suspense } from "react"

export const withSuspense = (WrappedComponent: React.FC<any>, Placeholder?: React.FC<any>) => () =>
  (
    <Suspense fallback={Placeholder ? <Placeholder /> : <Spinner />}>
      <WrappedComponent />
    </Suspense>
  )
