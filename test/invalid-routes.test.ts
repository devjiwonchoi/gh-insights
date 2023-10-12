import request from 'supertest'
import app from '../api'

describe('Missing username query', () => {
  it('should return 400 status with info message', async () => {
    const response = await request(app).get('/api')
    expect(response.status).toBe(400)
    expect(response.body.message).toBe(
      'Bad Request. Please provide a valid username.',
    )
  })

  it('should return 401 status with info message', async () => {
    let originalToken = process.env.GH_ACCESS_TOKEN
    process.env.GH_ACCESS_TOKEN = ''

    const response = await request(app).get('/api?username=devjiwonchoi')
    expect(response.status).toBe(401)
    expect(response.body.message).toContain(
      'Invalid GitHub Token. Please report this issue at',
    )

    process.env.GH_ACCESS_TOKEN = originalToken
  })
})
