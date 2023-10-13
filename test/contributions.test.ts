import { mockRequest } from './test-utils'

describe('contributions API', () => {
  it('should support basic API', async () => {
    const res = await mockRequest('&contributions=1')

    expect(res.body).toHaveProperty('contributions')

    const { contributions } = res.body

    const contributionsRepoArray = contributions.map((contribution: any) => {
      expect(contribution).toHaveProperty('repo')
      expect(contribution).toHaveProperty('avatarUrl')

      return contribution.repo
    })

    expect(contributionsRepoArray).toContain('nextjs.guide')
  })

  it('should support limit by repoStars', async () => {
    const res = await mockRequest(
      '&contributions=1&contributions.repoStars=100000',
    )

    const { contributions } = res.body

    const contributionsRepoArray = contributions.map(
      ({ repo }: { repo: string }) => repo,
    )

    expect(contributionsRepoArray).toContain('next.js')
    expect(contributionsRepoArray).not.toContain('nextjs.guide')
  })

  it('should exclude repos in repoExcludes with organization name', async () => {
    const res = await mockRequest(
      '&contributions=1&contributions.repoExcludes=vercel',
    )

    const { contributions } = res.body

    const contributionsRepoArray = contributions.map(
      ({ repo }: { repo: string }) => repo,
    )

    expect(contributionsRepoArray).not.toContain('next.js')
    expect(contributionsRepoArray).not.toContain('ai')
    expect(contributionsRepoArray).not.toContain('swr')
  })

  it('should exclude repos in repoExcludes with repository name', async () => {
    const res = await mockRequest(
      '&contributions=1&contributions.repoExcludes=next.js',
    )

    const { contributions } = res.body

    const contributionsRepoArray = contributions.map(
      ({ repo }: { repo: string }) => repo,
    )

    expect(contributionsRepoArray).not.toContain('next.js')
    expect(contributionsRepoArray).toContain('ai')
    expect(contributionsRepoArray).toContain('swr')
  })

  it('should support limit by contributionTypes', async () => {
    const res = await mockRequest(
      '&contributions=1&contributions.contributionTypes=commit',
    )

    const { contributions } = res.body

    const contributionsRepoArray = contributions.map(
      ({ repo }: { repo: string }) => repo,
    )

    expect(contributionsRepoArray).toContain('next.js')
  })

  it('should support includeUserRepo', async () => {
    const res = await mockRequest(
      '&contributions=1&contributions.includeUserRepo=1',
    )

    const { contributions } = res.body

    const contributionsRepoArray = contributions.map(
      ({ repo }: { repo: string }) => repo,
    )

    expect(contributionsRepoArray).toContain('bunchee')
  })

  it('should support nameWithOwner', async () => {
    const res = await mockRequest(
      '&contributions=1&contributions.nameWithOwner=1',
    )

    const { contributions } = res.body

    const contributionsRepoArray = contributions.map(
      ({ repo }: { repo: string }) => repo,
    )

    expect(contributionsRepoArray).toContain('vercel/next.js')
    expect(contributionsRepoArray).toContain('microsoft/TypeScript')
    expect(contributionsRepoArray).not.toContain('next.js')
    expect(contributionsRepoArray).not.toContain('TypeScript')
  })
})
