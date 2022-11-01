

```
kubectl create namespace wordpress
kubectl apply -f wordpress-pvc.yaml -n wordpress
kubectl apply -f wordpress-deployment.yaml -n wordpress
kubectl apply -f wordpress-svc.yaml -n wordpress
kubectl apply -f wordpress-ingress.yaml -n wordpress
```