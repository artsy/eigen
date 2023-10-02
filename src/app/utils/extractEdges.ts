export function extractEdges<Edge extends object, T = Edge>(
  connection: { edges: ReadonlyArray<T> | null | undefined } | null | undefined
) {
  return (connection?.edges || []).filter((edge) => edge != null) ?? []
}
