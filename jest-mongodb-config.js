module.exports = {
    mongodbMemoryServerOptions: {
      instance: {
        dbName: 'jest'
      },
      binary: {
        version: 'v4.2-latest', // Version of MongoDB
        skipMD5: true
      },
      autoStart: false
    }
  };