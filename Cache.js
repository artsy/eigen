// @ts-check

const S3 = require("aws-sdk/clients/s3")
const aws = require("aws-sdk")
const fs = require("fs")
const path = require("path")
const rimraf = require("rimraf")
const tar = require("tar-fs")
const zlib = require("zlib")
const { spawnSync } = require("child_process")
const { S3CacheBackend } = require("./S3CacheBackend")

/**
 * @typedef {{ getObject(key: string, path: string): Promise<boolean>, putObject(key: string, path: string): Promise<void> }} CacheBackend
 */

/**
 * @typedef {{ accessKeyId: string, secretAccessKey: string, bucket: string }} S3Config
 */
class Cache {
  /**
   * @param {CacheBackend} cache
   */
  constructor(cache = new S3CacheBackend()) {
    this.cache = cache
    this.tmpdir = fs.mkdtempSync(path.join(process.env.TMPDIR, "gudetama-"))
    process.addListener("exit", () => {
      rimraf.sync(this.tmpdir)
    })
  }

  /**
   * @param {string} key
   * @param {string[]} paths
   * @returns {Promise<void>}
   */
  async save(key, paths) {
    const startPack = Date.now()
    const pack = tar.pack(".", { entries: paths })
    const tarballPath = path.join(this.tmpdir, key)
    const out = fs.createWriteStream(tarballPath)
    console.log("tar-fs creating tarball at", tarballPath)
    pack.pipe(out)
    await new Promise((resolve, reject) => {
      out.on("close", resolve)
      pack.on("error", reject)
    })
    console.log("took", (Date.now() - startPack).toFixed(1) + "s")
    console.log("tar creating tarball at", tarballPath)
    const startPackTar = Date.now()
    const result = spawnSync('tar', ['cf', tarballPath, ...paths])
    if (result.status !== 0) {
      console.error(result.output.toString())
      throw new Error("tar failed")
    }
    console.log("took", (Date.now() - startPackTar).toFixed(1) + "s")
    console.log("uploading...")
    const startUpload = Date.now()
    await this.cache.putObject(key, tarballPath)
    console.log("took", (Date.now() - startUpload).toFixed(1) + "s")
  }

  /**
   *
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async restore(key) {
    const tarballPath = path.join(this.tmpdir, key)
    const startDownload = Date.now()
    console.log("downloading")
    if (await this.cache.getObject(key, tarballPath)) {
      console.log("took", (Date.now() - startDownload).toFixed(1) + "ms")
      console.log("unarchiving with tar-fs")
      const startUnpack = Date.now()
      fs.createReadStream(tarballPath)
        .pipe(tar.extract("."))
        .on("finish", () => {
          console.log("took", (Date.now() - startUnpack).toFixed(1) + "ms")
          console.log("unarchiving with tar")
          const startUnpackTar = Date.now()
          const result = spawnSync("tar", ["xf", tarballPath, "-C", process.cwd()])
          if (result.status !== 0) {
            throw new Error("tar spawn failed")
          }
          console.log("took", (Date.now() - startUnpackTar).toFixed(1) + "ms")
        })
      return true
    }
    return false
  }
}

module.exports.Cache = Cache
async function run() {
  try {
    switch (process.argv[2]) {
      case "save":
        await new Cache().save("node_modules_test", ["node_modules"])
        break
      case "restore":
        await new Cache().restore("node_modules_test")
        break
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

run()
