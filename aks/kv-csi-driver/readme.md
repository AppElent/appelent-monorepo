# Install the CSI driver for Key Vault integration with AKS

Info: https://learn.microsoft.com/en-us/azure/aks/csi-secrets-store-driver

```
# use commandline to enable addon
az aks enable-addons --addons azure-keyvault-secrets-provider --name aks-appelent --resource-group rg-appelent-shared

#verify installation
kubectl get pods -n kube-system -l 'app in (secrets-store-csi-driver, secrets-store-provider-azure)'

# add role assignment for the added user assigned managed identity to the keyvaults in the subscription
# grab the managed identity principalId assuming it is in the default
# MC_ group for your cluster and resource group
IDENTITY_ID=$(az identity show -g rg-appelent-aks-resources --name azurekeyvaultsecretsprovider-aks-appelent --query principalId -o tsv)
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
KV_ID=$(az keyvault show -g rg-appelent-dev --name kv-appelent-dev --query id -o tsv)
 
# grant access rights on Key Vault
az role assignment create --assignee-object-id $IDENTITY_ID --role "Key Vault Secrets Officer" --scope /subscriptions/$SUBSCRIPTION_ID

# Create sample SecretProviderClass file
AZURE_TENANT_ID=$(az account show --query tenantId -o tsv)
CLIENT_ID=$(az aks show -g rg-appelent-shared -n aks-appelent --query addonProfiles.azureKeyvaultSecretsProvider.identity.clientId -o tsv)
 
cat >./secretproviderclass.yaml <<EOL
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: demo-secret
spec:
  provider: azure
  secretObjects:
  - secretName: demosecrets-secrets
    type: Opaque
    data:
    - objectName: "demosecret-secret"
      key: demosecret
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"
    userAssignedIdentityID: "$CLIENT_ID"
    keyvaultName: "$KV"
    objects: |
      array:
        - |
          objectName: "demosecret"
          objectType: secret
    tenantId: "$AZURE_TENANT_ID"
EOL
```