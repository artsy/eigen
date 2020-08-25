type RoutePart = { type: "match"; value: string } | { type: "variable"; name: string } | { type: "wildcard" }

export class RouteMatcher {
  private parts: ReadonlyArray<RoutePart>
  constructor(public route: string, public module: string, private paramsMapper?: (val: any) => object) {
    if (!route.match(/^(\/\*?|(\/:?[\w-]+)+(\/\*)?)$/)) {
      throw new Error(`Invalid route format '${route}'.`)
    }
    this.parts = route
      .slice(1)
      .split("/")
      .filter(Boolean)
      .map(part => {
        if (part.startsWith(":")) {
          return {
            type: "variable",
            name: part.slice(1),
          }
        } else if (part === "*") {
          return {
            type: "wildcard",
          }
        } else {
          return {
            type: "match",
            value: part,
          }
        }
      })
  }

  match(pathParts: string[]): object | null {
    const hasWildcard = this.parts[this.parts.length - 1]?.type === "wildcard"
    if (!hasWildcard && pathParts.length !== this.parts.length) {
      return null
    }
    const params = {} as any
    loop: for (let i = 0; i < this.parts.length; i++) {
      const part = this.parts[i]
      switch (part.type) {
        case "match":
          if (part.value !== pathParts[i]) {
            return null
          }
          break
        case "variable":
          params[part.name] = pathParts[i]
          break
        case "wildcard":
          params["*"] = pathParts.slice(i).join("/")
          break loop
      }
    }

    return this.paramsMapper?.(params) ?? params
  }
}
