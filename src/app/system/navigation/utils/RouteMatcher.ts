import { AppModule } from "app/Navigation/routes"

type RoutePart =
  | { type: "match"; value: string }
  | { type: "variable"; name: string }
  | { type: "wildcard" }

export class RouteMatcher {
  private parts: ReadonlyArray<RoutePart>
  constructor(
    public route: string,
    public module: AppModule,
    private paramsMapper?: (val: any) => object
  ) {
    if (!route.match(/^(\/\*?|(\/:?[\w-]+)+(\/\*)?)$/)) {
      throw new Error(`Invalid route format '${route}'.

A route must start with a forward slash.
It may then contain any number of path segments joined by forward slashes,
   like "user/:id/profile"
A route can optionally end with a wildcard segment "/*"
Routes should not end with a forward slash.
`)
    }
    this.parts = route
      .slice(1)
      .split("/")
      .filter(Boolean)
      .map((part) => {
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

  match(pathParts: string[], queryParams?: object): object | null {
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

    const allParams = { ...queryParams, ...params }
    return this.paramsMapper?.(allParams) ?? allParams
  }
}
