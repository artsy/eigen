export class RouteMatcher {
  private parts: ReadonlyArray<{ type: "match" | "variable"; value: string }>
  constructor(public route: string, public module: string) {
    if (!route.match(/^(\/|(\/:?[\w-]+)+)$/)) {
      throw new Error("Invalid route format")
    }
    this.parts = route
      .slice(1)
      .split("/")
      .filter(Boolean)
      .map(part => {
        if (part.startsWith(":")) {
          return {
            type: "variable",
            value: part.slice(1),
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
    if (pathParts.length !== this.parts.length) {
      return null
    }
    const params = {} as any
    for (let i = 0; i < this.parts.length; i++) {
      const part = this.parts[i]
      if (part.type === "variable") {
        params[part.value] = pathParts[i]
      } else if (part.value !== pathParts[i]) {
        return null
      }
    }

    return params
  }
}
