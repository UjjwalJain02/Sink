export type MobilePlatform = 'ios' | 'android'

export type InAppBrowser
  = | 'instagram'
    | 'threads'
    | 'facebook'
    | 'tiktok'
    | 'wechat'
    | 'x'
    | 'line'
    | 'snapchat'
    | 'pinterest'
    | 'linkedin'
    | 'webview'

// Order matters: Threads and Instagram can embed Instagram or Facebook markers in their user agents.
const IN_APP_BROWSER_PATTERNS: [InAppBrowser, RegExp][] = [
  ['threads', /Barcelona/i],
  ['instagram', /Instagram/i],
  ['facebook', /FBAN|FBAV|FB_IAB|FBIOS|FB4A|MessengerForiOS/i],
  ['tiktok', /musical_ly|trill_|BytedanceWebview|TikTok|ByteLocale/i],
  ['wechat', /MicroMessenger/i],
  ['x', /Twitter/i],
  ['line', /\bLine\//i],
  ['snapchat', /Snapchat/i],
  ['pinterest', /Pinterest/i],
  ['linkedin', /LinkedInApp/i],
]

// These webviews block every scheme-based escape, so visitors get manual instructions instead.
const INSTRUCTION_ONLY_IN_APP_BROWSERS = new Set<InAppBrowser>(['tiktok', 'wechat'])

// Schemes that would run script or read local data when navigated to from the short-link origin.
const BLOCKED_APP_SCHEMES = new Set(['javascript:', 'data:', 'vbscript:', 'file:', 'blob:', 'about:', 'filesystem:'])

function getProtocol(url: string): string | null {
  try {
    return new URL(url).protocol.toLowerCase()
  }
  catch {
    return null
  }
}

export function isWebUrl(url: string): boolean {
  const protocol = getProtocol(url)
  return protocol === 'http:' || protocol === 'https:'
}

/** A native app link (custom scheme or Android intent) that is safe to open from an HTML page. */
export function isAppLaunchUrl(url: string): boolean {
  const protocol = getProtocol(url)
  return !!protocol && !isWebUrl(url) && !BLOCKED_APP_SCHEMES.has(protocol)
}

export function detectMobilePlatform(userAgent: string): MobilePlatform | null {
  if (/android|harmonyos/i.test(userAgent))
    return 'android'
  // CriOS, FxiOS and EdgiOS can send a desktop (Macintosh) user agent on iPadOS.
  if (/iphone|ipad|ipod|crios|fxios|edgios/i.test(userAgent))
    return 'ios'
  return null
}

export function detectInAppBrowser(userAgent: string, platform: MobilePlatform): InAppBrowser | null {
  const match = IN_APP_BROWSER_PATTERNS.find(([, pattern]) => pattern.test(userAgent))
  if (match)
    return match[0]
  if (platform === 'android' && /;\s*wv\)/i.test(userAgent))
    return 'webview'
  // iOS WKWebView user agents omit the Safari token that Safari, Chrome, and SFSafariViewController send.
  if (platform === 'ios' && /AppleWebKit/i.test(userAgent) && !/Safari/i.test(userAgent))
    return 'webview'
  return null
}

export function needsOpenInBrowserInstructions(inAppBrowser: InAppBrowser | null): boolean {
  return !!inAppBrowser && INSTRUCTION_ONLY_IN_APP_BROWSERS.has(inAppBrowser)
}

function toAndroidIntentUrl(url: string): string {
  const match = url.match(/^([a-z][\w+.-]*):\/\/(.*)$/i)
  if (!match || /^(?:intent|https?)$/i.test(match[1]!))
    return url
  const path = match[2]!.replace(/#/g, '%23').replace(/;/g, '%3B')
  return `intent://${path}#Intent;scheme=${match[1]!.toLowerCase()};end`
}

function withIntentFallback(url: string, webUrl: string): string {
  if (!/^intent:/i.test(url) || /S\.browser_fallback_url=/i.test(url))
    return url
  return url.replace(/;end\s*$/i, `;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`)
}

/** The native app URL to open, adjusted for the visitor's browser. */
export function buildAppLaunchUrl(appUrl: string, webUrl: string, userAgent: string, platform: MobilePlatform): string {
  if (platform !== 'android')
    return appUrl
  // Opera GX for Android ignores bare custom schemes but honors intents.
  const url = /OPX\//.test(userAgent) ? toAndroidIntentUrl(appUrl) : appUrl
  // Android Chrome opens the fallback itself when the app is missing.
  return withIntentFallback(url, webUrl)
}

/** A URL that reopens `webUrl` in the system browser, or null when the webview blocks every escape. */
export function buildBrowserEscapeUrl(webUrl: string, platform: MobilePlatform, inAppBrowser: InAppBrowser): string | null {
  if (needsOpenInBrowserInstructions(inAppBrowser))
    return null

  if (platform === 'ios') {
    if (inAppBrowser === 'instagram')
      return `instagram://extbrowser/?url=${encodeURIComponent(webUrl)}`
    if (inAppBrowser === 'threads')
      return `barcelona://extbrowser/?url=${encodeURIComponent(webUrl)}`
    // iOS 17+ opens x-safari-https:// and x-safari-http:// URLs in Safari.
    return `x-safari-${webUrl}`
  }

  // X for Android drops intent navigations, so the visitor stays in its webview.
  if (inAppBrowser === 'x')
    return null

  const { protocol } = new URL(webUrl)
  // A fragment would terminate the intent data early; the fallback URL keeps it intact.
  const path = webUrl.replace(/^https?:\/\//i, '').split('#')[0]
  return `intent://${path}#Intent;scheme=${protocol.slice(0, -1)};action=android.intent.action.VIEW;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`
}
