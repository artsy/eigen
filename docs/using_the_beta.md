### Using the Emission Beta

Emission is a developer-focused application, so you'll note that it's very spartan in its design.

### So what is Emission?

The mobile team moved to a technology called React Native, which allows the mobile team to use similar tools and technologies on the web. This is awesome because it makes the whole team more cohesive, and we really enjoy writing apps this way.

To pull this off we have a separate place to keep new screens for pages on Artsy. This app Emission is where they are built, and then we move them into the Artsy iOS app when we think they're ready. Think of it as a staging environment for new screens.

The way we do this is by building lots of smaller blocks called Components. Think of how Artsy's design is consistent - we want to make a button look the same Artsy style on every page. So we make Components and we describe different ways in which these look as different states.

Inside the app we use something called Storybooks to showcase the components and the states. As a user, you can browse through the different storybooks to see how different components look in different states.

It's important to note here that Emission is a special app, an update to the beta _does not_ mean there are changes. You can dynamically change the code inside the app at any time. See below about the two main ways you can do that.

### The admin menu

_( Note: this section in particular will get out of date quickly, best use your best judgment - or poke someone to update this doc if there's something confusing missing. )_

The menu lets you do a few things:

- The first section is about your current settings: Production vs Staging, and what version of the app are you running.
- Storybooks Browser: Shows all of the Components, with their different states.
- Code Review: You can run the code from any active Pull Request, this lets you see work exactly as it's happening.
- View Controllers: Jump off points to specific parts of the app. These are used when we want to do final tests for integration with the Artsy iOS app.
