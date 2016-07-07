const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;

const versionChange = process.argv[2];
if (!versionChange) {
  console.log('Usage: $ npm run release -- [patch|minor|major]');
  process.exit(1);
}

function sh(command) {
  console.log('$ ' + command);
  const task = spawnSync(command, { shell: true });
  if (task.status != 0) {
    throw new Error('[!] ' + command);
  }
}

function publishPodspec(podspec) {
  const podspecFilename = path.basename(podspec);
  const podspecDir = path.dirname(path.resolve(podspec));
  const packagePath = path.join(podspecDir, 'package.json');

  const name = path.basename(podspec, '.podspec');
  const version = JSON.parse(fs.readFileSync(packagePath)).version;

  const specRepo = path.join(process.env.HOME, '.cocoapods/repos/artsy');
  const relativeSpecPath = path.join(name, version, name + '.podspec.json');
  const specPath = path.join(specRepo, relativeSpecPath);

  if (!fs.existsSync(specPath)) {
    console.log('=> Pushing ' + name + ' podspec to spec-repo.');
    sh('mkdir -p ' + path.dirname(specPath));
    sh('cd ' + podspecDir + ' && pod ipc spec ' + podspecFilename + ' > ' + specPath);
    sh('cd ' + specRepo + ' && git add ' + relativeSpecPath + ' && git commit -m "' + name + ' ' + version + '" && git push');
  }
}

console.log('=> Creating release bundle.');
sh('npm run bundle');
sh('git add Pod/Assets && git commit -m "[Pod] Update JS bundle."');

console.log('=> Creating version bump commit and tag.');
sh('npm version ' + versionChange);
sh('git push');
sh('git push --tags');

publishPodspec('Emission.podspec');
publishPodspec('node_modules/react-native/React.podspec');