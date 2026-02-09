import createMollieClient, { type MollieClient } from '@mollie/api-client'

let _client: MollieClient | null = null

export function getMollieClient(): MollieClient {
  if (!_client) {
    if (!process.env.MOLLIE_API_KEY) {
      throw new Error('MOLLIE_API_KEY environment variable is required')
    }
    _client = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY })
  }
  return _client
}
