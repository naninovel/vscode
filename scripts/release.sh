sed -r "s/\"version\": \"(.+\.)0\",/\"version\": \"\1$(date +%Y%m%d)\",/" -i "package.json"
npm run build
npm run package
sed -r "s/\"version\": \"(.+\.).+\",/\"version\": \"\10\",/" -i "package.json"
