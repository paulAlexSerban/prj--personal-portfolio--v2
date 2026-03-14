#!/bin/bash
# makes sure the folder containing the script will be the root folder
cd "$(dirname "$0")" || exit

NC='\033[0m' # No Color
GREEN='\033[0;32m'

print_info() {
  echo -e "${GREEN} [ info ] ${NC}" "$1"
}

REMOTE_URL=$(git config --get remote.origin.url)
REPOSITORY_NAME=$(basename -s .git "$REMOTE_URL")
print_info "Repository Name: $REPOSITORY_NAME"

## prepare the package folder
mkdir -p ../../../package/prj--portfolio-website-v2

# copy the files to the package folder
cp -rfv ../out/* ../../../package/prj--portfolio-website-v2

