const client = require("..");
const config = require('../Data/config.json')
const mongoose = require('mongoose')

client.on('ready', () => {
  console.log(`Login Successful: ${client.user.tag}`.green);
  mongoose.connect(config.mongooseConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})
