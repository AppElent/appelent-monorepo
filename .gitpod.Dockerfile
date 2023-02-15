# You can find the new timestamped tags here: https://hub.docker.com/r/gitpod/workspace-base/tags
FROM gitpod/workspace-full:latest

# Install custom tools, runtime, etc.
# base image only got `apt` as the package manager
# install-packages is a wrapper for `apt` that helps skip a few commands in the docker env.
RUN sudo install-packages shellcheck tree llvm


# Install tools as the gitpod user
USER gitpod
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install helper tools
RUN brew update && brew upgrade && brew install \
    gawk coreutils pre-commit tfenv terraform-docs \
    tflint tfsec instrumenta/instrumenta/conftest \
    && brew install --ignore-dependencies cdktf \
    && brew cleanup
RUN tfenv install latest && tfenv use latest

RUN curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

COPY .gitpod.bashrc /home/gitpod/.bashrc.d/custom

# Give back control
USER root
#  and revert back to default shell
#  otherwise adding Gitpod Layer will fail
SHELL ["/bin/sh", "-c"]