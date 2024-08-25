
# BeReal Memories 📸
Export your BeReal memories with a simple UI. Built with [Next.js](https://nextjs.org/), [tRPC](https://trpc.io/) & [shadcn/ui](https://ui.shadcn.com/).

![Screenshot](https://r2.vasc.dev/images/5Afyl.png)
## Motivation
I wanted to have my BeReals in my own gallery, but the app doesn't allow to export BeReals in bulk. So I created this tool to make it easy to export my BeReals from time to time. It also embeds the BeReal date into the image's EXIF data so it's placed correctly next to other photos in your photo timeline.
## Features

- Automatic token refresh 🔃
- Export one or more days 📅
- Support for multiple BeReals 🤳
- BeReal date embedded in EXIF data ℹ️
- Shift multi-select ⌨️


## How To Use
This project is only meant to run locally on your own computer. The best way to do this is by using [Docker](https://www.docker.com/) or [Podman](http://podman.io/):

```bash
docker run -p 3000:3000 -e TZ=UTC ghcr.io/vascyt/bereal-memories:latest
```
> [!IMPORTANT]
> Make sure you set the TZ variable to your timezone, so the EXIF data is correct.

Then go to http://localhost:3000 in your browser.

Finally, you need to set your access & refresh token in the web ui, which are then stored in the local storage of your browser. This is currently required because I haven't implemented the authentication flow (yet). But this should only be necessary once, as the access token will be automatically refreshed when it expires, so please don't change them once they are set.