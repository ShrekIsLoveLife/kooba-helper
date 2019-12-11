
# kooba-helper v2019.12.10.5
For a better kooba<=>abook experience.


## Description:
* This adds search links to Abook forums code boxes that use [code] search strings.
* Search engines added are NZBIndex, BinSearch, NZBKing


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
1. Install TamperMonkey from your Browser's Add-on/Extension site
1. Visit https://shrekislovelife.github.io/kooba-helper/kooba-helper.user.js
1. Hit the Install button
1. Maybe give TamperMonkey permission for Incognito/Private browsing mode if you use that
1. To update, just visit the user.js page mentioned above and click the update button.


## Bookmarklet:
* This is not a recommended way to use this tool.
* If for some reason you don't want to install TamperMonkey, but still want some of the benefits of Kooba-Helper, it's available as a bookmarklet.
   * A bookmarklet is a link you can put in your bookmarks or bookmark bar that runs some code on a website when clicked.
   * Unfortunately, the bookmarklet will not run automatically, so you have to click it on every page view if you want to make use of it.
* You can get the bookmarklet at https://shrekislovelife.github.io/kooba-helper/bookmarklet.html by following the instructions on that page.
* The kooba-helper.user.js is the same source code as used in the bookmarklet.
  * You can regenerate the bookmarklet by pasting the code from the user.js in  https://shrekislovelife.github.io/audible-meta-bookmarklet/make_bookmarklet.html





## Changelog:
2019.12.10.5
* I've dropped support for the Browser Exclusive Extensions/Add-ons
* Please Install TamperMonkey Extension/Add-on and then install Kooba-Helper by visiting https://shrekislovelife.github.io/kooba-helper/kooba-helper.user.js
* This is a cross-browser solution that works great for a tool like this.
* The last repository to have the code for Chrome and Firefox Extensions is: https://github.com/ShrekIsLoveLife/kooba-helper/tree/48ac583fa44b8d79fa4dc69be9f784151428a864
* Since the Bookmarklet shares the same code and structure as the TamperMonkey Script, I will keep it updated for now.

2019.12.10.4
* Added TamperMonkey and Limited Firefox support

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

