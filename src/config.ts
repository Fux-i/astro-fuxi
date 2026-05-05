import IconMail from "@/assets/icons/IconMail.svg";
import IconZhihu from "@/assets/icons/IconZhihu.svg"
import IconGitHub from "@/assets/icons/IconGitHub.svg";

export const SITE = {
  title_suffix: " | Fuxi's blog",
  navs: [
    { label: "Moments", href: "/moments" },
    { label: "Posts", href: "/posts" },
    { label: "Archives", href: "/archives" },
    { label: "Friends", href: "/friends" },
    { label: "About", href: "/about" },
  ],
  socials: [
    {
      name: "Mail",
      href: "mailto:1538130391@qq.com",
      linkTitle: `Send an email to Fuxi`,
      icon: IconMail,
    }, {
      name: "Zhihu",
      href: "https://www.zhihu.com/people/ju-jiu-31-72/posts",
      linkTitle: `Fuxi on Zhihu`,
      icon: IconZhihu,
    },
    {
      name: "GitHub",
      href: "https://github.com/fux-i",
      linkTitle: `Fuxi on GitHub`,
      icon: IconGitHub,
    },
  ]
}
