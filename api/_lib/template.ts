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
      margin:0;
      padding: 0;
      border: 0;
      background: none;
    }
    
    html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

    body {
    font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
    Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  line-height: 1.1;
  font-size: 48px;
    position: relative;
    width: 880px;
    height: 460px;
    background: #161616;
    height: 100vh;
    color: white;
    }
    
    .title {
    position: absolute;
    inset: 100px;
    bottom: auto;
    fons-size: 112px;
    }
    
    .author-name {
    fons-size: 60px;
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
            <h1 class="title">
            ${emojify(marked(text))}
            </h1>
           
            <div>
              <div>
                <h4 class="author-name">${authorName}</h4>
                <p class="author-title">${authorTitle}</p>
              </div>
              <div>
                <img class="photo" src="${sanitizeHtml(authorPhoto)}"/>
              </div>
            </div>
            
            <footer>
              <p>blog.upstash.com</p>
            </footer>
            
    </body>
</html>`;
}
