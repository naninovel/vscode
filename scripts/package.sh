sh scripts/set-ver.sh
npm run build
vsce package
sh scripts/unset-ver.sh
