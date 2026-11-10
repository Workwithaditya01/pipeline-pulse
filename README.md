# Pipeline Pulse — Local-first CI/CD with GitHub Actions & Docker

Pipeline Pulse is a polished, responsive dashboard used to demonstrate a complete CI/CD workflow without requiring a cloud server. GitHub Actions runs tests, builds a Docker image, and publishes it to Docker Hub. You can then pull and run that image on your own machine.

## Architecture

```text
Developer push / pull request
            |
            v
      GitHub Actions
            |
        Run tests
            |
       Tests pass?
        /      \
      no        yes
      |          |
   Stop      Build image
                 |
        Push on main branch
                 |
             Docker Hub
                 |
        Pull image locally
                 |
           localhost:3000
```

## Features

- Responsive dark dashboard UI.
- Node.js HTTP server with `/health` endpoint.
- Three automated tests using Node's built-in test runner.
- Dockerfile runs as a non-root user and includes a health check.
- Docker Compose for one-command local deployment.
- GitHub Actions tests pull requests and pushes; publishes Docker images only after a successful push to `main`.

## Requirements

- Git and a GitHub account.
- Node.js 22 or later (for local testing).
- Docker Desktop (Windows/macOS) or Docker Engine + Docker Compose plugin (Linux).
- A free Docker Hub account.

## Run locally without Docker

```bash
npm test
npm start
```

Open <http://localhost:3000>. Check <http://localhost:3000/health> for the JSON health response.

## Run with Docker Compose

```bash
docker compose up --build -d
docker compose ps
```

Open <http://localhost:3000>. Useful commands:

```bash
docker compose logs -f
docker compose down
```

## GitHub Actions + Docker Hub setup

1. Create a public repository on GitHub named `pipeline-pulse`.
2. Push this project to the repository's `main` branch.
3. Create a Docker Hub access token from **Account Settings → Personal access tokens**. Give it Read & Write access.
4. In GitHub, open **Settings → Secrets and variables → Actions → New repository secret**.
5. Add these secrets:
   - `DOCKERHUB_USERNAME`: your Docker Hub username.
   - `DOCKERHUB_TOKEN`: the Docker Hub access token (not your account password).
6. Push a commit to `main`, then open the repository's **Actions** tab.
7. Confirm the test job and build-and-push job both pass. The publish job runs only on pushes to `main`; pull requests run tests but do not publish.
8. Open Docker Hub and confirm the `pipeline-pulse` repository contains `latest` and a commit-SHA tag.

## Pull and run the published image

Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username:

```bash
docker pull YOUR_DOCKERHUB_USERNAME/pipeline-pulse:latest
docker run -d --name pipeline-pulse -p 3000:3000 --restart unless-stopped YOUR_DOCKERHUB_USERNAME/pipeline-pulse:latest
docker ps
```

Visit <http://localhost:3000>. Check the container health:

```bash
docker inspect --format='{{.State.Health.Status}}' pipeline-pulse
```

Stop and remove it:

```bash
docker rm -f pipeline-pulse
```

## Minikube option (optional)

If you want to deploy to Minikube instead of Docker directly, start Minikube and use your published image:

```bash
minikube start
kubectl create deployment pipeline-pulse --image=YOUR_DOCKERHUB_USERNAME/pipeline-pulse:latest
kubectl expose deployment pipeline-pulse --type=NodePort --port=3000
kubectl get pods,services
minikube service pipeline-pulse
```

This is optional; the project deliverable can be completed with Docker locally.

## Suggested screenshots for submission

1. Pipeline Pulse running at `http://localhost:3000`.
2. `npm test` showing all 3 tests passing.
3. `docker compose ps` showing the running container.
4. GitHub Actions workflow showing successful test and build/push jobs.
5. Docker Hub repository showing the `latest` image tag.
6. `docker ps` after pulling and running the published image.

## Troubleshooting

- **Port 3000 is already in use:** change the left side of the Compose mapping, for example `3001:3000`, then open `http://localhost:3001`.
- **Docker daemon is not running:** start Docker Desktop or the Docker service, then retry.
- **Docker Hub login fails:** use the access token as `DOCKERHUB_TOKEN`, not your normal password.
- **Image push is denied:** verify the username, token permissions, and repository name.
- **Workflow does not publish:** confirm the branch is `main`, the test job passed, and both GitHub secrets exist.
- **Container starts but page does not load:** inspect `docker logs pipeline-pulse` and confirm port `3000` is mapped.

## Deliverables checklist

- [ ] GitHub repository containing source, Dockerfile, Compose file, and workflow.
- [ ] Successful test and build/push workflow run.
- [ ] Public Docker Hub image link.
- [ ] Image pulled and running locally (or in Minikube).
- [ ] Screenshots of the deployed application and workflow results.
# pipeline-pulse
