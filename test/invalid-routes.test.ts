import request from 'supertest'
import app from '../src/app'

describe('Missing username query', () => {
  it('should return 400 status with info message', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(400)
    expect(response.text).toBe('Please provide a valid username')
  })
})
