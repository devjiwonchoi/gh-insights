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
})
