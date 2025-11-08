// Minimal ambient module declaration to satisfy TypeScript when the
// `posthog-js` package doesn't ship types in the environment. This keeps
// the type surface small while allowing gradual typing improvements later.
declare module 'posthog-js' {
    // Very small subset used in the app. Consumers can augment this later.
    export interface PostHog {
        init: (...args: any[]) => any
        capture: (...args: any[]) => any
    }

    const posthog: PostHog
    export default posthog
}
