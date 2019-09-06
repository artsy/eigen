### Updating Emission steps

## Update Eigen with the most recent version of Emission

- Ship a [new Emission release](https://github.com/artsy/emission#deploying-emission)
- Once Emission has finished building in CI, rebase master and switch to a new branch. Then update Eigen's `Podfile.lock` via `bundle exec pod update Emission`, you will see a diff with the new version in `Podfile.lock`.
- Commit your changes and merge a self assigned PR in Eigen with the updated Emission changes. 
- Once that PR has merged, switch to your master branch, rebase, and then run `make deploy`. This will create a new version of Eigen with the updated Emission package.

## Get Emission's to compile

If it doesn't compile out-right:

- If the error exists inside React: look into what post-install hooks run inside the Emission repo.

  E.g. inside [package.json](https://github.com/artsy/emission/blob/master/package.json), [scripts/post\_\*.sh](https://github.com/artsy/emission/tree/master/scripts) and the example [app's Podfile](https://github.com/artsy/emission/blob/master/Example/Podfile). They may need to be applied here.

- If the error exists inside Emission: Look at the Emission test app [AppDelegate](https://github.com/artsy/emission/blob/master/Example/Emission/AppDelegate.m) to see how all of the
  available functions are wired up.

## Get Emission runtime

Does it crash on launch?

- Sometimes the simulator will crash after you've run unit tests in it. Uninstall the app from the simulator to fix the crash.
- Might need to add new settings to [the `AREmissionConfiguration` object](https://github.com/artsy/emission/blob/master/Pod/Classes/Core/AREmission.h) in Eigen's side. Ideally these should get raised by compiler warnings, but you never know.
- A native module may have new exposed callbacks which are required to be set up on launch.
