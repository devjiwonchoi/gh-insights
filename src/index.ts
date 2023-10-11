import express from 'express'
import { fetcher } from './utils'

const app = express()

app.get('/', async (req, res) => {
  const { username, discussions } = req.query
  if (!username) return res.status(400).send('Please provide a valid username')

  let variables = { login: username as string }
  let result = {}

  if (discussions) {
    const query: string = require('./queries/discussions').discussions
    const data = await fetcher(query, variables)
    result = { ...result, ...data.data.user }
  }

  res.json(result)
})

app.listen(8000, () => {
  console.log('http://localhost:8000')
})
