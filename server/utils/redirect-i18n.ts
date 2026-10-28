import type { H3Event } from 'h3'
import { parseAcceptLanguage } from 'intl-parse-accept-language'

interface RedirectTranslation {
  passwordTitle: string
  passwordLabel: string
  passwordPlaceholder: string
  passwordError: string
  continue: string
  unsafeTitle: string
  unsafeDesc: string
  goBack: string
  appOpening: string
  appOpeningDesc: string
  appOpenInApp: string
  appOpenInBrowser: string
  appContinueHere: string
  inAppTitle: string
  inAppDesc: string
  inAppTapMenu: string
  inAppChooseBrowser: string
}

const REDIRECT_LOCALES = [
  'de-DE',
  'en-US',
  'fr-FR',
  'id-ID',
  'it-IT',
  'pt-BR',
  'pt-PT',
  'vi-VN',
  'zh-CN',
  'zh-TW',
] as const

export type RedirectLocale = typeof REDIRECT_LOCALES[number]

const DEFAULT_REDIRECT_LOCALE = 'en-US' satisfies RedirectLocale
const REDIRECT_LOCALE_COOKIE = 'sink_i18n_redirected'

export const REDIRECT_TRANSLATIONS = {
  'de-DE': {
    passwordTitle: 'Passwort erforderlich',
    passwordLabel: 'Passwort',
    passwordPlaceholder: 'Passwort eingeben',
    passwordError: 'Falsches Passwort',
    continue: 'Weiter',
    unsafeTitle: 'Potenziell unsicherer Link',
    unsafeDesc: 'Dieser Link wurde als potenziell unsicher markiert. Gehen Sie mit Vorsicht vor.',
    goBack: 'Zurück',
    appOpening: 'App wird geöffnet …',
    appOpeningDesc: 'Falls sich die App nicht öffnet, verwenden Sie die Schaltflächen unten.',
    appOpenInApp: 'In der App öffnen',
    appOpenInBrowser: 'Im Browser öffnen',
    appContinueHere: 'Hier fortfahren',
    inAppTitle: 'Im Browser öffnen',
    inAppDesc: 'Dieser Link funktioniert am besten in Ihrem Browser.',
    inAppTapMenu: 'Tippen Sie oben auf die Schaltfläche ···',
    inAppChooseBrowser: 'und wählen Sie „Im Browser öffnen“.',
  },
  'en-US': {
    passwordTitle: 'Password Required',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    passwordError: 'Incorrect password',
    continue: 'Continue',
    unsafeTitle: 'Potentially Unsafe Link',
    unsafeDesc: 'This link has been flagged as potentially unsafe. Proceed with caution.',
    goBack: 'Go Back',
    appOpening: 'Opening the app…',
    appOpeningDesc: 'If the app doesn\'t open, use the buttons below.',
    appOpenInApp: 'Open in app',
    appOpenInBrowser: 'Open in browser',
    appContinueHere: 'Continue here',
    inAppTitle: 'Open in your browser',
    inAppDesc: 'This link works best in your browser.',
    inAppTapMenu: 'Tap the ··· button above',
    inAppChooseBrowser: 'and choose “Open in browser”.',
  },
  'fr-FR': {
    passwordTitle: 'Mot de passe requis',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: 'Entrez le mot de passe',
    passwordError: 'Mot de passe incorrect',
    continue: 'Continuer',
    unsafeTitle: 'Lien potentiellement dangereux',
    unsafeDesc: 'Ce lien a été signalé comme potentiellement dangereux. Procédez avec prudence.',
    goBack: 'Retour',
    appOpening: 'Ouverture de l\'application…',
    appOpeningDesc: 'Si l\'application ne s\'ouvre pas, utilisez les boutons ci-dessous.',
    appOpenInApp: 'Ouvrir dans l\'application',
    appOpenInBrowser: 'Ouvrir dans le navigateur',
    appContinueHere: 'Continuer ici',
    inAppTitle: 'Ouvrir dans votre navigateur',
    inAppDesc: 'Ce lien fonctionne mieux dans votre navigateur.',
    inAppTapMenu: 'Appuyez sur le bouton ··· ci-dessus',
    inAppChooseBrowser: 'puis choisissez « Ouvrir dans le navigateur ».',
  },
  'id-ID': {
    passwordTitle: 'Diperlukan Kata Sandi',
    passwordLabel: 'Kata Sandi',
    passwordPlaceholder: 'Masukkan kata sandi',
    passwordError: 'Kata sandi salah',
    continue: 'Lanjutkan',
    unsafeTitle: 'Tautan Berpotensi Tidak Aman',
    unsafeDesc: 'Tautan ini telah ditandai berpotensi tidak aman. Lanjutkan dengan hati-hati.',
    goBack: 'Kembali',
    appOpening: 'Membuka aplikasi…',
    appOpeningDesc: 'Jika aplikasi tidak terbuka, gunakan tombol di bawah.',
    appOpenInApp: 'Buka di aplikasi',
    appOpenInBrowser: 'Buka di browser',
    appContinueHere: 'Lanjutkan di sini',
    inAppTitle: 'Buka di browser Anda',
    inAppDesc: 'Tautan ini berfungsi paling baik di browser Anda.',
    inAppTapMenu: 'Ketuk tombol ··· di atas',
    inAppChooseBrowser: 'lalu pilih “Buka di browser”.',
  },
  'it-IT': {
    passwordTitle: 'Password richiesta',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Inserisci la password',
    passwordError: 'Password errata',
    continue: 'Continua',
    unsafeTitle: 'Link potenzialmente non sicuro',
    unsafeDesc: 'Questo link è stato contrassegnato come potenzialmente non sicuro. Procedi con cautela.',
    goBack: 'Indietro',
    appOpening: 'Apertura dell\'app…',
    appOpeningDesc: 'Se l\'app non si apre, usa i pulsanti qui sotto.',
    appOpenInApp: 'Apri nell\'app',
    appOpenInBrowser: 'Apri nel browser',
    appContinueHere: 'Continua qui',
    inAppTitle: 'Apri nel tuo browser',
    inAppDesc: 'Questo link funziona meglio nel tuo browser.',
    inAppTapMenu: 'Tocca il pulsante ··· in alto',
    inAppChooseBrowser: 'e scegli “Apri nel browser”.',
  },
  'pt-BR': {
    passwordTitle: 'Senha necessária',
    passwordLabel: 'Senha',
    passwordPlaceholder: 'Digite a senha',
    passwordError: 'Senha incorreta',
    continue: 'Continuar',
    unsafeTitle: 'Link potencialmente inseguro',
    unsafeDesc: 'Este link foi sinalizado como potencialmente inseguro. Prossiga com cuidado.',
    goBack: 'Voltar',
    appOpening: 'Abrindo o app…',
    appOpeningDesc: 'Se o app não abrir, use os botões abaixo.',
    appOpenInApp: 'Abrir no app',
    appOpenInBrowser: 'Abrir no navegador',
    appContinueHere: 'Continuar aqui',
    inAppTitle: 'Abrir no seu navegador',
    inAppDesc: 'Este link funciona melhor no seu navegador.',
    inAppTapMenu: 'Toque no botão ··· acima',
    inAppChooseBrowser: 'e escolha “Abrir no navegador”.',
  },
  'pt-PT': {
    passwordTitle: 'Palavra-passe necessária',
    passwordLabel: 'Palavra-passe',
    passwordPlaceholder: 'Introduza a palavra-passe',
    passwordError: 'Palavra-passe incorreta',
    continue: 'Continuar',
    unsafeTitle: 'Ligação potencialmente insegura',
    unsafeDesc: 'Esta ligação foi assinalada como potencialmente insegura. Prossiga com cuidado.',
    goBack: 'Voltar',
    appOpening: 'A abrir a aplicação…',
    appOpeningDesc: 'Se a aplicação não abrir, utilize os botões abaixo.',
    appOpenInApp: 'Abrir na aplicação',
    appOpenInBrowser: 'Abrir no navegador',
    appContinueHere: 'Continuar aqui',
    inAppTitle: 'Abrir no seu navegador',
    inAppDesc: 'Esta ligação funciona melhor no seu navegador.',
    inAppTapMenu: 'Toque no botão ··· acima',
    inAppChooseBrowser: 'e escolha “Abrir no navegador”.',
  },
  'vi-VN': {
    passwordTitle: 'Yêu cầu mật khẩu',
    passwordLabel: 'Mật khẩu',
    passwordPlaceholder: 'Nhập mật khẩu',
    passwordError: 'Mật khẩu không đúng',
    continue: 'Tiếp tục',
    unsafeTitle: 'Liên kết có thể không an toàn',
    unsafeDesc: 'Liên kết này đã bị đánh dấu là có thể không an toàn. Hãy thận trọng khi tiếp tục.',
    goBack: 'Quay lại',
    appOpening: 'Đang mở ứng dụng…',
    appOpeningDesc: 'Nếu ứng dụng không mở, hãy dùng các nút bên dưới.',
    appOpenInApp: 'Mở trong ứng dụng',
    appOpenInBrowser: 'Mở trong trình duyệt',
    appContinueHere: 'Tiếp tục tại đây',
    inAppTitle: 'Mở trong trình duyệt của bạn',
    inAppDesc: 'Liên kết này hoạt động tốt nhất trong trình duyệt của bạn.',
    inAppTapMenu: 'Nhấn nút ··· ở trên',
    inAppChooseBrowser: 'rồi chọn “Mở trong trình duyệt”.',
  },
  'zh-CN': {
    passwordTitle: '需要密码',
    passwordLabel: '密码',
    passwordPlaceholder: '请输入密码',
    passwordError: '密码错误',
    continue: '继续',
    unsafeTitle: '潜在不安全链接',
    unsafeDesc: '此链接已被标记为潜在不安全。请谨慎访问。',
    goBack: '返回',
    appOpening: '正在打开应用…',
    appOpeningDesc: '如果应用没有打开，请使用下方按钮。',
    appOpenInApp: '在应用中打开',
    appOpenInBrowser: '在浏览器中打开',
    appContinueHere: '在此继续',
    inAppTitle: '在浏览器中打开',
    inAppDesc: '此链接在浏览器中体验最佳。',
    inAppTapMenu: '点击右上角的 ··· 按钮',
    inAppChooseBrowser: '然后选择“在浏览器中打开”。',
  },
  'zh-TW': {
    passwordTitle: '需要密碼',
    passwordLabel: '密碼',
    passwordPlaceholder: '請輸入密碼',
    passwordError: '密碼錯誤',
    continue: '繼續',
    unsafeTitle: '潛在不安全連結',
    unsafeDesc: '此連結已被標記為潛在不安全。請謹慎訪問。',
    goBack: '返回',
    appOpening: '正在開啟應用程式…',
    appOpeningDesc: '如果應用程式沒有開啟，請使用下方按鈕。',
    appOpenInApp: '在應用程式中開啟',
    appOpenInBrowser: '在瀏覽器中開啟',
    appContinueHere: '在此繼續',
    inAppTitle: '在瀏覽器中開啟',
    inAppDesc: '此連結在瀏覽器中體驗最佳。',
    inAppTapMenu: '點擊右上角的 ··· 按鈕',
    inAppChooseBrowser: '然後選擇「在瀏覽器中開啟」。',
  },
} as const satisfies Record<RedirectLocale, RedirectTranslation>

const SUPPORTED_LOCALES = [...REDIRECT_LOCALES]

const LOCALE_ALIASES: Record<string, RedirectLocale> = {
  'de': 'de-DE',
  'en': 'en-US',
  'fr': 'fr-FR',
  'id': 'id-ID',
  'it': 'it-IT',
  'pt': 'pt-BR',
  'vi': 'vi-VN',
  'zh': 'zh-CN',
  'zh-Hans': 'zh-CN',
  'zh-Hant': 'zh-TW',
  'zh-HK': 'zh-TW',
  'zh-MO': 'zh-TW',
}

function normalizeLocaleCode(code: string): string {
  const normalized = code.replace('_', '-')
  try {
    return Intl.getCanonicalLocales(normalized)[0] || ''
  }
  catch {
    return ''
  }
}

function resolveLocaleCode(code: string | undefined): RedirectLocale | undefined {
  if (!code)
    return undefined

  const normalized = normalizeLocaleCode(code)
  if (!normalized)
    return undefined

  if (SUPPORTED_LOCALES.includes(normalized as RedirectLocale))
    return normalized as RedirectLocale

  const alias = LOCALE_ALIASES[normalized]
  if (alias)
    return alias

  const prefix = normalized.split('-')[0]
  return prefix ? LOCALE_ALIASES[prefix] : undefined
}

export function resolveRedirectLocale(event: H3Event): RedirectLocale {
  const cookieLocale = resolveLocaleCode(getCookie(event, REDIRECT_LOCALE_COOKIE))
  if (cookieLocale)
    return cookieLocale

  const header = getHeader(event, 'accept-language')
  if (!header)
    return DEFAULT_REDIRECT_LOCALE

  for (const code of parseAcceptLanguage(header)) {
    const locale = resolveLocaleCode(code)
    if (locale)
      return locale
  }

  return DEFAULT_REDIRECT_LOCALE
}
