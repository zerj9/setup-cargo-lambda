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

async function getTool(version) {
  const arch = 'i686' // To do: Add functionality to download for other architectures.
  let toolPath = tc.find('cargo-lambda', version, arch);
  console.log(`Cache searched. Path returned is: ${toolPath}`);

  if (toolPath) {
    console.log(`Found in cache. Path: ${toolPath}`);
    return toolPath;
  }

  const downloadUrl = getDownloadURL(version);
  console.log(`Tool not found in cache. Downloading from: ${downloadUrl}`);
  toolPath = await downloadCargoTool(downloadUrl);
  console.log(`Tool path is: ${toolPath}`);

  console.log(`Adding version: ${version} with arch: ${arch} to cache`);
  const cacheDir = await tc.cacheDir(toolPath, 'cargo-lambda', version, arch);
  return cacheDir;
}

async function setup() {
  // Get version of tool to be installed
  const version = core.getInput('version');
  console.log(`Input version is: ${version}`);

  const toolPath = await getTool(version);

  // Expose the tool by adding it to the PATH
  // console.log(`Adding ${toolPath} to PATH`);
  core.addPath(toolPath)
}


(async () => {
  try {
    await setup();
  } catch (error) {
    core.setFailed(error.message);
  }
})();
