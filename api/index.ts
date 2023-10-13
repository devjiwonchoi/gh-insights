import express from 'express'
import {
  fetchContributionsData,
  fetchDiscussionsData,
  fetchLanguagesData,
} from '../src/features'

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
    const repoStars = req.query['contributions.repoStars'] as string
    const repoExcludes = req.query['contributions.repoExcludes'] as string
    const contributionTypes = req.query[
      'contributions.contributionTypes'
    ] as string
    const includeUserRepo = !!req.query['contributions.includeUserRepo']
    const nameWithOwner = !!req.query['contributions.nameWithOwner']

    const contributionsVariables = { ...variables, nameWithOwner }

    const contributionsData = await fetchContributionsData({
      variables: contributionsVariables,
      repoStars,
      repoExcludes,
      contributionTypes,
      includeUserRepo,
    })

    result = { ...result, contributions: contributionsData }
  }

  if (discussions) {
    const listRepo = !!req.query['discussions.listRepo']
    const nameWithOwner = listRepo && !!req.query['discussions.nameWithOwner']
    const onlyAnswers = listRepo && !!req.query['discussions.onlyAnswers']

    const discussionsVariables = { ...variables, nameWithOwner, onlyAnswers }

    const discussionsData = await fetchDiscussionsData({
      variables: discussionsVariables,
      listRepo,
    })

    result = { ...result, discussions: discussionsData }
  }

  if (languages) {
    const limit = req.query['languages.limit'] as string
    const excludes = req.query['languages.excludes'] as string

    const languagesData = await fetchLanguagesData({
      variables,
      limit,
      excludes,
    })

    result = { ...result, languages: languagesData }
  }

  res.json(result)
})

export default app
