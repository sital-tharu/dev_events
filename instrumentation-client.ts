import posthog from "posthog-js"

// Only initialize PostHog in the browser and when we have a key
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: '2025-05-24',
    capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
    debug: process.env.NODE_ENV === "development",
    loaded: (client: any) => {
      if (process.env.NODE_ENV === 'development') console.log('PostHog loaded successfully')
    }
  })
} else if (process.env.NODE_ENV === 'development') {
  console.warn('PostHog not initialized. Check if NEXT_PUBLIC_POSTHOG_KEY is set in .env')
}
