'use client'

import { useState } from 'react'

export default function GraphQLTestPage() {
  const [query, setQuery] = useState(`query {
  users {
    id
    email
    name
    creditRequests {
      id
      amount
      status
    }
  }
}`)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const executeQuery = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          GraphQL API Tester
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Query Input */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Query / Mutation
            </h2>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-96 p-4 font-mono text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your GraphQL query or mutation here..."
            />
            <button
              onClick={executeQuery}
              disabled={loading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
              {loading ? 'Executing...' : 'Execute Query'}
            </button>
          </div>

          {/* Result Output */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Result
            </h2>
            <pre className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-md overflow-auto">
              {result || 'Results will appear here...'}
            </pre>
          </div>
        </div>

        {/* Example Queries */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Example Queries & Mutations
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Create User:</h3>
              <button
                onClick={() => setQuery(`mutation {
  createUser(input: {
    email: "test@example.com"
    name: "Test User"
    phone: "+1234567890"
  }) {
    id
    email
    name
  }
}`)}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
              >
                Load Example
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Create Credit Request:</h3>
              <button
                onClick={() => setQuery(`mutation {
  createCreditRequest(input: {
    userId: "USER_ID_HERE"
    amount: 10000.00
    interestRate: 12.5
    termMonths: 12
  }) {
    id
    amount
    status
    user {
      name
    }
  }
}`)}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
              >
                Load Example
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Get All Credit Requests:</h3>
              <button
                onClick={() => setQuery(`query {
  creditRequests {
    id
    amount
    interestRate
    termMonths
    status
    user {
      name
      email
    }
    paymentInstallments {
      installmentNumber
      amount
      status
    }
  }
}`)}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
              >
                Load Example
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
