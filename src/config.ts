import IconMail from "@/assets/icons/IconMail.svg";
import IconZhihu from "@/assets/icons/IconZhihu.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";

export const SITE = {
  author: "Fuxi",
  favicon: "/favicon.png",
  header_width: "5xl",  // 3xl, 4xl(56rem), 5xl(64rem), 6xl(72rem), or 7xl
  page_width: "5xl",
  navs: [
    { key: "nav.moments", href: "moments" },
    { key: "nav.posts", href: "posts" },
    // { key: "nav.archives", href: "archives" },
    { key: "nav.friends", href: "friends" },
    { key: "nav.about", href: "about" },
  ],
  socials: [
    {
      name: "Mail",
      href: "mailto:1538130391@qq.com",
      key: "social.mail",
      icon: IconMail,
    },
    {
      name: "Zhihu",
      href: "https://www.zhihu.com/people/ju-jiu-31-72/posts",
      key: "social.zhihu",
      icon: IconZhihu,
    },
    {
      name: "GitHub",
      href: "https://github.com/fux-i",
      key: "social.github",
      icon: IconGitHub,
    },
  ],
} as const;
