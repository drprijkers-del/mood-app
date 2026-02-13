import createMollieClient, { type MollieClient } from '@mollie/api-client'

let _client: MollieClient | null = null

export function getMollieClient(): MollieClient {
  if (!_client) {
    const apiKey = process.env.MOLLIE_API_KEY?.trim()
    if (!apiKey) {
      throw new Error('MOLLIE_API_KEY environment variable is required')
    }
    _client = createMollieClient({ apiKey })
  }
  return _client
}
