# Setup Cargo Lambda

This GitHub action downloads, extracts and adds the [cargo-lambda](https://github.com/cargo-lambda/cargo-lambda) binary to the workspace PATH.

Prior installation of Rust, Cargo and Zig are required within the workflow.

They can be installed using the [rustup-toolchain-install](https://github.com/marketplace/actions/rustup-toolchain-install) and [setup-zig](https://github.com/marketplace/actions/setup-zig) GitHub actions as shown below:

## Usage

```yaml
name: cargo-lambda-test
on: [push]
jobs:
  cargo-lambda-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: dtolnay/rust-toolchain@stable
      - uses: goto-bus-stop/setup-zig@v1
        with:
          version: 0.9.1
      - uses: zerj9/setup-cargo-lambda@v0.1.0
      - run: cargo lambda build --arm64
        working-directory: lambda_function
```

Note: cargo-lambda requires rust version 1.59 and above as well as zig version 0.9.1 and above
