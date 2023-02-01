import { useEffect } from "react"

interface ContainerProps {
  refetch: () => void
  query?: string
}

export const RefetchSearchTermQuery: React.FC<ContainerProps> = (props) => {
  const { query, refetch } = props

  useEffect(() => {
    if (!!query) {
      refetch()
    }
  }, [query])

  return null
}
