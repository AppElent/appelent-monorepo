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

# AKS Workload identity

https://learn.microsoft.com/en-us/azure/aks/workload-identity-deploy-cluster

### preview extension:

az extension add --name aks-preview

### feature register

az feature register --namespace "Microsoft.ContainerService" --name "EnableWorkloadIdentityPreview"

### checken tot hij registered is:

az feature show --namespace "Microsoft.ContainerService" --name "EnableWorkloadIdentityPreview"

### dan refresh:

az provider register --namespace Microsoft.ContainerService

### get oidc url

az aks show -n aks-appelent -g rg-appelent-shared --query "oidcIssuerProfile.issuerUrl" -otsv

### get client id

az identity show --resource-group "rg-appelent-shared" --name "mi-aks-workload-identity" --query 'clientId' -otsv

### add client id to serviceaccount yaml files

### trust:

az identity federated-credential create --name fed-id-django-api-dev --identity-name "mi-aks-workload-identity" --resource-group "rg-appelent-shared" --issuer https://westeurope.oic.prod-aks.azure.com/c2afb8f4-c242-45e0-8513-2cdfcb2c8cdd/ed998d52-f2a5-4c6d-96f2-34ebf3824901/ --subject system:serviceaccount:django-api-dev:sa-aks-appelent-workload-identity
az identity federated-credential create --name fed-id-django-api-prd --identity-name "mi-aks-workload-identity" --resource-group "rg-appelent-shared" --issuer https://westeurope.oic.prod-aks.azure.com/c2afb8f4-c242-45e0-8513-2cdfcb2c8cdd/ed998d52-f2a5-4c6d-96f2-34ebf3824901/ --subject system:serviceaccount:django-api-dev:sa-aks-appelent-workload-identity
