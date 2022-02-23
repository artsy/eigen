// tiny dev tool to bust the image cache on reload for testing loading states
const now = Date.now()
export const devCacheBust = (url: string) => (__DEV__ ? url + "?time=" + now : url)
