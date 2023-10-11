import express from 'express'
import { fetcher, handleDiscussionsRepo, handleLanguages } from '../src/utils'

const app = express()

app.get('/api', async (req, res) => {
  const { username, discussions, languages } = req.query
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

  if (languages) {
    const query: string = require('../src/queries/languages').default

    let nodesArray: any[] = []
    // init loop
    let hasNextPage = true

    while (hasNextPage) {
      const {
        data: {
          user: {
            ownerRepo: {
              nodes,
              pageInfo: { hasNextPage: newHasNextPage, endCursor },
            },
          },
        },
      } = await fetcher(query, variables)
      nodesArray = [...nodesArray, ...nodes]
      variables = { ...variables, cursor: endCursor }
      hasNextPage = newHasNextPage

      const langs = handleLanguages(nodesArray)
      result = { ...result, ...langs }
    }
  }

  res.json(result)
})

export default app
