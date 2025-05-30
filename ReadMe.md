The MIT License (MIT) Copyright © 2014

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# GitHub Pages Deployment

This project can be hosted as a static site on GitHub Pages directly from the root of the repository. No server dependencies are required.
## Testing Locally

Before you push to GitHub, you can preview the static site locally with any simple HTTP server. For example:

```bash
# From the project root, using Python 3:
python3 -m http.server 8000

# Or, using Node's http-server via npx:
npx http-server . -p 8000
```

Then open http://localhost:8000 in your browser.

## Steps to deploy

1. Make sure all external API calls and scripts use HTTPS (already configured).
2. Commit and push your `index.html`, `css/`, `js/`, `images/`, and `data/` directories to your repository root.
3. (Optional) To disable Jekyll processing on GitHub Pages, create an empty file named `.nojekyll` at the repository root:
   ```bash
   touch .nojekyll
   ```
4. In your GitHub repository, go to **Settings → Pages**, and under **Source**, select **Master branch** (or **main**) and **/ (root)**.
5. Save; GitHub will publish your site at `https://<username>.github.io/<repo-name>/` within a few minutes.

Your site is now live—enjoy!