import express from 'express'
import { fetchDiscussionsData, fetchLanguagesData } from '../src/features'
import handleContributions from '../src/features/contributions'

const app = express()

app.get('/api', async (req, res) => {
  const { username, contributions, discussions, languages } = req.query

  if (!username) {
    return res
      .status(400)
      .json({ message: 'Bad Request. Please provide a valid username.' })
  }

  if (!process.env.GH_ACCESS_TOKEN) {
    return res.status(401).json({
      message:
        'Invalid GitHub Token. Please report this issue at https://github.com/devjiwonchoi/insights/issues',
    })
  }

  const variables: Record<string, any> = { login: username as string }
  let result = {}

  if (contributions) {
    const stars = req.query['contributions.stars'] as string
    const owner = req.query['contributions.owner'] as string
    // Allowed types: org, all
    const accountType = req.query['contributions.accountType'] as string
    const ignored = req.query['contributions.ignored'] as string
    // Allowed types: COMMIT, ISSUE, PULL_REQUEST, REPOSITORY (created), PULL_REQUEST_REVIEW
    // Queries: commit, issue, pull, repo, review
    const type = req.query['contributions.type'] as string

    const contribs = await handleContributions({
      login: username as string,
      stars,
      owner,
      accountType,
      ignored,
      type,
    })
    result = { ...result, contribs }
  }

  if (discussions) {
    const listRepo = !!req.query['discussions.listRepo']
    const nameWithOwner = listRepo && !!req.query['discussions.nameWithOwner']
    const onlyAnswers = listRepo && !!req.query['discussions.onlyAnswers']

    variables.nameWithOwner = nameWithOwner
    variables.onlyAnswers = onlyAnswers

    const discussionsData = await fetchDiscussionsData({ variables, listRepo })

    result = { ...result, discussions: discussionsData }
  }

  if (languages) {
    const limit = req.query['languages.limit'] as string
    const ignored = req.query['languages.ignored'] as string

    const languages = await fetchLanguagesData({ variables, limit, ignored })
    result = { ...result, ...languages }
  }

  res.json(result)
})

export default app
