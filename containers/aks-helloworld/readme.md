```
kubectl create namespace aks-helloworld
kubectl apply -f aks-helloworld-one.yaml --namespace aks-helloworld
kubectl apply -f aks-helloworld-two.yaml --namespace aks-helloworld
kubectl apply -f hello-world-ingress.yaml --namespace aks-helloworld
```