const childProcess = require('child_process');
const util = require('util');
const fs = require('fs');

const execPromise = util.promisify(childProcess.exec);

Promise.all([
  execPromise('git describe --abbrev=0 --tags'),
  execPromise('git rev-parse HEAD')
]).then(results => {
  const VERSION = results[0].stdout.trim();
  const COMMIT_HASH = results[1].stdout.trim();
  const BUILD_DATE = new Date().toISOString();
  const output = `{
  "name": "Remondis Client",
  "version": "${VERSION}",
  "commitHash": "${COMMIT_HASH}",
  "buildDate": "${BUILD_DATE}"
}`;
  fs.writeFileSync('./public/version.json', output);
});
