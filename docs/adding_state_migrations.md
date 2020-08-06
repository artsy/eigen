# Adding State Migrations

## Do I need to add a state migration?

When the app launches we do something like

    initialAppState = merge(blankAppState, loadSavedStateFromDeviceStorage())

It is possible to make a code change that would cause this step to produce a corrupt `initialAppState` the next time the user updates their app. To mitigate this we add in a `migrate` step so that old versions of the app state can be brought up-to-date before merging.

    initialAppState = merge(blankAppState, migrate(loadSavedStateFromDeviceStorage()))

When we make a change to the app store which could affect what is stored on disk, we need to create a new migration.

The following kinds of change do _not_ require creating a new migration:

- Modifying anything which is only stored within a `sessionState` portion of the app store.
- Adding or removing a new `sessionState` object.
- Modifying, adding or removing a [computed](https://easy-peasy.now.sh/docs/api/computed.html) property.

If you're still unsure whether your change requires a new migration, please reach out to a one of the repository code owners! 🙏

## How to add a new state migration

1. Navigate to `migration.ts`.
2. Increment `CURRENT_APP_VERSION`.

   ```diff
   -const CURRENT_APP_VERSION = 41
   +const CURRENT_APP_VERSION = 42
   ```

3. Add a new migration in the `migrations` object.

   e.g. to rename a property from `oldName` to `newName`

   ```diff
    const migrations = {
   +   [42]: state => {
   +      state.myModule.newName = state.myModule.oldName
   +      delete state.myModule.oldName
   +   }
    }
   ```

4. Test your migration in `migration-tests.ts`.

   ```ts
   describe("App version 42", () => {
     it("renames `oldName` to `newName`", () => {
       const result = migrate({ state: { version: 0 } })
       expect(result).toMatchObject({
         version: 42,
         myModule: {
           newName: "blah",
         },
       })
       expect("oldName" in result.myModule).toBe(false)
     })
   })
   ```

5. Test your migration manually on a device.
   1. Remove the app from your phone.
   2. Install the latest beta from testflight.
   3. Log in and perform actions to accumulate some of the state that will be affected by your changes.
   4. Install your development version of the app from xcode.
   5. Check that the affected code works as intended.
