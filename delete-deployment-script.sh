#!/bin/bash

PR_NUMBER=$1

# Apply the temporary Kubernetes deployment
kubectl delete deployment -n panic-pr-review develop-panic-button-app-${PR_NUMBER}

kubectl delete svc -n panic-pr-review develop-panic-button-app-${PR_NUMBER}

kubectl delete ing -n panic-pr-review develop-panic-button-app-ingress-${PR_NUMBER}