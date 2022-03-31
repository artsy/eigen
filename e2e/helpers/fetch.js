const wait = (time = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}


export const waitUntil = async (callback) => {
  return new Promise(async (resolve, reject) => {
    const timer = Date.now()
    let res = await callback()

    while (!res) {
      // timeout when longer than 100s
      if (Date.now() - timer >= 100000) {
        reject("waitUntil function timed out")
      }

      await wait()
      res = await callback()
    }

    resolve(res)
  })
}