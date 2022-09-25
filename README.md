# Ticketing

Application built with microservices that handles the process of selling and buying of tickets. 

## Get Started

1. Install [Docker](https://www.docker.com/get-started/).
2. Install [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package).
3. Enable Kubernetes in the Docker settings.
4. Clone this repo inside WSL.
5. Build and push projects that do not exist on DockerHub.

Each Dockerfile needs to be published to DockerHub for skaffold to work. Navigate to directories that contain a Dockerfile and run:
```
docker build -t <username>/<project_name> .
docker push <username>/<project_name>
```
The images must exist on DockerHub for skaffold to work.

6. Install [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start).
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/cloud/deploy.yaml
```

7. Create a JWT_KEY environment variable required by microservices.
```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<secret_key>
```

8. Install Skaffold with [Chocolatey](https://chocolatey.org/install).
```
choco install skaffold
```

9. Edit *hosts* file in *C:/Windows/System32/Drivers/etc/* by adding this line at the end.
```
127.0.0.1 ticketing.com
```

10. Finally, run `skaffold dev` in the ticketing directory.
