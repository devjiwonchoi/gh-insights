import express from 'express'
import { answered } from './queries/discussions/answered'
import { GITHUB_ACCESS_TOKEN, GITHUB_GRAPHQL_API } from './constants'

const app = express()

app.get('/', async (req, res) => {
  const { username } = req.query
  const variables = { login: username as string, listRepo: true }
  const response = await fetch(GITHUB_GRAPHQL_API, {
    headers: {
      Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
    },
    method: 'POST',
    body: JSON.stringify({ query: answered, variables }),
  })
  const data = await response.json()
  res.json(data)
})

app.listen(8000, () => {
  console.log('http://localhost:8000')
})
