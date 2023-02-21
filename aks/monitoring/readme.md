# Prometheus

### Add repos

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add elastic https://helm.elastic.co
helm repo add stable https://charts.helm.sh/stable
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```

Prometheus: https://github.com/prometheus-community/helm-charts
Elastic: https://github.com/elastic/helm-charts/tree/main/elasticsearch
Grafana: https://git.app.uib.no/caleno/helm-charts/tree/fc77fdac89282c7b56790456308b8bbadcc7fabb/stable/grafana

### Install charts

helm upgrade --install -f prometheus.yaml prometheus prometheus-community/prometheus --namespace prometheus --create-namespace

helm upgrade --install -f elastic.yaml elastic elastic/elasticsearch --namespace elastic --create-namespace

### Grafana

Change password and run command, user is admin:
helm upgrade --install -f grafana.yaml grafana grafana/grafana --namespace grafana --create-namespace --set adminPassword=demo123
