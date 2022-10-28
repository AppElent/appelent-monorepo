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
