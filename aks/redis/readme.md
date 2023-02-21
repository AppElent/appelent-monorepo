Helm
helm repo add bitnami https://charts.bitnami.com/bitnami
https://github.com/bitnami/charts/blob/main/bitnami/redis/values.yaml

```
helm repo add bitnami https://charts.bitnami.com/bitnami

helm upgrade --install -f redis.yaml redis bitnami/redis --namespace redis --create-namespace --set global.redis.password=demo
```
