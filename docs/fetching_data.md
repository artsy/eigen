## Fetching data

We use Relay for network requests.

Artsy's GraphQL server is Metaphysics.

## Tools

You can use [GraphiQL](https://github.com/graphql/graphiql) for checking out the requests to metaphysics.

<img width="1636" alt="Screen Shot 2022-05-24 at 17 17 37" src="https://user-images.githubusercontent.com/36475005/170071671-59d2cbd5-a957-414d-9f9b-4baa28dfff8a.png">
In order to set this up in your playground of choice (Graphiql, Postman, Insomnia, Altair, etc), you need to send the following header: `Authorization: Bearer <secret>`,
and replace `<secret>` with the value of `Metaphysics INTROSPECT_TOKEN` in 1Password.

## Example request

<img width="701" alt="Screen Shot 2022-05-24 at 18 33 10" src="https://user-images.githubusercontent.com/36475005/170086939-86194875-c866-4a71-a508-5fd356a35d32.png">

note that in some of the requests you may need to use something like `(first: $some-number-here)` (or last) but some requests work without it as well.
