'use strict'

// Built-in Modules
const http = require('http')
// NPM Modules
const express = require('express')
const responseTime = require('response-time')
const cors = require('cors')


// Custom Modules
const { application } = require('./config')
const { middleware } = require('./middleware/controllers')
const routes = require('./routes/routes')

// Initiate express
const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(responseTime((req, res, time) => console.log(req.method, req.url, time.toFixed(2))))
app.use((error, req, res, next) => middleware.trackRequest(error, req, res, next))

// Serve routes
routes.handler(app)

let startServer = () => {
  try {
    let serverTime = http.createServer(app).listen(application.port, () => {
      console.log(`CRUD server started at ${new Date().toLocaleString()}`)
      console.log(`PID: ${process.pid}.`)
      console.log(`HTTP Port: ${application.port}`)
    })
    serverTime.timeout = 30000;

  } catch (error) {
    console.log(`DB Connection Failed: `, error)
  }
}
startServer()

