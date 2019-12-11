# kooba-helper v2019.12.10.3
For a better kooba<=>abook experience.


## Description:
* This adds search links to Abook forums code boxes that use [code] search strings.
* Search engines added are NZBIndex, BinSearch, NZBKing
* It is for Chrome based browsers and their extensions ( Chrome, Chromium, Iron, Opera )
* A bookmarklet exists for non-compatible browsers.
  * I'll probably make a Firefox extension later if I get enough requests for it.


## Notice:
* This tool is not affiliated with the forum, other than the fact that it was written to be used on it. 
* It is an independent tool.
* If you run into any trouble, please contact me and do not contact the forum staff about it.



## Maintained/Created By:
* [Shrek]  BTC: 1ANyHwihu9dL2CZ9LUZ48FdYTzyz8CCCFf
* rhymesagainsthumanity
* Unknown
  * I don't know who originally created or contributed to this
  * If you contributed or originally created this let me know to add attribution


## Installation:
1. Download the 7-zip file from the [Release Section](https://github.com/ShrekIsLoveLife/kooba-helper/releases) on GitHub
1. Extract to your local machine using something like 7-Zip
1. Visit chrome://extensions in your browser (or open up the Chrome menu by clicking the icon to the far right of the Omnibox:  The menu's icon is three horizontal bars. and select Extensions under the Tools menu to get to the same place).
1. Ensure that the Developer mode checkbox in the top right-hand corner is checked.
1. Click Load unpacked extension… to pop up a file-selection dialog.
1. Navigate to the extracted zip file directory, and select it.
1. Ignore/Cancel anything saying you're in developer mode, etc. ( Opera and Iron nag you less )



Alternatively, you can drag and drop the extracted zip file director onto chrome://extensions in your browser to load it.

## Changelog:
2019.12.10.3
* Added bookmarklet, no extension change

2019.12.10.2
* Only processes on Book and Test sections

2019.12.10.1
**Since v1.9.1**
* Changed version convention to YYYY.MM.DD.#
* Upon page load, it processes code boxes, now it detours the thank function and processes when thanked is clicked
  * This done at intervals from 200 ms to 10 sec to account for lag, but most should be processed on the first 200ms process, but I have a few extra buffer times
  * I have to inject the src into the site instead of running in the Extension sandbox to expose it to the forum's thank functions to perform a detour
   * I could avoid injecting and using addEventListener, dispatchEvent, and sendMessage, but why complicate it.
* The actual processing code is wrapped in a function as well, so it can be called
* When it injects the search links, it also tags the codeheader with a class so it does not process the same code section multiple times
* I also adjusted kooba-search-links to be class based instead of id based
  * There can be multiple thank/hide buttons on a single page
* I changed the refer hider to blankrefer because it doesn't show a delayed page while it wants to show an ad or do w/e
* I also added a few more replaces in the searches and used regexp
* The searches now use a keyword replace of {query}
* Searches for PostBot style hide/code boxes
* Standardizes code sanitization of search string



##### Get the Kooba-Helper Bookmarklet (This should work cross-browser, but has a manual step)
[Click Here to get Bookmarklet](https://shrekislovelife.github.io/kooba-helper/bookmarklet.html "Click Here to get Bookmarklet")



##### Create Bookmarklet From JS Snippet
[Click Here to Make Bookmarklet](https://shrekislovelife.github.io/audible-meta-bookmarklet/make_bookmarklet.html "Click Here to Make Bookmarklet")

