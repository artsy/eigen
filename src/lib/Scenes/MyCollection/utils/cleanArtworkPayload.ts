export function cleanArtworkPayload(payload = {}): any {
  const cleanPayload = Object.entries(payload).reduce((acc, [key, value]) => {
    if (!!value) {
      return { ...acc, [key]: value }
    }
    return acc
  }, {})
  return cleanPayload
}
