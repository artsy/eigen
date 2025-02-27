import { Sentinel } from "app/utils/Sentinel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { usePrefetch } from "app/utils/queryPrefetching"
import { FC, ReactElement, useRef } from "react"
import { Variables } from "relay-runtime"

export interface PrefetchableLinkProps {
  to: string
  prefetchVariables?: Variables
  children: ReactElement
}

export const PrefetchableLink: FC<PrefetchableLinkProps> = ({
  to,
  prefetchVariables,
  children,
}) => {
  const isPrefetched = useRef(false)
  const prefetchUrl = usePrefetch()
  const enableViewPortPrefetching = useFeatureFlag("AREnableViewPortPrefetching")

  const handleVisible = (isVisible: boolean) => {
    if (enableViewPortPrefetching && isVisible && !isPrefetched.current) {
      prefetchUrl(to, prefetchVariables)
      isPrefetched.current = true
    }
  }

  if (!enableViewPortPrefetching) {
    return <>{children}</>
  }

  return <Sentinel onChange={handleVisible}>{children}</Sentinel>
}
