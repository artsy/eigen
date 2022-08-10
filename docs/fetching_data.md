## Fetching data

We use Relay for network requests.

Artsy's GraphQL server is Metaphysics.

## Tools

You can use [GraphiQL](https://github.com/graphql/graphiql) for checking out the requests to metaphysics.

<img width="1636" alt="Screen Shot 2022-05-24 at 17 17 37" src="https://user-images.githubusercontent.com/36475005/170071671-59d2cbd5-a957-414d-9f9b-4baa28dfff8a.png">
In order to set this up, pick the playground of choice (Graphiql, Postman, Insomnia, Altair, etc)

and add the following headers:  
Header name: `Authorization`
Header value: `Bearer **secret**`,

You can find **secret** in 1Password if you search for `Metaphysics INTROSPECT_TOKEN`.

<img width="1451" alt="Screen Shot 2022-07-19 at 18 45 57" src="https://user-images.githubusercontent.com/36475005/179805497-984b7004-5d94-4568-bfe5-37cf85a6cda7.png">
<img width="1451" alt="Screen Shot 2022-07-19 at 18 46 04" src="https://user-images.githubusercontent.com/36475005/179805521-d50aab59-f7b8-4f25-8eb7-3bab4593b72c.png">

## Example request

<img width="701" alt="Screen Shot 2022-05-24 at 18 33 10" src="https://user-images.githubusercontent.com/36475005/170086939-86194875-c866-4a71-a508-5fd356a35d32.png">

note that in some of the requests you may need to use something like `(first: $some-number-here)` (or last) but some requests work without it as well.

## Troubleshooting

If you get an anauthorized 401 error visit staging.artsy.net or artsy.net (depending on where you're requesting)
open the console and get the key that is returned from `sd.CURRENT_USER.accessToken` .
Update this value on `X-ACCESS-TOKEN` and try again.

<img width="521" alt="Screen Shot 2022-07-19 at 19 30 29" src="https://user-images.githubusercontent.com/36475005/179813023-c88432ea-cf28-4be0-bd31-99ad6e340eaf.png">
