import { isArray, isBoolean, isNull, isNumber, isPlainObject, isString } from "lodash"

export function assignDeep(object: any, otherObject: any) {
  for (const k of Object.keys(otherObject)) {
    if (!(k in object) || !(isPlainObject(object[k]) && isPlainObject(otherObject[k]))) {
      object[k] = otherObject[k]
    } else {
      assignDeep(object[k], otherObject[k])
    }
  }
}

export const SESSION_KEY = "sessionState"

/**
 * Removes sessionState and computed properties.
 */
export function sanitize(object: unknown, path: Array<string | number> = []): unknown {
  if (isPlainObject(object)) {
    const result = {} as any
    for (const key of Object.keys(object as any)) {
      // ignore computed properties, sessionState
      if (key !== SESSION_KEY && !Object.getOwnPropertyDescriptor(object, key)?.get) {
        result[key] = sanitize((object as any)[key], [...path, key])
      }
    }
    return result
  } else if (isArray(object)) {
    return object.map((elem, i) => sanitize(elem, [...path, i]))
  } else if (isNumber(object) || isString(object) || isNull(object) || isBoolean(object)) {
    return object
  } else {
    console.error(`Cannot serialize value at path ${path.join(".")}: ${object}`)
    return null
  }
}
