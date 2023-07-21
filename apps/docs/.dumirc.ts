import { defineConfig } from 'dumi';
import { defineThemeConfig } from 'dumi-theme-chakra';

function withPrefix(uri?: string): string {
  const prefix =
    process.env.NODE_ENV === 'production' ? '/dumi-theme-chakra/' : '/';
  return [prefix, uri].join('');
}

export default defineConfig({
  base: withPrefix(),
  publicPath: withPrefix(),
  locales: [
    { id: 'zh-CN', name: '中文' },
    { id: 'en-US', name: 'English' },
  ],
  themeConfig: {
    name: '劢微产品手册',
    logo: withPrefix('logo.png'),
    nav: {
      'zh-CN': [
        { title: '指南', link: '/guide' },
        { title: '常见问题', link: '/faq' },
      ],
      'en-US': [
        { title: 'Guide', link: '/en-US/guide' },
        { title: 'FAQ', link: '/en-US/faq' },
      ],
    },
    ...defineThemeConfig({
      thumbBackground: true,
      search: true,
      hero: {
        showVersionBadge: true,
      },
    }),
    footer: `Copyright © ${new Date().getFullYear()} 劢微机器人科技（深圳）有限公司`,
  },
});
