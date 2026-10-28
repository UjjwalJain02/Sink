import type { Link } from '#shared/schemas/link'
import { escape } from 'es-toolkit/string'
import { parseURL } from 'ufo'

const CLOAKING_IFRAME_SANDBOX = [
  'allow-scripts',
  'allow-same-origin',
  'allow-forms',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
  'allow-top-navigation-by-user-activation',
  'allow-downloads',
  'allow-modals',
].join(' ')

function buildMetaTags(link: Link, baseUrl: string) {
  const { host: hostname } = parseURL(link.url)
  const title = link.title || hostname || 'Link'
  const hasImage = !!link.image
  const imageUrl = hasImage && link.image!.startsWith('/')
    ? `${baseUrl}${link.image}`
    : link.image
  const twitterCard = hasImage ? 'summary_large_image' : 'summary'

  const tags = [
    link.description ? `<meta name="description" content="${escape(link.description)}">` : '',
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${escape(baseUrl)}/${escape(link.slug)}">`,
    `<meta property="og:title" content="${escape(title)}">`,
    link.description ? `<meta property="og:description" content="${escape(link.description)}">` : '',
    hasImage ? `<meta property="og:image" content="${escape(imageUrl!)}">` : '',
    `<meta name="twitter:card" content="${twitterCard}">`,
    `<meta name="twitter:title" content="${escape(title)}">`,
    link.description ? `<meta name="twitter:description" content="${escape(link.description)}">` : '',
    hasImage ? `<meta name="twitter:image" content="${escape(imageUrl!)}">` : '',
  ].filter(Boolean).join('\n    ')

  return { title, tags }
}

export function generateCloakingHtml(link: Link, targetUrl: string, baseUrl: string): string {
  const { title, tags } = buildMetaTags(link, baseUrl)

  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escape(title)}</title>
    ${tags}
</head>
<body style="margin:0;overflow:hidden">
    <iframe src="${escape(targetUrl)}" style="width:100%;height:100%;width:100vw;height:100vh;border:none" sandbox="${CLOAKING_IFRAME_SANDBOX}" allowfullscreen referrerpolicy="no-referrer"></iframe>
    <noscript><meta http-equiv="refresh" content="0;url=${escape(targetUrl)}"></noscript>
</body>
</html>`
}

interface PasswordHtmlOptions {
  hasError?: boolean
  locale?: RedirectLocale
}

export function generatePasswordHtml(slug: string, options: PasswordHtmlOptions = {}): string {
  const { hasError = false, locale = 'en-US' } = options
  const t = REDIRECT_TRANSLATIONS[locale]
  return `<!DOCTYPE html>
<html lang="${escape(locale)}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="robots" content="noindex">
    <title>${escape(t.passwordTitle)}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#09090b;color:#fafafa}
      .card{background:#0a0a0a;border:1px solid #27272a;border-radius:8px;padding:2rem;width:100%;max-width:360px;margin:1rem;box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)}
      h1{font-size:1.125rem;font-weight:600;margin-bottom:1.5rem;text-align:center;letter-spacing:-.025em}
      .error{color:#ef4444;font-size:.875rem;margin-bottom:1rem;text-align:center;font-weight:500}
      label{display:block;font-size:.875rem;font-weight:500;margin-bottom:.5rem;color:#fafafa}
      input[type=password]{width:100%;padding:.5rem .75rem;background:#09090b;border:1px solid #27272a;border-radius:6px;font-size:.875rem;outline:none;color:#fafafa;margin-bottom:1rem;transition:border-color .15s ease}
      input[type=password]:focus{border-color:#52525b;box-shadow:0 0 0 2px rgba(82,82,91,.3)}
      input[type=password]::placeholder{color:#52525b}
      button{width:100%;padding:.5rem;background:#fafafa;color:#18181b;border:none;border-radius:6px;font-size:.875rem;font-weight:500;cursor:pointer;transition:background-color .15s ease}
      button:hover{background:#e4e4e7}
    </style>
</head>
<body>
    <div class="card">
        <h1>${escape(t.passwordTitle)}</h1>${hasError ? `\n        <p class="error">${escape(t.passwordError)}</p>` : ''}
        <form method="POST" action="/${escape(slug)}">
            <label for="password">${escape(t.passwordLabel)}</label>
            <input type="password" id="password" name="password" required autofocus placeholder="${escape(t.passwordPlaceholder)}">
            <button type="submit">${escape(t.continue)}</button>
        </form>
    </div>
</body>
</html>`
}

interface UnsafeWarningHtmlOptions {
  password?: string
  locale?: RedirectLocale
}

export function generateUnsafeWarningHtml(slug: string, targetUrl: string, options: UnsafeWarningHtmlOptions = {}): string {
  const { password, locale = 'en-US' } = options
  const t = REDIRECT_TRANSLATIONS[locale]
  return `<!DOCTYPE html>
<html lang="${escape(locale)}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="robots" content="noindex">
    <title>${escape(t.unsafeTitle)}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#09090b;color:#fafafa}
      .card{background:#0a0a0a;border:1px solid #27272a;border-radius:8px;padding:2rem;width:100%;max-width:420px;margin:1rem;box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)}
      .warning{display:flex;align-items:center;justify-content:center;gap:.75rem;margin-bottom:1rem}
      .warning svg{width:1.5rem;height:1.5rem;color:#ef4444;flex-shrink:0}
      h1{font-size:1.125rem;font-weight:600;letter-spacing:-.025em;color:#ef4444}
      .desc{font-size:.875rem;color:#a1a1aa;margin-bottom:1rem;line-height:1.5;text-align:center}
      .url{font-size:.8125rem;color:#a1a1aa;background:#18181b;border:1px solid #27272a;border-radius:6px;padding:.5rem .75rem;word-break:break-all;margin-bottom:1.5rem;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}
      .actions{display:flex;gap:.75rem}
      .btn{flex:1;padding:.5rem;border-radius:6px;font-size:.875rem;font-weight:500;cursor:pointer;text-align:center;text-decoration:none;border:none;transition:background-color .15s ease}
      .btn-back{border:1px solid #27272a;background:#18181b;color:#fafafa}
      .btn-back:hover{background:#27272a}
      .btn-continue{background:#fafafa;color:#18181b}
      .btn-continue:hover{background:#e4e4e7}
    </style>
</head>
<body>
    <div class="card">
        <div class="warning">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            <h1>${escape(t.unsafeTitle)}</h1>
        </div>
        <p class="desc">${escape(t.unsafeDesc)}</p>
        <div class="url">${escape(targetUrl)}</div>
        <div class="actions">
            <a href="javascript:history.back()" class="btn btn-back">${escape(t.goBack)}</a>
            <form method="POST" action="/${escape(slug)}" style="flex:1;display:flex">
                <input type="hidden" name="confirm" value="true">${password ? `\n                <input type="hidden" name="password" value="${escape(password)}">` : ''}
                <button type="submit" class="btn btn-continue" style="width:100%">${escape(t.continue)}</button>
            </form>
        </div>
    </div>
</body>
</html>`
}

interface AppLaunchHtmlOptions {
  webUrl: string
  appUrl?: string | null
  browserEscapeUrl?: string | null
  showInstructions?: boolean
  isAndroid?: boolean
  isInAppBrowser?: boolean
  locale?: RedirectLocale
}

function toInlineScriptJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

// Runs in the visitor's browser: try the app, then the system browser, then the web URL.
const APP_LAUNCH_SCRIPT = `(function(){
var c=JSON.parse(document.getElementById('sink-launch').textContent);
var timers=[];
function cancel(){timers.forEach(clearTimeout);timers=[]}
document.addEventListener('visibilitychange',function(){if(document.hidden)cancel()});
window.addEventListener('pagehide',cancel);
window.addEventListener('blur',cancel);
function open(u){var a=document.createElement('a');a.href=u;a.rel='noreferrer';document.body.appendChild(a);a.click();a.remove()}
function later(f,ms){timers.push(setTimeout(f,ms))}
var app=c.app;
if(app&&navigator.brave&&/package=com\\.google\\.android\\.youtube;/i.test(app)){
var m=app.match(/(?:[?&]v=|\\/shorts\\/|youtu\\.be\\/)([\\w-]{11})/);
app=m?'intent:'+m[1]+'#Intent;scheme=vnd.youtube;end':null;
var b=document.getElementById('open-app');
if(b){if(app)b.href=app;else b.remove()}
}
if(c.instructions)return;
if(app){
open(app);
later(function(){if(c.escape)open(c.escape);else if(!c.inApp)location.replace(c.web)},c.android?2500:1500);
}else if(c.escape){open(c.escape)}
})()`

export function generateAppLaunchHtml(options: AppLaunchHtmlOptions): string {
  const { webUrl, appUrl = null, browserEscapeUrl = null, showInstructions = false, isAndroid = false, isInAppBrowser = false, locale = 'en-US' } = options
  const t = REDIRECT_TRANSLATIONS[locale]
  const title = showInstructions || !appUrl ? t.inAppTitle : t.appOpening
  const config = toInlineScriptJson({ web: webUrl, app: appUrl, escape: browserEscapeUrl, instructions: showInstructions, android: isAndroid, inApp: isInAppBrowser })
  const primaryLink = appUrl
    ? `<a id="open-app" class="btn btn-primary" href="${escape(appUrl)}">${escape(t.appOpenInApp)}</a>`
    : browserEscapeUrl
      ? `<a class="btn btn-primary" href="${escape(browserEscapeUrl)}">${escape(t.appOpenInBrowser)}</a>`
      : ''
  const secondaryHref = appUrl && browserEscapeUrl ? browserEscapeUrl : webUrl
  const secondaryLabel = isInAppBrowser && secondaryHref === webUrl ? t.appContinueHere : t.appOpenInBrowser

  return `<!DOCTYPE html>
<html lang="${escape(locale)}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="robots" content="noindex">
    <title>${escape(title)}</title>
    <noscript><meta http-equiv="refresh" content="0;url=${escape(webUrl)}"></noscript>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#09090b;color:#fafafa}
      .card{background:#0a0a0a;border:1px solid #27272a;border-radius:8px;padding:2rem;width:100%;max-width:360px;margin:1rem;text-align:center}
      h1{font-size:1.125rem;font-weight:600;letter-spacing:-.025em;margin-bottom:.5rem}
      .desc{font-size:.875rem;color:#a1a1aa;line-height:1.5;margin-bottom:1.5rem}
      .actions{display:flex;flex-direction:column;gap:.75rem}
      .btn{display:block;padding:.625rem;border-radius:6px;font-size:.875rem;font-weight:500;text-decoration:none;transition:background-color .15s ease}
      .btn-primary{background:#fafafa;color:#18181b}
      .btn-primary:hover{background:#e4e4e7}
      .btn-secondary{border:1px solid #27272a;background:#18181b;color:#fafafa}
      .btn-secondary:hover{background:#27272a}
      .hint{position:fixed;top:.75rem;right:1.25rem;display:flex;flex-direction:column;align-items:flex-end}
      .hint svg{width:1.75rem;height:2.5rem;color:#fafafa;animation:bounce 1s ease-in-out infinite}
      @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    </style>
</head>
<body>${showInstructions
  ? `
    <div class="hint" aria-hidden="true"><svg viewBox="0 0 28 40" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 36V4m0 0L4 14m10-10 10 10"/></svg></div>`
  : ''}
    <div class="card">
        <h1>${escape(title)}</h1>
        <p class="desc">${escape(showInstructions ? `${t.inAppTapMenu} ${t.inAppChooseBrowser}` : appUrl ? t.appOpeningDesc : t.inAppDesc)}</p>
        <div class="actions">${showInstructions ? '' : primaryLink ? `\n            ${primaryLink}` : ''}
            <a class="btn btn-secondary" href="${escape(showInstructions ? webUrl : secondaryHref)}">${escape(showInstructions ? t.appContinueHere : secondaryLabel)}</a>
        </div>
    </div>
    <script type="application/json" id="sink-launch">${config}</script>
    <script>${APP_LAUNCH_SCRIPT}</script>
</body>
</html>`
}

export function generateOgHtml(link: Link, targetUrl: string, baseUrl: string): string {
  const { title, tags } = buildMetaTags(link, baseUrl)

  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${escape(title)}</title>
    ${tags}
    <meta http-equiv="refresh" content="1;url=${escape(targetUrl)}">
</head>
<body>
    <p>Redirecting to <a href="${escape(targetUrl)}">${escape(targetUrl)}</a>...</p>
</body>
</html>`
}
