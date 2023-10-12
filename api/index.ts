import express from 'express'
import handleDiscussions from '../src/features/discussions'
import handleLanguages from '../src/features/languages'
import handleContributions from '../src/features/contributions'

const app = express()

app.get('/api', async (req, res) => {
  const { username, contributions, discussions, languages } = req.query
  if (!username) return res.status(400).send('Please provide a valid username')

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
