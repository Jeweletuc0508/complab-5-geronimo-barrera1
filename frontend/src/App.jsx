import { useState } from 'react'
import './App.css'

function App() {
  const [gatewayResult, setGatewayResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function checkApiGateway() {
    setIsLoading(true)
    setGatewayResult(null)
    setError('')

    try {
      const response = await fetch('http://localhost:8080/', {
        method: 'GET',
      })

      let data
      try {
        data = await response.json()
      } catch {
        throw new Error('The API Gateway returned an invalid response.')
      }

      if (!response.ok) {
        throw new Error(`The API Gateway responded with HTTP ${response.status}.`)
      }

      if (
        !data ||
        typeof data !== 'object' ||
        !data.service ||
        !data.status
      ) {
        throw new Error('The API Gateway response did not include service and status.')
      }

      setGatewayResult({
        service: String(data.service),
        status: String(data.status),
      })
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to connect to the API Gateway. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="application-card" aria-labelledby="app-title">
        <div className="app-mark" aria-hidden="true">
          MS
        </div>
        <p className="eyebrow">SERVICE DASHBOARD</p>
        <h1 id="app-title">Microservices Application</h1>
        <p className="intro">
          Check the connection to your API Gateway and view its current status.
        </p>

        <button
          className="gateway-button"
          type="button"
          onClick={checkApiGateway}
          disabled={isLoading}
        >
          {isLoading ? 'Checking connection…' : 'Check API Gateway'}
        </button>

        <div className="gateway-panel" aria-live="polite">
          <div className="gateway-panel-heading">
            <span className="status-indicator" aria-hidden="true" />
            <h2>API Gateway</h2>
          </div>

          {isLoading && <p className="feedback">Connecting to localhost:8080…</p>}
          {error && <p className="feedback error-message">{error}</p>}
          {gatewayResult && (
            <dl className="gateway-details">
              <div>
                <dt>Service</dt>
                <dd>{gatewayResult.service}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd className="result-status">{gatewayResult.status}</dd>
              </div>
            </dl>
          )}
          {!isLoading && !error && !gatewayResult && (
            <p className="feedback">No connection check has been run yet.</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
