import express from 'express'
// import setupMiddware from './middleware'
// import { restRouter } from './api'
// import { connect } from './db'
// import { signin, protect } from './api/module/auth'

// declare an app from express
const app = express()

app.get('/', (req, res) => {
  res.json({ ok: true })
})

export default app