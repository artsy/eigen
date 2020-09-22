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

- EchoNew.json
  Maybe sometime end of 2020, we can change the file EchoNew.json back to Echo.json.

  Context: https://artsy.slack.com/archives/CDU4AH60Z/p1600737384008500?thread_ts=1600642583.000100&cid=CDU4AH60Z
  There was a case where echo returns 401 when a user asks for the latest echo options. This might be caused by some key misconfiguration, or it might not. Right now we have figured out that the app was storing broken Echo.json when the status was 401, and this caused the app to crash. As the simplest way to get around that we decided to rename the file, so in the next app update we would force all users to grab a new echo json file (this time named EchoNew.json). We have also added code to make sure we don't store broken echo json files locally anymore.

  After a few months we should be safe to return to the old name if we want. If we decide to do that, we should make sure to remove the old file that might have been sitting on users' phones.
