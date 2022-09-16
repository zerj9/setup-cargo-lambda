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
      - uses: ./
      - run: cargo lambda build --arm64 && env
        working-directory: lambda_function
```
