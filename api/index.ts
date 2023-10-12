import express from 'express'
import handleDiscussions from '../src/features/discussions'
import handleLanguages from '../src/features/languages'
import { fetcher, handleContributions } from '../src/utils'

const app = express()

app.get('/api', async (req, res) => {
  const { username, contributions, discussions, languages } = req.query
  if (!username) return res.status(400).send('Please provide a valid username')

  // TODO: refac as const, add as variables.x = y
  let variables: Record<string, any> = { login: username as string }
  let result = {}

  if (contributions) {
    const query: string = require('../src/queries/contributions').default
    const stars = req.query['contributions.stars'] as string
    const owner = req.query['contributions.owner'] as string
    // Allowed types: org, all
    const accountType = req.query['contributions.accountType'] as string
    const ignored = req.query['contributions.ignored'] as string
    // Allowed types: COMMIT, ISSUE, PULL_REQUEST, REPOSITORY (created), PULL_REQUEST_REVIEW
    // Queries: commit, issue, pull, repo, review
    const type = req.query['contributions.type'] as string

    if (type) {
      const contributionTypes = type.split(',').map((el) => {
        if (el === 'pull') return 'PULL_REQUEST'
        if (el === 'repo') return 'REPOSITORY'
        if (el === 'review') return 'PULL_REQUEST_REVIEW'

        return el.toUpperCase()
      })

      variables = { ...variables, contributionTypes }
    } else {
      const contributionTypes = [
        'COMMIT',
        'ISSUE',
        'PULL_REQUEST',
        'REPOSITORY',
        'PULL_REQUEST_REVIEW',
      ]

      variables.contributionTypes = contributionTypes
    }

    if (owner) variables = { ...variables, owner: true }

    let nodesArray: any[] = []
    // init loop
    let hasNextPage = true

    while (hasNextPage) {
      const {
        data: {
          user: {
            repositoriesContributedTo: {
              nodes,
              pageInfo: { hasNextPage: newHasNextPage, endCursor },
            },
          },
        },
      } = await fetcher(query, variables)
      nodesArray = [...nodesArray, ...nodes]
      variables = { ...variables, cursor: endCursor }
      hasNextPage = newHasNextPage

      const contribs = handleContributions(
        nodesArray,
        stars,
        accountType,
        ignored,
      )
      result = { ...result, ...contribs }
    }
  }

  if (discussions) {
    const repo = req.query['discussions.repo']
    const listRepo = !!repo
    const onlyAnswers = repo === 'answered'
    const discussions = await handleDiscussions({
      login: username as string,
      listRepo,
      onlyAnswers,
    })

    result = { ...result, discussions }
  }

  if (languages) {
    const limit = req.query['languages.limit'] as string
    const ignored = req.query['languages.ignored'] as string

    const languages = await handleLanguages({
      login: username as string,
      limit,
      ignored,
    })
    result = { ...result, ...languages }
  }

  res.json(result)
})

export default app
