# Botanist
Slack bot for goofs.

## Command List
| Command | Arguments | Description |
|---|---|---|
\urban | string | Searches the given string on urban dictionary and returns the definition. If no arguments are present, a random definition is returned.
\xkcd | none | Retrieves the latest comic from http://xkcd.com/

## Getting Started
1. Install [NodeJS](https://nodejs.org/en/) version 6.5.0 or higher. NodeJS comes with a bundled package manager called npm (Node Package Manager).
2. Navigate to the root project directory containing the `package.json` file with your terminal. [What is a package.json?](https://docs.nodejitsu.com/articles/getting-started/npm/what-is-the-file-package-json/)
3. Since project dependencies are not committed with the code, install them using the following npm command `npm install`. This will look at the `package.json` and download all the libraries in the `dependencies` block.
4. In the `package.json`, there's a block named `scripts`. This block are commands ran with npm to facilitate building and running the app. In the root project directory, run the command `npm run startdev` or `npm run startdevl` on linux to build and run the app.
5. In your browser, go to http://localhost/ to see the server in action!

If you ever run the app and you see the error `Error: Cannot find module 'name of module'` run the command `npm install` again. It means someone has added new dependencies.
