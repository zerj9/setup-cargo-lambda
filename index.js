const path = require('path')
const core = require('@actions/core');
const tc = require('@actions/tool-cache');

function getDownloadURL(version) {
  url = `https://github.com/cargo-lambda/cargo-lambda/releases/download/${version}/cargo-lambda-${version}.i686-unknown-linux-musl.tar.gz`;
  return url
}

async function setup() {
  // Get version of tool to be installed
  const version = core.getInput('version');
  console.log(`Input version is: ${version}`);

  // Download the specific version of the tool, e.g. as a tarball
  const downloadUrl = getDownloadURL(version);
  console.log(`Download url is: ${downloadUrl}`)
  const downloadPath = await tc.downloadTool(downloadUrl);
  console.log(`Downloaded path is: ${downloadPath}`)

  // Extract the tarball onto the runner
  const cargoLambdaPath = await tc.extractTar(downloadPath);
  console.log(`Extracted path is: ${cargoLambdaPath}`)

  const cachePath = await tc.cacheDir(cargoLambdaPath, 'cargo-lambda', version)

  // Expose the tool by adding it to the PATH
  console.log(`Adding ${cachePath} to PATH`);
  core.addPath(cachePath)
}


(async () => {
  try {
    await setup();
  } catch (error) {
    core.setFailed(error.message);
  }
})();
