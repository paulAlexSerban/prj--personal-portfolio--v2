#!/bin/bash
# makes sure the folder containing the script will be the root folder
set -e
cd "$(dirname "$0")" || exit

while getopts ":e:" opt; do
  case $opt in
  e) ENV="$OPTARG" ;;
  *) usage ;;
  esac
done

if [[ -z $ENV ]]; then
  ENV=development
fi

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Colors for printing messages
NC='\033[0m' # No Color
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'

print_info() {
  echo -e "${GREEN} [ info ] ${NC}" "$1"
}

# if ../.env exists, load it
if [[ -f ../.env ]]; then
  print_info "Loading environment variables from ../.env file"
  source ../.env
else
  print_info "No ../.env file found, skipping loading environment variables from file"
fi

print_info 'Building... - should copy assets from ./assets/dist to public'

pullS3Content() {
  print_info "Pulling content from prod AWS S3 bucket to  ./content/prod folder, set cache TTL to 24h"
  node ../aws/pull-prod-content.js
}

cleanDistFolder() {
  print_info "Cleaning ./content/dist folder"
  rm -rfv ../content/dist/*
  mkdir -p ../content/dist
}

copyContent() {
  local arg1=$1
  print_info "Copying content from ./content/$arg1 to ./content/dist"
  cp -rfv ../content/$arg1/* ../content/dist/
}

print_info "Building from $GIT_BRANCH branch"
cleanDistFolder

if [[ "$NODE_ENV" == 'production' ]]; then
  pullS3Content
  copyContent prod
else
  copyContent test
fi


init() {
  print_info "Initializing build process for $ENV environment"
  export GA_MEASUREMENT_ID
  export SITE_URL
  npm --prefix .. run build
  npm --prefix .. run sitemap
  node ../seo/indexnow
  # use awk to remove the line starting with Host
  awk '!/^Host/' ../out/robots.txt >../out/temp.txt
  # use mv to rename the file
  mv ../out/temp.txt ../out/robots.txt
}


