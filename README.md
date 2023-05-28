** Link
https://auto-doc-kbqj.vercel.app/

** Explanation

The purpopse of this website is to automatically add TSDoc and JSDoc comments to entire repositories. While it is preferred that you write comments as you go, this often does not happen. Thise website is especially useful for legacy code you didn't write, but still have to use.

It uses chatGPT's 3.5 API to achieve this. GPT 4 would be better but its costs are great.

** 
Right now there are a few bugs and features that need to be expanded on.
- If you choose to use a github repository in JS, the retry button will retry that code but send it has TS. Easy fix, just haven't worked on this for a while.
- Styling isn't perfect either.
- It hasn't been setup with OAUTH for private repositories properly just yet, and there may be issues when pushing to a new GitHub branch because of this
- Also problems arise if you use JS for some files, then try to use TS after it. Caching error or redux-persist error.
