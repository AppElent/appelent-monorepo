```
kubectl create namespace demo
kubectl apply -f aks-helloworld-one.yaml --namespace demo
kubectl apply -f aks-helloworld-two.yaml --namespace demo
kubectl apply -f nginx-demo.yaml --namespace demo
kubectl apply -f demo-ingress.yaml --namespace demo
```