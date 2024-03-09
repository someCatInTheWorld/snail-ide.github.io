/* Code from https://github.com/Snail-IDE/Snail-IDE-ObjectLibraries under the MIT license:
MIT License

Copyright (c) 2023 PenguinMod

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECT
*/

const emojiHtmlUrl = 'https://corsproxy.io/?https://snail-ide-object-libraries.vercel.app/files/emojis';

const response = await fetch(emojiHtmlUrl);
const htmle = await response.text();
const emojis = htmle
    .substring(htmle.indexOf('</header><ul id=files>') + 22, htmle.indexOf('</ul></main>'))
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0) // remove blank lines
    .filter(line => line.endsWith('.png</a>')) // remove .txt file
    .map(emoji => {
        const cut = emoji.substring(22);
        const final = cut.substring(cut.indexOf('>') + 1, cut.indexOf('.png</a>'))
        return final;
    });

export default emojis;