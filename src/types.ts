export type QueryVariables = {
  login: string
  cursor?: string
  nameWithOwner?: boolean
  onlyAnswers?: boolean
  contributionTypes?: ContributionType[]
}

export type ContributionType =
  | 'COMMIT'
  | 'ISSUE'
  | 'PULL_REQUEST'
  | 'REPOSITORY'
  | 'PULL_REQUEST_REVIEW'
