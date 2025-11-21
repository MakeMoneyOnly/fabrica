export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Fabrica is Working! 🎉</h1>
          <p className="text-gray-600 mb-6">
            Your creator economy platform is successfully deployed.
          </p>

          {/* Environment Variables Check */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Environment Status:</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Clerk Key:</span>
                <span
                  className={
                    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Found' : '❌ Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Supabase URL:</span>
                <span
                  className={
                    process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Found' : '❌ Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Supabase Key:</span>
                <span
                  className={
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Next step: Enable authentication by restoring the Clerk setup
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
