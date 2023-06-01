export default {
    async fetch(request, env) {
      // Needed for cloudflare pages to ignore the /functions directory used by nhost
      // Otherwise, serve the static assets.
      // Without this, the Worker will error and no assets will be served.
      return env.ASSETS.fetch(request);
    }
  }