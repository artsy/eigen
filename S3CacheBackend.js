// @ts-check
const S3 = require('aws-sdk/clients/s3')
const aws = require('aws-sdk')
const fs = require('fs')

/**
 * @typedef {{ accessKeyId: string, secretAccessKey: string, bucket: string }} S3Config
 */

class S3CacheBackend {
  /**
   *
   * @param {S3Config} config
   */
  constructor({ accessKeyId, secretAccessKey, bucket } = defaultConfig) {
    this.bucket = bucket
    this.client = new S3({
      credentials: new aws.Credentials({ accessKeyId, secretAccessKey }),
    })
  }
  /**
   * @param {string} key
   * @param {string} filePath
   * @returns {Promise<boolean>}
   */
  async getObject(key, filePath) {
    const inStream = this.client
      .getObject({
        Bucket: this.bucket,
        Key: key,
      })
      .createReadStream()
    const outStream = fs.createWriteStream(filePath)
    inStream.pipe(outStream)
    return await new Promise((resolve, reject) => {
      inStream.on('error', reject).on('end', () => resolve(true))
    }).catch((error) => {
      if (error.code === 'NoSuchKey') {
        return false
      } else {
        throw error
      }
    })
  }

  /**
   *
   * @param {string} key
   * @param {string} path
   * @returns {Promise<void>}
   */
  async putObject(key, path) {
    const inStream = fs.createReadStream(path)
    return this.client
      .putObject({
        Key: key,
        Bucket: this.bucket,
        Body: inStream,
      })
      .promise()
      .then(console.log)
  }
}

/**
 * @type {S3Config}
 */
const defaultConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: process.env.GUDETAMA_S3_BUCKET_NAME,
}

module.exports.S3CacheBackend = S3CacheBackend
