type Connection<Node> =
  | {
      readonly edges?:
        | ReadonlyArray<{ readonly node?: Node | null } | null | undefined>
        | null
        | undefined
    }
  | undefined
  | null

export function extractNodes<Node extends object, T = Node>(
  connection: Connection<Node>,
  mapper?: (node: Node) => T
): T[] {
  return (
    connection?.edges
      ?.map((edge) => (mapper ? (mapper(edge?.node!) as any) : edge?.node!))
      .filter((x) => x != null) ?? []
  )
}

export function isConnectionEmpty<Node extends object>(connection: Connection<Node>) {
  return !extractNodes(connection).length
}
