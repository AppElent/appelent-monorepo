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

### Loki-stack

### https://anaisurl.com/loki-access-logs-the-smart-way/

https://github.com/grafana/helm-charts/tree/main/charts/loki-stack

helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

helm upgrade --install loki --namespace=monitoring grafana/loki-stack -f loki-stack.yaml --create-namespace

### Grafana cloud

Send logs to grafana cloud: https://grafana.com/docs/grafana-cloud/data-configuration/logs/collect-logs-with-promtail/#option-2-send-logs-from-a-kubernetes-cluster

### Dashboards

Django: 17617
Kubernetes: 6417
