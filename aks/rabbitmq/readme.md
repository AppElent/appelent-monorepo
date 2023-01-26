helm upgrade --install --atomic --timeout 5m rabbitmq my-repo/rabbitmq -f ./values_dev.yaml --namespace rabbitmq-dev --create-namespace
