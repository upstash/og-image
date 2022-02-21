import { readFileSync } from "fs";
import { marked } from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";

const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const regular = readFileSync(
  `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString("base64");

const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
  "base64"
);

function getCss() {
  return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${regular}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    * {
  box-sizing: border-box;
  border: 0;
  margin: 0;
  padding: 0;
  background: none;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  display: block;
}

body {
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
  line-height: 1.14;
  font-size: 48px;
  position: relative;
  background: #161616 url(https://upstash-og-image.vercel.app/bg.png) no-repeat;
  background-size: cover;
  background-position: center;
  height: 100vh;
  color: white;
}

header {
  position: absolute;
  inset: 88px 100px auto;
}

.title {
  font-size: 112px;
}

.author {
  position: absolute;
  inset: auto 100px 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.author-name {
  font-size: 56px;
  margin-bottom: 10px;
  color: #00e9a3;
}

.author-photo {
  border: 8px solid #00e9a3;
  border-radius: 100%;
}

.author-photo img {
  font-size: 220px;
  width: 1em;
  height: 1em;
  border-radius: 100%;
  object-fit: cover;
  object-position: center;
  border: 12px solid #161616;
}

footer {
  position: absolute;
  inset: auto 80px 0;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  color: #666;
  border-radius: 80px 80px 0 0;
}
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, authorName, authorPhoto, authorTitle } = parsedReq;

  console.log(text, authorName, authorPhoto, authorTitle);

  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss()}
    </style>
    <body>
    
<header>
  <h1 class="title">
    ${emojify(marked(text))}
  </h1>
</header>

<div class="author">
  <div>
    <h4 class="author-name">${authorName}</h4>
    <p class="author-title">${authorTitle}</p>
  </div>
  ${
    authorPhoto
      ? `<div class="author-photo">
    <img src="${sanitizeHtml(authorPhoto)}" />
  </div>`
      : ""
  }
</div>

<footer>
  <p>blog.upstash.com</p>
</footer>

</body>
</html>`;
}
