
Url for helm charts in Azure Marketplace: https://github.com/bitnami/azure-marketplace-charts
tutorial site: https://blog.devgenius.io/secure-aks-ingress-with-letsencrypt-f56f698ec6b5


# Ingress
### Create a namespace for ingress resources
kubectl create namespace ingress-basic

### Add the Helm repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

### Use Helm to deploy an NGINX ingress controller
helm install ingress-nginx ingress-nginx/ingress-nginx \
    --namespace ingress-basic \
    --set controller.replicaCount=2


# Certbot
# Label the cert-manager namespace to disable resource validation
kubectl label namespace ingress-basic cert-manager.io/disable-validation=true
# Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io
# Update your local Helm chart repository cache
helm repo update
# Install CRDs with kubectl
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.7.1/cert-manager.crds.yaml
# Install the cert-manager Helm chart
helm install cert-manager jetstack/cert-manager \
  --namespace ingress-basic \
  --version v1.7.1
# Create issuer (look for correct folder)
kubectl apply -f cluster-issuer.yaml --namespace ingress-basic