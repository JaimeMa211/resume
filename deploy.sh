#!/usr/bin/env bash

set -euo pipefail

APP_NAME="${APP_NAME:-resume}"
APP_DIR="${APP_DIR:-/root/resume}"
BRANCH="${BRANCH:-main}"
IMAGE_NAME="${IMAGE_NAME:-resume:latest}"
CONTAINER_NAME="${CONTAINER_NAME:-resume}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env.local}"
HOST_PORT="${HOST_PORT:-3000}"
CONTAINER_PORT="${CONTAINER_PORT:-3000}"

echo "==> Deploying ${APP_NAME}"
echo "    App dir: ${APP_DIR}"
echo "    Branch: ${BRANCH}"
echo "    Image: ${IMAGE_NAME}"
echo "    Container: ${CONTAINER_NAME}"

cd "${APP_DIR}"

if [[ ! -f package.json ]]; then
  echo "package.json not found in ${APP_DIR}"
  exit 1
fi

if [[ ! -f Dockerfile ]]; then
  echo "Dockerfile not found in ${APP_DIR}"
  exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Env file not found: ${ENV_FILE}"
  exit 1
fi

echo "==> Pulling latest code"
git pull origin "${BRANCH}"

echo "==> Building Docker image"
docker build -t "${IMAGE_NAME}" .

if docker ps -a --format '{{.Names}}' | grep -Fxq "${CONTAINER_NAME}"; then
  echo "==> Replacing existing container"
  docker stop "${CONTAINER_NAME}" >/dev/null 2>&1 || true
  docker rm "${CONTAINER_NAME}" >/dev/null 2>&1 || true
fi

echo "==> Starting container"
docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  --env-file "${ENV_FILE}" \
  "${IMAGE_NAME}"

echo "==> Current containers"
docker ps --filter "name=${CONTAINER_NAME}"

echo "==> Recent logs"
docker logs --tail 20 "${CONTAINER_NAME}"
