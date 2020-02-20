/**
 * An extension of the Error with a Response object
 */
export class NetworkError extends Error {
  response?: Response
}
