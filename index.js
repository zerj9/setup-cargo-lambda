const path = require('path')
const core = require('@actions/core');
import * as github from '@actions/github';
const tc = require('@actions/tool-cache');

function getDownloadURL(version) {
  const  url = `https://github.com/cargo-lambda/cargo-lambda/releases/download/${version}/cargo-lambda-${version}.i686-unknown-linux-musl.tar.gz`;
  return url
}

async function downloadCargoTool(downloadUrl) {
  // Download the specific version of the tool
  const token = github.context.token;
  const downloadPath = await tc.downloadTool(downloadUrl, undefined, `token ${token}`);

  // Extract the tarball onto the runner
  const cargoLambdaPath = await tc.extractTar(downloadPath);
  console.log(`Extracted path is: ${cargoLambdaPath}`)
  return cargoLambdaPath;
}

async function setup() {
  // Get version of tool to be installed
  const version = core.getInput('version');
  console.log(`Input version is: ${version}`);

  const downloadUrl = getDownloadURL(version);
  console.log(`Download url is: ${downloadUrl}`)
  const toolPath = await downloadCargoTool(downloadUrl)
  console.log(`Tool path is: ${toolPath}`)

  // const cachePath = await tc.cacheDir(cargoLambdaPath, 'cargo-lambda', version)

  // Expose the tool by adding it to the PATH
  // console.log(`Adding ${cachePath} to PATH`);
  core.addPath(toolPath)
}


(async () => {
  try {
    await setup();
  } catch (error) {
    core.setFailed(error.message);
  }
})();
