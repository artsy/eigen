/* tslint:disable */

/**
 * FIXME: This fix came from https://github.com/styled-components/styled-components/issues/1642#issuecomment-394816116.
 * The other options in this thread led to cascading errors, though this worked.
 *
 * Original error:
 * node_modules/styled-components/typings/styled-components.d.ts(116,51): error TS2694: Namespace 'NodeJS' has no
 * exported member 'ReadableStream'. 116   interleaveWithNodeStream(readableStream: NodeJS.ReadableStream): NodeJS.ReadableStream;
 */
declare namespace NodeJS {
  export interface ReadableStream {}
}
