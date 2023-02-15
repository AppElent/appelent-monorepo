```
# Build container
docker build -t acrappelent.azurecr.io/django-api:dockertest01 .
docker push acrappelent.azurecr.io/django-api:v0.3

az acr build --registry acrappelent --image django-api:v1 .

docker run --name django-api -d django-api:v0.1

docker push acrappelent.azurecr.io/django-api:v0.2

# Variables:
deployment --> database url
deployment --> secret key
deployment --> environment
deployment --> container image
secretproviderclass -> keyvault name
ingress -> hosts

# Development
kubectl create namespace django-api-dev
kubectl apply -f secretproviderclass.yaml -n django-api-dev
kubectl apply -f deployment.yaml -n django-api-dev
kubectl apply -f service.yaml -n django-api-dev
kubectl apply -f ingress.yaml -n django-api-dev

# Production
kubectl create namespace django-api-prd
kubectl apply -f deployment.yaml -n django-api-prd
kubectl apply -f service.yaml -n django-api-prd
kubectl apply -f ingress.yaml -n django-api-prd
```
