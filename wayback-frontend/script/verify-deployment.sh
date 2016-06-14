# $1 = the kubernetes context (specified in kubeconfig)
# $2 = directory that contains your kubernetes files to deploy
# $3 = set to y to perform a rolling update

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONTEXT="$1"

#set config context
~/.kube/kubectl config use-context ${CONTEXT}

#get user password and api ip from config data
export kubepass=`(~/.kube/kubectl config view -o json | jq ' { mycontext: .["current-context"], contexts: .contexts[], users: .users[], clusters: .clusters[]}' | jq 'select(.mycontext == .contexts.name) | select(.contexts.context.user == .users.name) | select(.contexts.context.cluster == .clusters.name)' | jq .users.user.password | tr -d '\"')`

export kubeuser=`(~/.kube/kubectl config view -o json | jq ' { mycontext: .["current-context"], contexts: .contexts[], users: .users[], clusters: .clusters[]}' | jq 'select(.mycontext == .contexts.name) | select(.contexts.context.user == .users.name) | select(.contexts.context.cluster == .clusters.name)' | jq .users.user.username | tr -d '\"')`

export kubeurl=`(~/.kube/kubectl config view -o json | jq ' { mycontext: .["current-context"], contexts: .contexts[], users: .users[], clusters: .clusters[]}' | jq 'select(.mycontext == .contexts.name) | select(.contexts.context.user == .users.name) | select(.contexts.context.cluster == .clusters.name)' | jq .clusters.cluster.server | tr -d '\"')`

export kubenamespace=`(~/.kube/kubectl config view -o json | jq ' { mycontext: .["current-context"], contexts: .contexts[]}' | jq 'select(.mycontext == .contexts.name)' | jq .contexts.context.namespace | tr -d '\"')`

export kubeip=`(echo $kubeurl | sed 's~http[s]*://~~g')`

export https=`(echo $kubeurl | awk 'BEGIN { FS = ":" } ; { print $1 }')`

echo "Checking deployment generation"
OBS_GEN=-1
CURRENT_GEN=0
until [ $OBS_GEN -ge $CURRENT_GEN ]; do
  sleep 5
  CURRENT_GEN=$(~/.kube/kubectl get deployment ${SERVICENAME} -o yaml | grep generation | awk '{print $2}')
  OBS_GEN=$(~/.kube/kubectl get deployment ${SERVICENAME} -o yaml | grep Generation | awk '{print $2}')
  echo "observedGeneration ($OBS_GEN) should be >= generation ($CURRENT_GEN)."
done
echo "observedGeneration ($OBS_GEN) is >= generation ($CURRENT_GEN)"

echo "Checking for updatedReplicas to equal replicas"
UPDATED_REPLIACS=-1
REPLICAS=0
until [ "$UPDATED_REPLIACS" == "$REPLICAS" ]; do
  sleep 5
  REPLICAS=$(~/.kube/kubectl get deployment ${SERVICENAME} -o yaml | grep replicas | sed -n 2p | awk '{print $2}')
  UPDATED_REPLIACS=$(~/.kube/kubectl get deployment ${SERVICENAME} -o yaml | grep updatedReplicas | awk '{print $2}')
  echo "updatedReplicas ($UPDATED_REPLIACS) should be == replicas ($REPLICAS)."
done
echo "updatedReplicas ($UPDATED_REPLIACS) is == replicas ($REPLICAS)."

echo "Checking for availableReplicas to equal replicas"
AVAILABLE_REPLICAS=-1
REPLICAS=0
until [ "$AVAILABLE_REPLICAS" == "$REPLICAS" ]; do
  sleep 5
  REPLICAS=$(~/.kube/kubectl get deployment ${SERVICENAME} -o yaml | grep replicas | sed -n 2p | awk '{print $2}')
  AVAILABLE_REPLICAS=$(~/.kube/kubectl get deployment ${SERVICENAME} -o yaml | grep -e "\bavailableReplicas" | awk '{print $2}')
  echo "availableReplicas ($AVAILABLE_REPLICAS) should be == replicas ($REPLICAS)."
done
echo "availableReplicas ($AVAILABLE_REPLICAS) is == replicas ($REPLICAS)."

echo "Deployment was successful"
