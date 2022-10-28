# Install postgres in k8s
Information url: https://devopscube.com/deploy-postgresql-statefulset/
```
kubectl create namespace postgres-dev
kubectl apply -f postgres-configmap.yaml -n postgres-dev
kubectl apply -f postgres-pvc.yaml -n postgres-dev
kubectl apply -f postgres-svc.yaml -n postgres-dev
kubectl apply -f postgres-statefulset.yaml -n postgres-dev

<!-- kubectl apply -f pvc.yaml -n postgres-dev
kubectl apply -f secretproviderclass.yaml -n postgres-dev
kubectl apply -f deployment.yaml -n postgres-dev -->
```
