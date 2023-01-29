#build
docker build -t acrappelent.azurecr.io/demo:v0.3 .

docker push acrappelent.azurecr.io/demo:latest

#release
helm install release01 nextjs-app --namespace nextjs-app --create-namespace
