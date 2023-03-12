console.clear()
console.log(`******************* SERVER LOADED *******************`)

import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import cors from 'cors'
import logger from 'morgan'
import bodyParser from 'body-parser'

import routes from './src/routes/routes.js'

// ==========
// Database initialization
// ==========

mongoose
  .set('strictQuery', true)
  .connect('mongodb://127.0.0.1:27017/kodesblog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(init)
  .catch((err) => {
    console.log('Error with Mongo', err.reason)
  })

// ==========
// App initialization
// ==========

async function init() {
  dotenv.config()
  const { APP_HOSTNAME, APP_PORT, NODE_ENV, APP_SECRET } = process.env

  const app = express()

  // ==========
  // App middlewares
  // ==========

  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use('/public', express.static('public'))
  app.use(
    logger('dev', {
      skip: function (req, res) {
        return res.statusCode < 400
      },
    }),
  )

  // ==========
  // App routers
  // ==========

  app.options('*', cors())
  app.use(cors())
  app.use('/', routes)

  // ==========
  // App start
  // ==========

  app.listen(APP_PORT, () => {
    console.log(`App listening at http://${APP_HOSTNAME}:${APP_PORT}`)
  })
}
