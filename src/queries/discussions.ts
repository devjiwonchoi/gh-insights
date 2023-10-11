// TODO: convert to export/import as .graphql file
export const discussions = `query ($login: String!) {
  user(login: $login) {
    name
    login
    started: repositoryDiscussions {
      totalCount
    }
    comments: repositoryDiscussionComments {
      totalCount
    }
    answers: repositoryDiscussionComments(onlyAnswers: true) {
      totalCount
    }
  }
}`
