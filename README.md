# shortflix-web

桃子无限科技有限公司官网，静态页面。

推送到 `master` 后，GitHub Actions 把页面上传到服务器，再执行 `/usr/local/sbin/shortflix-release-web`，切换 `/opt/shortflix/web/dist`。用的密钥和 CMS 相同：`ECS_SSH_KEY`、`ECS_KNOWN_HOSTS`、`ECS_HOST`、`ECS_PORT`、`ECS_USER`。

服务器上要先放好发布脚本和 sudoers，见 `deploy/release.sh`、`deploy/shortflix-web.sudoers`。

备案号下来之后，改各页页脚的 `.icp`。
