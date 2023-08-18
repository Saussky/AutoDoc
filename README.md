## AutoDoc
Add JS or TSDoc function comments to entire repositories on Github through the use of Github & chatGPT's API.
Intended use is for legacy code. I do not recommend not writing any comments and leaving it up to AI to do later.

** Link

here's a demo link showing how it works, with some errors :)
https://youtu.be/tXiv9Zf4p0Y


** Known Bugs
Right now there are a few bugs and features that need to be expanded on.
- API call can take a long time as it has to download Github file then send it through the chatGPT API. If there's a lot of files this takes too long. Will introduce background workers to load them to the user one by one.
- If you choose to use a github repository in JS, the retry button will retry that code but send it has TS. Easy fix, just haven't worked on this for a while.
- Yet to do any error handling
- Styling needs work
- It hasn't been setup with OAUTH for private repositories properly just yet, and there may be issues when pushing to a new GitHub branch because of this
- Also problems arise if you use JS for some files, then try to use TS after it. Caching error or redux-persist error.

