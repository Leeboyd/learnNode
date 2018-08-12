import express from 'express'
import setupMiddware from './middleware'
// import { connect } from 'net';
// import { restRouter } from './api'
// import { connect } from './db'
// import { signin, protect } from './api/module/auth'

// declare an app from express
const app = express()

setupMiddware(app)
// connect()
// setup basic routing for index route

// app.use('/signin', signin)

// catch all
app.all('*', (req, res) => {
  res.json({ ok: true })
})

export default app