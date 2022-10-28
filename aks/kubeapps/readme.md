# Install kubeapps

Url: https://www.azure365pro.com/installing-wordpress-on-azure-kubernetes-services-using-kubeapps/

```
helm repo add bitnami https://charts.bitnami.com/bitnami
kubectl create namespace kubeapps
helm install kubeapps --namespace kubeapps bitnami/kubeapps

# Get token for first login
kubectl create serviceaccount kubeapps-operator -n kubeapps
kubectl create clusterrolebinding kubeapps-operator --clusterrole=cluster-admin --serviceaccount=kubeapps:kubeapps-operator -n kubeapps
kubectl get secret -n kubeapps $(kubectl get serviceaccount -n kubeapps kubeapps-operator -o jsonpath='{.secrets[].name}') -o jsonpath='{.data.token}' -o go-template='{{.data.token | base64decode}}'

# Deploy ingress rule
kubectl apply -f kubeapps-ingress.yaml -n kubeapps
```