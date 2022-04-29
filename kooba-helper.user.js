// ==UserScript==
// @name kooba-helper
// @namespace    kooba-helper@shrek
// @description For a better kooba<=>abook experience. This adds search links to Abook forums code boxes.
// @author Shrek, rhymesagainsthumanity, pushr (original creator)
// @version 2022.04.29.2
// @updateURL https://shrekislovelife.github.io/kooba-helper/kooba-helper.meta.js
// @downloadURL https://shrekislovelife.github.io/kooba-helper/kooba-helper.user.js
// @supportURL https://abook.link/book/index.php?topic=54768
// @include *://abook.link/*
// @match *://abook.link/*
// @run-at document-end
// @grant none
// ==/UserScript==


function sanatize_common(code) {
  code = code.replace(/(?:abook|kooba)\.*(?:to|link|ws)*\s*(?:-|\||~)*\s*/gi, '');
  code = code.replace(/['"]+/g, '');
  code = code.replace(/\\&+/g, ' ');
  return code.trim();
}

const indexers = [
  {
    name: 'NZBIndex',
    url: 'https://DoNotRefer.Me/#https://nzbindex.com/search?max=25&minage=&maxage=&hidespam=1&hidepassword=0&sort=agedesc&minsize=&maxsize=&complete=0&hidecross=0&hasNFO=0&poster=&q={query}',
    codeFn: function(code) {
      return sanatize_common(code);
    }
  },
  {
    name: 'BinSearch',
    url: 'https://DoNotRefer.Me/#https://www.binsearch.info/?max=1000&&adv_age=&adv_sort=date&server=2&&q={query}',
    codeFn: function(code) {
      return sanatize_common(code);
    }
  },
  {
    name: 'BinSearch-Abook',
    url: 'https://DoNotRefer.Me/#https://www.binsearch.info/?max=100&adv_g=alt.binaries.mp3.abooks&adv_age=&adv_sort=date&q={query}',
    codeFn: function(code) {
      return sanatize_common(code);
    }
  },
  {
    name: 'NZBKing',
    url: 'https://DoNotRefer.Me/#http://nzbking.com/search/?q=%22{query}%22',
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

      var page_author = document.querySelector('#author');
      var page_title = page_author.nextSibling.textContent.match(/Topic:(.*?)(?:\(Read)/i)[1].replace(/\[spot\]/gi,'').trim();

      var iObjCopyTitle = document.createElement('a');
      iObjCopyTitle.id = 'kooba-title-copy2';
      iObjCopyTitle.classList.add('kooba-title-copy2');
      iObjCopyTitle.dataset.cipboard = page_title;
      iObjCopyTitle.title = 'Copy "' + page_title + '" to clipboard';
      iObjCopyTitle.innerHTML = ` [Copy Title]`;
      iObjCopyTitle.addEventListener('click', function(e) {
          kooba_copy_clipboard_data(e.target);
      });

      const content = `
        <div class="kooba-search-links">
          <span>Search:</span>
          <ul>${buildLinks(code)}</ul>
        </div>
      `;
      header.classList.add('kooba_crunched'); // add tracking class
      header.insertAdjacentHTML('beforeend', content);
      header.insertAdjacentElement("beforeend", iObjCopyTitle);
    });
  }
}

function inject_kooba_style() {
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

.kooba-title-copy {
    color: #57aad2;
}
.kooba-title-copy:hover {
    text-decoration: underline;
}

.kooba-title-copy2 {
    margin-left: 30px;
    color: #9383e0;
    font-weight: normal;
}
.kooba-title-copy2:hover {
    text-decoration: underline;
}
</style>
`;
}

window['kooba_copy_clipboard_str'] = str => {
	const el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
  };


window['kooba_copy_clipboard_data'] = function kooba_copy_clipboard_data(obj) {
	kooba_copy_clipboard_str(obj.dataset.cipboard);

	var iDiv3 = document.createElement('div');
	iDiv3.className = 'copied_to_clipboard';
	iDiv3.style.border = '1px solid red';
	iDiv3.style.backgroundColor = 'red';
	iDiv3.style.color = 'yellow';
	iDiv3.style.textAlign = 'center';
	iDiv3.style.display = 'inline-block';
	iDiv3.style.position = 'absolute';
	iDiv3.style.marginLeft = '10px';
	// iDiv3.style.width = obj.offsetWidth + 'px';
	iDiv3.innerHTML = 'text copied to clipboard';
	kooba_insert_after(iDiv3, obj);
	setTimeout(function() {
	  var elements = document.getElementsByClassName('copied_to_clipboard');
	  while(elements.length > 0){ elements[0].parentNode.removeChild(elements[0]); }
	 }, 2000);
  }

window['kooba_insert_after'] = function kooba_insert_after(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

window['inject_kooba_title_copy'] = function inject_kooba_title_copy() {
    if ( document.querySelector('#kooba-title-copy') === null ) {
        // var page_title = document.querySelector('title').text.match(/Book Club - (.*)/i)[1].trim();
        var page_author = document.querySelector('#author');
        var page_title = page_author.nextSibling.textContent.match(/Topic:(.*?)(?:\(Read)/i)[1].replace(/\[spot\]/gi,'').trim();

        var iObjCopyTitle = document.createElement('a');
        iObjCopyTitle.classList.add('kooba-title-copy');
        iObjCopyTitle.id = 'kooba-title-copy';
        iObjCopyTitle.dataset.cipboard = page_title;
        iObjCopyTitle.title = 'Copy "' + page_title + '" to clipboard';
        iObjCopyTitle.innerHTML = ` [Copy]`;
        iObjCopyTitle.addEventListener('click', function(e) {
            kooba_copy_clipboard_data(e.target);
        });
        kooba_insert_after(iObjCopyTitle, page_author.nextSibling);
    }
}

if ((
      document.querySelector('a[href="https://abook.link/book/index.php#c3"]')
    || document.querySelector('a[href="https://abook.link/book/index.php?board=18.0"]')
    )) {
    inject_kooba_title_copy();
	inject_kooba_style();
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
