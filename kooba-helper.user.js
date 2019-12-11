// ==UserScript==
// @name kooba-helper
// @namespace    kooba-helper@shrek
// @description For a better kooba<=>abook experience. This adds search links to Abook forums code boxes.
// @author Shrek, rhymesagainsthumanity, pushr (original creator)
// @version 2019.12.11.5
// @updateURL https://shrekislovelife.github.io/kooba-helper/kooba-helper.meta.js
// @downloadURL https://shrekislovelife.github.io/kooba-helper/kooba-helper.user.js
// @supportURL https://abook.link/book/index.php?topic=54768
// @include *://abook.link/*
// @match *://abook.link/*
// @run-at document-end
// @grant none
// ==/UserScript==


document.querySelector('head').innerHTML += `
<style>

.kooba-search-links,
.kooba-search-links span,
.kooba-search-links ul,
.kooba-search-links li {
  display: inline-block;
}

.kooba-search-links span {
  margin-left: .5em;
}

.kooba-search-links ul {
  list-style: none;
  margin: 0;
  padding-left: 0;
}

.kooba-search-links li {
  margin: 0;
  padding: 0;
}

.kooba-search-links li:not(:last-child):after {
  color: #ccc;
  content:'|';
}

.kooba-search-links a {
  margin: 0;
  padding: 0 .5em;
}
</style>
`;

function sanatize_common(code) {
  code = code.replace(/(?:abook|kooba)\.*(?:to|link|ws)*\s*(?:-|\||~)*\s*/gi, '');
  code = code.replace(/['"]+/g, '');
  code = code.replace(/\\&+/g, ' ');
  return code.trim();
}

const indexers = [
  {
    name: 'NZBIndex',
    url: 'http://blankrefer.com/?https://nzbindex.com/search?max=25&minage=&maxage=&hidespam=1&hidepassword=0&sort=agedesc&minsize=&maxsize=&complete=0&hidecross=0&g[]=363&hasNFO=0&poster=&q={query}',
    codeFn: function(code) {
      return sanatize_common(code);
    }
  },
  {
    name: 'BinSearch',
    url: 'http://blankrefer.com/?https://www.binsearch.info/?max=100&adv_g=alt.binaries.mp3.abooks&adv_age=&adv_sort=date&q={query}',
    codeFn: function(code) {
      return sanatize_common(code);
    }
  },
  {
    name: 'NZBKing',
    url: 'http://blankrefer.com/?http://nzbking.com/search/?q=%22{query}%22',
    codeFn: function(code) {
      return sanatize_common(code);
    }
  }
];

function buildLinks(code){
  console.log("Build: ", code);
  let list = '';
  indexers.forEach(function (index) {
    console.log("IC: ", index.codeFn(code));
    const link = index.url.replace(/{query}/g, encodeURIComponent(index.codeFn(code)));

    list += `
      <li>
        <a rel="noreferrer" rel="noopener" target="_blank" href="${link}">
          ${index.name}
        </a>
      </li>
    `;
  });

  return list;
}

function checkHeader(header){
  // Check if any of the previous 5 siblings contain sting of "password"
  let heading = header.previousSibling;
  let i = 0;
  while (heading && i < 5) {
    i++;
    if (heading.textContent.toLowerCase().includes('password')) return true;
    heading = heading.previousSibling;
  }

  return false;
}

function checkCode(code){
  // Check if code itself contains string of "password"
  return code.toLowerCase().includes('password');
}

function process_kooba_search() {
  console.log('Process Kooba');
  const headers = document.querySelectorAll('.codeheader');
  if (headers){
    headers.forEach(function (header) {
      // Skip if already processed
      if ( header.classList.contains('kooba_crunched') ) return;

      if (header.nextSibling.nodeName.toUpperCase() == 'BR') {
        console.log('PostBot Style');
        var code = header.nextSibling.nextSibling.textContent;
      } else {
        console.log('New Style');
        var code = header.nextSibling.textContent;
      }
      console.log('Code: ', code);

      // Skip if code is a password
      if (checkHeader(header) || checkCode(code)) {
        console.log('Skipped');
        header.classList.add('kooba_crunched');
        return;
      }

      const content = `
        <div class="kooba-search-links">
          <span>Search:</span>
          <ul>${buildLinks(code)}</ul>
        </div>
      `;
      header.classList.add('kooba_crunched'); // add tracking class
      header.insertAdjacentHTML('beforeend', content);
    });
  }
}


if ((
      document.querySelector('a[href="https://abook.link/book/index.php#c3"]')
    || document.querySelector('a[href="https://abook.link/book/index.php?board=18.0"]')
    )) {
  process_kooba_search();
  console.log('Injecting Detour of Thank Function');
  // detour the original thank you click action
  window['orig_saythanks_handleThankClick'] = saythanks.prototype.handleThankClick;
  saythanks.prototype.handleThankClick = function (oInput) {
      console.log('Thank Detected'); // output to console that we intercepted the thank
      window['orig_saythanks_handleThankClick'](oInput); // call original thank action
      setTimeout(process_kooba_search, 200); // look for search boxes
      setTimeout(process_kooba_search, 1000); // it should catch after 200 ms but
      setTimeout(process_kooba_search, 2000); // here are a few more intervals to
      setTimeout(process_kooba_search, 5000); // keep trying, because it can't hurt,
      setTimeout(process_kooba_search, 10000); //  since we track injection now
  }
}
