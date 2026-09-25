export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Direct asset match
    let res = await env.ASSETS.fetch(request);
    if (res.status !== 404) {
      return res;
    }

    // Try clean URLs / pathname.html
    if (!pathname.includes('.')) {
      const cleanUrl = new URL(request.url);
      cleanUrl.pathname = pathname.endsWith('/') ? `${pathname}index.html` : `${pathname}.html`;
      res = await env.ASSETS.fetch(new Request(cleanUrl, request));
      if (res.status !== 404) {
        return res;
      }

      // Try pathname/index.html
      const subUrl = new URL(request.url);
      subUrl.pathname = `${pathname.replace(/\/$/, '')}/index.html`;
      res = await env.ASSETS.fetch(new Request(subUrl, request));
      if (res.status !== 404) {
        return res;
      }
    }

    // Return 404.html fallback
    const notFoundUrl = new URL('/404.html', request.url);
    return env.ASSETS.fetch(new Request(notFoundUrl, request));
  }
};
