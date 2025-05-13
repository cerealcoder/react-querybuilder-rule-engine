FROM rust:1.84

## rust / pingora build environment
## inherit from this to create an application specific build/deploy executable of pingora


RUN apt-get update && apt-get install -y \
    cmake clang zlib1g-dev lld inotify-tools

# add Rust development tools
RUN rustup component add clippy-preview
RUN rustup component add rust-analyzer 
RUN rustup component add rustfmt
