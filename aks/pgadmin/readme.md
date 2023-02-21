Url:

```
kubectl create namespace pgadmin
kubectl apply -f pgadmin-configmap.yaml -n pgadmin
kubectl apply -f pgadmin-service.yaml -n pgadmin
kubectl apply -f pgadmin-pvc.yaml -n pgadmin
kubectl apply -f pgadmin-secretproviderclass.yaml -n pgadmin
kubectl apply -f pgadmin-deployment.yaml -n pgadmin
kubectl apply -f pgadmin-ingress.yaml -n pgadmin
```

Helm
https://github.com/rowanruseler/helm-charts/tree/master/charts/pgadmin4
https://github.com/niteenkole/pgadmin4

```
helm repo add runix https://helm.runix.net

helm upgrade --install -f pgadmin-values.yaml pgadmin runix/pgadmin4 --namespace pgadmin --create-namespace --set env.email=demo@demo.com --set env.password=demo
```
