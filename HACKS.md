<!-- Template

- Title
Tell us when we can remove this hack.

Explain why the hack was added.

 -->

- "cheerio" resolution
  Remove after `enzyme` is removed.

  This is an existing resolution at the creation of HACKS.md. For what I gathered, it is required by enzyme. It requires ~1.0.0, but we need 0.22.0.
  We use it in `renderToString` which takes something like `<Image />` and gives us `<image />`. Using 0.22.0 that works, but when enzyme uses ~1.0.0 it gives `<img />`, which breaks tests.
  Using enzyme we created `renderUntil`. To replace that, we probably need @testing-library/react or something to replace it. Then we can remove enzyme and cheerio resolution as well.
