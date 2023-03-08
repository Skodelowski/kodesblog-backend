console.clear()
console.log(`******************* SERVER LOADED *******************`)

import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import cors from 'cors'
import logger from 'morgan'
import multer from 'multer'

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

// ==========
// App initialization
// ==========

async function init() {
  dotenv.config()
  const { APP_HOSTNAME, APP_PORT, NODE_ENV, APP_SECRET } = process.env
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  const app = express()

  // ==========
  // App middlewares
  // ==========

  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(express.static('public'))
  app.use(
    logger('dev', {
      skip: function (req, res) {
        return res.statusCode < 400
      },
    }),
  )

  // ==========
  // Storage initialization
  // ==========

  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    },
  })

  var upload = multer({ storage: storage })

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
