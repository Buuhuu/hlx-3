const { hostname, href } = window.location;
const isHlx = hostname.match(/\.hlx(\.page|\.live)$/);
const endpoint = isHlx || hostname.match(/(localhost|127.0.0.1)(:\d+)?/)
  ? new URL('https://sitesinternal.tt.omtrdc.net/rest/v1/delivery')
  : new URL('/_decisioning', window.location);
const sessionId = window.sessionStorage.getItem('at_sessionId') || crypto.randomUUID();
const tntId = window.localStorage.getItem('at_tntId');
window.sessionStorage.setItem('at_sessionId', sessionId);
endpoint.searchParams.append('client', 'sitesinternal');
endpoint.searchParams.append('sessionId', sessionId);
const [orientation] = screen.orientation.type.split('-');
const address = {
  url: !isHlx ? new URL(window.location.pathname, 'https://main--hlx-3--buuhuu.hlx.page') : href,
  referringUrl: document.referrer,
};
const atreq = {
  requestId: crypto.randomUUID(),
  context: {
    userAgent: navigator.userAgent,
    channel: 'web',
    screen: { width: screen.width, height: screen.height, orientation, colorDepth: screen.colorDepth, pixelRatio: devicePixelRatio },
    window: { width: window.innerWidth, height: window.innerHeight },
    browser: { host: hostname },
    address
  },
  execute: { pageLoad: { address } }
}
if (tntId) {
  atreq.id = { tntId };
}
window.atresp$ = fetch(endpoint, { method: 'POST', body: JSON.stringify(atreq) })
  .then((resp) => resp.ok ? resp.json() : undefined)
  .then((json) => {
    if (json) window.localStorage.setItem('at_tntId', json.id.tntId);
    return json;
  });
