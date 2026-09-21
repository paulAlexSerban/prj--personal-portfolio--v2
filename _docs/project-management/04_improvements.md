# Project Management: Improvements

## To do
- [ ] cleanup AWS s3 content repo - delete - not needed anymore

## Backlog

## Done
- [x] FIX issue with google fonts not downloading in pipeline
- [x] migrate from bash scripts to node scripts for better error handling and maintainability
  - use title: "Building Production-Ready CLI Scripts in Bare Node.js: No Dependencies Required"
- [x] implement dataset-based content pulling in build script - if dataset is prod or preview run node clone-repo.js with coresponding flag
- [x] Simplify CI/CD pipeline - use Github Pages for Test/Stage environments, and only deploy to AWS for Production
    - cleanup MODULIZE scripts and leftovers
- [x] use flow from Personal Portoflio V1 and get full content repositories instead of useing AWS S3