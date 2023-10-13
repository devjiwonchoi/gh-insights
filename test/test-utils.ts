import request from 'supertest'
import app from '../api'

export async function mockRequest(requestQuery: string) {
  const basePath = '/api?username=devjiwonchoi'
  return await request(app).get(basePath + requestQuery)
}
