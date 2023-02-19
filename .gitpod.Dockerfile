# You can find the new timestamped tags here: https://hub.docker.com/r/gitpod/workspace-base/tags
FROM gitpod/workspace-full:latest

# Install custom tools, runtime, etc.
# base image only got `apt` as the package manager
# install-packages is a wrapper for `apt` that helps skip a few commands in the docker env.
#RUN sudo install-packages shellcheck tree llvm


# Install tools as the gitpod user
USER gitpod
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install helper tools
RUN brew uninstall --force --ignore-dependencies cmake
RUN brew cleanup -s cmake
RUN brew cleanup --prune-prefix
RUN brew install cmake
RUN brew update && brew upgrade
RUN brew install terraform azure-cli kubectl minikube helm awscli

RUN npm install -g firebase-tools


#COPY .gitpod.bashrc /home/gitpod/.bashrc.d/custom

# Give back control
USER root
#  and revert back to default shell
#  otherwise adding Gitpod Layer will fail
SHELL ["/bin/sh", "-c"]