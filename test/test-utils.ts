import request from 'supertest'
import app from '../api'

export async function mockRequest(requestQuery: string) {
  const baseURL = '/api?username=devjiwonchoi'
  return await request(app).get(baseURL + requestQuery)
}
