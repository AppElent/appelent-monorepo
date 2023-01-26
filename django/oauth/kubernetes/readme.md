```
# Development
kubectl create namespace django-oauth-dev
kubectl apply -f deployment.yaml -n django-oauth-dev
kubectl apply -f service.yaml -n django-oauth-dev
kubectl apply -f ingress.yaml -n django-oauth-dev

# Production
kubectl create namespace django-oauth-prd
kubectl apply -f deployment.yaml -n django-oauth-prd
kubectl apply -f service.yaml -n django-oauth-prd
kubectl apply -f ingress.yaml -n django-oauth-prd
```