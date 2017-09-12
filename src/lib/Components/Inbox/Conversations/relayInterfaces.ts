interface RelayProps {
  me: {
    conversation: {
      __id: string
      id: string
      from: {
        name: string
        email: string
        initials: string
      }
      to: {
        name: string
        initials: string
      }
      messages: {
        pageInfo?: {
          hasNextPage: boolean
        }
        edges: Array<{
          node: {
            impulse_id: string
            is_from_user: boolean
          } | null
        }>
      }
      items: Array<{
        item: any
      }>
    }
  }
}

export default RelayProps
