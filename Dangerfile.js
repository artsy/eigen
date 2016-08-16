message("Hello, world.")


if (git.modified_files.include("CHANGELOG.md") === false) {
  fail("No CHANGELOG added.");
}
