# n2n-docker
Need to Node: Getting started with Node.JS, Docker, and Kubernetes


## Hello World

```
cd helloworld
```

```
less index.js
```

```
less package.json
```

```
npm install
```

```
node index.js
```

```
curl http://127.0.0.1:3000
```

```
curl http://127.0.0.1:3000/version
```

```
http://127.0.0.1:3000/healthz
```

```
redis-server
```

```
curl http://127.0.0.1:3000/healthz
```

## Building Containers with Docker

```
less Dockerfile
```

```
docker build -t rosskukulinski/helloworld:v1.0.0 .
```

```
docker images
```

```
docker push rosskukulinski/helloworld:v1.0.0
```

## Deploying Containers with Kubernetes

```
less deployments/helloworld-v1.yml
```

```
kubectl create -f deployments/helloworld.yml
```

```
kubectl describe deployments/helloworld
```

```
kubectl get pods
```

```
kubectl describe pods <pod>
```

```
curl http://<podip>
```

## Port Forwarding

### Terminal 1
```
kubectl port-forward <pod> 5000:3000
```

### Terminal 2
```
curl http://127.0.0.1:5000
```

## Running Adhoc Commands
```
kubectl exec <pod> -c helloworld -- node -v
```

## Logs
```
kubectl logs -f <pod> redis
```

## Troubleshooting

```
kubectl get pods
```

```
kubectl label pods <pod> track-
```

```
kubectl label pods <pod> track=stable
```

## Scaling out
```
kubectl scale deployment/helloworld --replicas=5
```

```
kubectl get pods
```

## Service Discovery

```
less svc/helloworld.yml
```

```
kubectl create -f svc/helloworld.yml
```

```
kubectl describe svc helloworld
```

```
curl http://<node-public-ip>:30000/version
```

```
curl http://<lb-public-ip>/version
```

## Canary Pattern

```
less deployments/helloworld-canary.yml
```

```
kubectl create -f deployments/helloworld-canary.yml
```

```
kubectl get pods
```

```
while true; do curl http://<lb-public-ip>/version; sleep .5; done
```

## Label Queries

```
kubectl get pods
```

```
kubectl get pods -l app=helloworld,track=stable
```

```
kubectl get pods -l app=helloworld,track=canary
```

## Rolling Updates

```
less deployments/helloworld-v2.yml
```

```
kubectl apply -f deployments/helloworld-v2.yml
```

```
kubectl rollout history deployment/helloworld
```

```
kubectl rollout undo deployment/helloworld
```
