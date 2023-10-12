import request from 'supertest'
import app from '../api'

describe('Basic discussions insights', () => {
  it('should return name, login, started, comments, and answers', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&discussions=1',
    )
    expect(response.status).toBe(200)
    // TODO: Replace this to `image/svg+xml` when we return SVG
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('discussions')
    expect(response.body.discussions).toHaveProperty('started')
    expect(response.body.discussions).toHaveProperty('comments')
    expect(response.body.discussions).toHaveProperty('answers')
  })
})

describe('Discussions', () => {
  it('should return repo and avatarUrl of all participated discussions', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&discussions=1&discussions.listRepo=1',
    )
    expect(response.status).toBe(200)
    // TODO: Replace this to `image/svg+xml` when we return SVG
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('discussions')

    const {
      discussions: { repoList },
    } = response.body

    repoList.forEach((repo: any) => {
      expect(repo).toHaveProperty('repo')
      expect(repo).toHaveProperty('avatarUrl')
    })
  })

  it('should return repo and avatarUrl of answered discussions', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&discussions=1&discussions.listRepo=1&discussions.onlyAnswers=1',
    )
    expect(response.status).toBe(200)
    // TODO: Replace this to `image/svg+xml` when we return SVG
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('discussions')

    const {
      discussions: { repoList },
    } = response.body

    repoList.forEach((repo: any) => {
      expect(repo).toHaveProperty('repo')
      expect(repo).toHaveProperty('avatarUrl')
    })
  })
})
