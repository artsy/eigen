global.fetch = require('jest-fetch-mock')
fetch.mockResponse(JSON.stringify({status: 500}))
