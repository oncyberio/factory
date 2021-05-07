import { VercelRequest, VercelResponse } from '@vercel/node'

export default (request: VercelRequest, response: VercelResponse) => {
  if (request.method === 'OPTIONS') {
    return response.status(200).end()
  }

  response.status(200).send(`pong ${Date.now()}`)
}
