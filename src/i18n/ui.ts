

export const languages = {
  en: 'English',
  zh: '中文',
} as const;

export const defaultLang = 'en' as const;

export type Lang = keyof typeof languages;

export const ui = {
  en: {
    'site.title': "Fuxi's Blog",
    'site.title_suffix': " | Fuxi's Blog",
    'nav.moments': 'Moments',
    'nav.posts': 'Posts',
    'nav.archives': 'Archives',
    'nav.friends': 'Friends',
    'nav.about': 'About',
    'btn.search': 'Search',
    'btn.theme': 'Theme toggle',
    'btn.follow_system': 'Follow system theme',
    'btn.lang_switch': '切换到中文',
    'social.mail': 'Send an email to Fuxi',
    'social.zhihu': 'Fuxi on Zhihu',
    'social.github': 'Fuxi on GitHub',
  },
  zh: {
    'site.title': '伏羲的博客',
    'site.title_suffix': ' | 伏羲的博客',
    'nav.moments': '动态',
    'nav.posts': '文章',
    'nav.archives': '归档',
    'nav.friends': '友链',
    'nav.about': '关于',
    'btn.search': '搜索',
    'btn.theme': '主题切换',
    'btn.follow_system': '跟随系统主题',
    'btn.lang_switch': 'Switch to English',
    'social.mail': '给伏羲发邮件',
    'social.zhihu': '知乎',
    'social.github': 'GitHub',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)[typeof defaultLang];

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function getT(currentLocale: string | undefined) {
  const lang = (currentLocale ?? defaultLang) as Lang;
  return { lang, t: useTranslations(lang) };
}
