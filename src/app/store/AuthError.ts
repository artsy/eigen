import { AuthPromiseRejectType } from "./AuthModel"

/**
 * Unifies and makes the errors thrown in AuthModel consistent
 */
export class AuthError implements AuthPromiseRejectType {
  public readonly message: string = ""
  public readonly error?: string
  public readonly meta?: AuthPromiseRejectType["meta"]
  constructor(message: string, error?: string, meta?: AuthPromiseRejectType["meta"]) {
    this.message = message
    this.error = error
    this.meta = meta
  }
}
