import { describe, expect, it } from 'vitest'
import {
  buildAppLaunchUrl,
  buildBrowserEscapeUrl,
  detectInAppBrowser,
  detectMobilePlatform,
  isAppLaunchUrl,
} from '../../server/utils/app-launch'

const UA = {
  iosSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  iosChrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/122.0.6261.89 Mobile/15E148 Safari/604.1',
  iosInstagram: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 330.0.0.36.88 (iPhone15,2; iOS 17_4; en_US; en; scale=3.00; 1179x2556; 598402498)',
  iosThreads: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Barcelona 289.0.0.77.109 (iPhone14,7; iOS 17_1_2; en_US; en-US; scale=3.00; 1170x2532; 488780866)',
  iosFacebook: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/454.0.0.38.106;FBBV/580034442;FBDV/iPhone15,2;FBMD/iPhone;FBSN/iOS;FBSV/17.4;FBSS/3;FBID/phone;FBLC/en_US;FBOP/5]',
  iosTikTok: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_34.1.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US',
  iosWebView: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
  androidChrome: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
  androidFacebook: 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UQ1A.240205.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.119 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/454.0.0.44.109;]',
  androidX: 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UQ1A.240205.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.119 Mobile Safari/537.36 TwitterAndroid',
  androidWebView: 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UQ1A.240205.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.119 Mobile Safari/537.36',
  androidOperaGx: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36 OPX/2.4',
  macSafari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
}

describe('detectMobilePlatform', () => {
  it.each([
    [UA.iosSafari, 'ios'],
    [UA.iosChrome, 'ios'],
    [UA.androidChrome, 'android'],
    [UA.macSafari, null],
    ['Twitterbot/1.0', null],
  ])('detects %s', (ua, expected) => {
    expect(detectMobilePlatform(ua)).toBe(expected)
  })
})

describe('detectInAppBrowser', () => {
  it.each([
    [UA.iosSafari, 'ios', null],
    [UA.iosChrome, 'ios', null],
    [UA.iosInstagram, 'ios', 'instagram'],
    [UA.iosThreads, 'ios', 'threads'],
    [UA.iosFacebook, 'ios', 'facebook'],
    [UA.iosTikTok, 'ios', 'tiktok'],
    [UA.iosWebView, 'ios', 'webview'],
    [UA.androidChrome, 'android', null],
    [UA.androidFacebook, 'android', 'facebook'],
    [UA.androidX, 'android', 'x'],
    [UA.androidWebView, 'android', 'webview'],
  ] as const)('detects %s', (ua, platform, expected) => {
    expect(detectInAppBrowser(ua, platform)).toBe(expected)
  })
})

describe('isAppLaunchUrl', () => {
  it('accepts custom schemes and Android intents', () => {
    expect(isAppLaunchUrl('whatsapp://channel/abc')).toBe(true)
    expect(isAppLaunchUrl('intent://channel/abc#Intent;package=com.whatsapp;scheme=whatsapp;end')).toBe(true)
  })

  it('rejects web URLs and script-capable schemes', () => {
    expect(isAppLaunchUrl('https://apps.apple.com/app/id1')).toBe(false)
    expect(isAppLaunchUrl('javascript:alert(1)')).toBe(false)
    expect(isAppLaunchUrl('JavaScript:alert(1)')).toBe(false)
    expect(isAppLaunchUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
  })
})

describe('buildAppLaunchUrl', () => {
  const web = 'https://example.com/landing'

  it('keeps iOS app URLs untouched', () => {
    expect(buildAppLaunchUrl('whatsapp://channel/abc', web, UA.iosSafari, 'ios')).toBe('whatsapp://channel/abc')
  })

  it('adds a browser fallback to Android intents', () => {
    expect(buildAppLaunchUrl('intent://channel/abc#Intent;package=com.whatsapp;scheme=whatsapp;end', web, UA.androidChrome, 'android'))
      .toBe(`intent://channel/abc#Intent;package=com.whatsapp;scheme=whatsapp;S.browser_fallback_url=${encodeURIComponent(web)};end`)
  })

  it('converts custom schemes to intents for Opera GX', () => {
    expect(buildAppLaunchUrl('whatsapp://channel/a#b', web, UA.androidOperaGx, 'android'))
      .toBe(`intent://channel/a%23b#Intent;scheme=whatsapp;S.browser_fallback_url=${encodeURIComponent(web)};end`)
  })
})

describe('buildBrowserEscapeUrl', () => {
  const web = 'https://example.com/landing?a=1#top'

  it('uses Instagram and Threads external-browser schemes on iOS', () => {
    expect(buildBrowserEscapeUrl(web, 'ios', 'instagram')).toBe(`instagram://extbrowser/?url=${encodeURIComponent(web)}`)
    expect(buildBrowserEscapeUrl(web, 'ios', 'threads')).toBe(`barcelona://extbrowser/?url=${encodeURIComponent(web)}`)
  })

  it('opens Safari from other iOS webviews', () => {
    expect(buildBrowserEscapeUrl(web, 'ios', 'facebook')).toBe(`x-safari-${web}`)
    expect(buildBrowserEscapeUrl('http://example.com/', 'ios', 'webview')).toBe('x-safari-http://example.com/')
  })

  it('opens Chrome through an intent on Android', () => {
    expect(buildBrowserEscapeUrl(web, 'android', 'facebook'))
      .toBe(`intent://example.com/landing?a=1#Intent;scheme=https;action=android.intent.action.VIEW;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(web)};end`)
  })

  it('returns null where every escape is blocked', () => {
    expect(buildBrowserEscapeUrl(web, 'ios', 'tiktok')).toBeNull()
    expect(buildBrowserEscapeUrl(web, 'android', 'wechat')).toBeNull()
    expect(buildBrowserEscapeUrl(web, 'android', 'x')).toBeNull()
  })
})
