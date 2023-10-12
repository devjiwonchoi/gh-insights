import request from 'supertest'
import app from '../api'

describe('Contributions insights', () => {
  it('should return basic', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&contributions=1',
    )
    expect(response.status).toBe(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('contribs')

    const { contribs } = response.body

    contribs.forEach((contrib: any) => {
      expect(contrib).toHaveProperty('name')
      expect(contrib).toHaveProperty('avatarUrl')
    })
  })

  it('should filter by stars', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&contributions=1&contributions.stars=100',
    )
    expect(response.status).toBe(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('contribs')

    const { contribs } = response.body

    contribs.forEach((contrib: any) => {
      expect(contrib).toHaveProperty('name')
      expect(contrib).toHaveProperty('avatarUrl')
    })
  })

  it('should support all account types', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&contributions=1&contributions.accountType=all',
    )
    expect(response.status).toBe(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('contribs')

    const { contribs } = response.body

    contribs.forEach((contrib: any) => {
      expect(contrib).toHaveProperty('name')
      expect(contrib).toHaveProperty('avatarUrl')
    })
  })

  it('should support owner/repo name', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&contributions=1&contributions.owner=1',
    )
    expect(response.status).toBe(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('contribs')

    const { contribs } = response.body

    contribs.forEach((contrib: any) => {
      expect(contrib).toHaveProperty('name')
      expect(contrib).toHaveProperty('avatarUrl')
      expect(contrib.name).toContain('/')
    })
  })

  it('should support ignored repos', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&contributions=1&contributions.ignored=next.js',
    )
    expect(response.status).toBe(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('contribs')

    const { contribs } = response.body

    contribs.forEach((contrib: any) => {
      expect(contrib).toHaveProperty('name')
      expect(contrib).toHaveProperty('avatarUrl')
      expect(contrib.name).not.toContain('next.js')
    })
  })
})
