export function extractNodes<Node extends object, T = Node>(
  connection:
    | { readonly edges?: ReadonlyArray<{ readonly node?: Node | null } | null> | null }
    | undefined
    | null,
  mapper?: (node: Node) => T
): T[] {
  return (
    connection?.edges
      ?.map((edge) => (mapper ? (mapper(edge?.node!) as any) : edge?.node!))
      .filter((x) => x != null) ?? []
  )
}
