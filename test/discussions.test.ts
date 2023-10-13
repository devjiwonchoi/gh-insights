import { mockRequest } from './test-utils'

let repoListAll: string[] = []

describe('Discussions Insights API', () => {
  it('should support basic API', async () => {
    const res = await mockRequest('&discussions=1')

    expect(res.body).toHaveProperty('discussions')

    const { discussions } = res.body

    expect(discussions).toHaveProperty('started')
    expect(discussions).toHaveProperty('comments')
    expect(discussions).toHaveProperty('answers')

    const { started, comments, answers } = discussions

    expect(typeof started.totalCount === 'number').toBe(true)
    expect(typeof comments.totalCount === 'number').toBe(true)
    expect(typeof answers.totalCount === 'number').toBe(true)
  })

  it('should support listRepo', async () => {
    const res = await mockRequest('&discussions=1&discussions.listRepo=1')

    const { discussions } = res.body

    expect(discussions).toHaveProperty('repoList')

    const { repoList } = discussions

    expect(Array.isArray(repoList)).toBe(true)

    repoListAll = repoList.map((repo: any) => {
      expect(repo).toHaveProperty('repo')
      expect(repo).toHaveProperty('avatarUrl')

      return repo.repo
    })
  })

  it('should support nameWithOwner', async () => {
    const res = await mockRequest(
      '&discussions=1&discussions.listRepo=1&discussions.nameWithOwner=1',
    )

    const {
      discussions: { repoList },
    } = res.body

    repoList.forEach(({ repo }: { repo: string }) =>
      expect(repo).toContain('/'),
    )
  })

  it('should support onlyAnswers', async () => {
    const res = await mockRequest(
      '&discussions=1&discussions.listRepo=1&discussions.onlyAnswers=1',
    )

    const {
      discussions: { repoList },
    } = res.body

    // TODO: Not an accurate test. Need to find a better way to test this.
    expect(repoList.length).toBeLessThan(repoListAll.length)
  })
})
