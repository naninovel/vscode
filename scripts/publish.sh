sh scripts/set-ver.sh
npm run build
vsce publish --pre-release
sh scripts/unset-ver.sh
