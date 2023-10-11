import express from 'express'
import { fetcher, handleDiscussionsRepo } from '../src/utils'

const app = express()

app.get('/', async (req, res) => {
  const { username, discussions } = req.query
  if (!username) return res.status(400).send('Please provide a valid username')

  let variables: Record<string, any> = { login: username as string }
  let result = {}

  if (discussions) {
    const query: string = require('../src/queries/discussions').default
    const {
      data: { user },
    } = await fetcher(query, variables)
    result = { ...result, ...user }

    const repo = req.query['discussions.repo']
    if (repo) {
      const query: string = require('../src/queries/discussions').repo
      const onlyAnswers = repo === 'answered'
      let nodesArray: any[] = []
      // init loop
      let hasNextPage = true

      variables = { ...variables, onlyAnswers }

      while (hasNextPage) {
        const {
          data: {
            user: {
              repo: {
                nodes,
                pageInfo: { hasNextPage: newHasNextPage, endCursor },
              },
            },
          },
        } = await fetcher(query, variables)
        nodesArray = [...nodesArray, ...nodes]
        variables = { ...variables, cursor: endCursor }
        hasNextPage = newHasNextPage
      }

      const repos = handleDiscussionsRepo(nodesArray)
      result = { ...result, repos }
    }
  }

  res.json(result)
})

export default app
