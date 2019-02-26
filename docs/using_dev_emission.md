## Using Emission via `yarn start` in Emission

When trying to work on some more complex interactions between Emission and Eigen, it can help
to skip the Emission release setup in favour of having Eigen talk to the React Native server.

You enable this by hitting <kbd>cmd</kbd> + <kbd>alt</kbd> + <kbd>z</kbd> to bring up the Eigen
admin panel. In here is an option "Use local Emission packager" - select this. What this option
does is change the path for Emissions' JS from a statically compiled file (which gets shipped with
the app) to `http://localhost:8081/Example/Emission/index.ios.bundle?platform=ios&dev=true`

This kills the app, open Eigen back up and you should see the green status bar indicating it's compiling
some Emission dynamically.

Because both Eigen and React Native use the shake gesture, the React Native shake gesture is disabled
but you can trigger it via the Eigen admin menu. 
