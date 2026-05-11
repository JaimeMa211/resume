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
CANARY_PORT="${CANARY_PORT:-3001}"
CANARY_CONTAINER_NAME="${CANARY_CONTAINER_NAME:-${CONTAINER_NAME}-canary}"
BACKUP_CONTAINER_NAME="${BACKUP_CONTAINER_NAME:-${CONTAINER_NAME}-backup}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-90}"

echo "==> Deploying ${APP_NAME}"
echo "    App dir: ${APP_DIR}"
echo "    Branch: ${BRANCH}"
echo "    Image: ${IMAGE_NAME}"
echo "    Container: ${CONTAINER_NAME}"
echo "    Canary: ${CANARY_CONTAINER_NAME}"
echo "    Backup: ${BACKUP_CONTAINER_NAME}"

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

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

echo "==> Pulling latest code"
git pull origin "${BRANCH}"

echo "==> Building Docker image"
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-}" \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:-}" \
  --build-arg NPM_REGISTRY="${NPM_REGISTRY:-https://registry.npmmirror.com}" \
  -t "${IMAGE_NAME}" .

cleanup_canary() {
  docker rm -f "${CANARY_CONTAINER_NAME}" >/dev/null 2>&1 || true
}

cleanup_backup() {
  docker rm -f "${BACKUP_CONTAINER_NAME}" >/dev/null 2>&1 || true
}

wait_for_health() {
  local container_name="$1"
  local elapsed=0

  while (( elapsed < HEALTH_TIMEOUT )); do
    local status
    status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container_name}")"

    case "${status}" in
      healthy|running)
        return 0
        ;;
      unhealthy|exited|dead)
        return 1
        ;;
    esac

    sleep 3
    elapsed=$((elapsed + 3))
  done

  return 1
}

trap cleanup_canary EXIT

echo "==> Starting canary container on port ${CANARY_PORT}"
cleanup_canary
docker run -d \
  --name "${CANARY_CONTAINER_NAME}" \
  -p "${CANARY_PORT}:${CONTAINER_PORT}" \
  --env-file "${ENV_FILE}" \
  "${IMAGE_NAME}" >/dev/null

echo "==> Waiting for canary health"
if ! wait_for_health "${CANARY_CONTAINER_NAME}"; then
  echo "Canary failed to become healthy. Keeping current container unchanged."
  docker logs --tail 100 "${CANARY_CONTAINER_NAME}" || true
  exit 1
fi

echo "==> Canary is healthy"

had_existing_container=0
if docker ps -a --format '{{.Names}}' | grep -Fxq "${CONTAINER_NAME}"; then
  had_existing_container=1
  echo "==> Preparing existing container for rollback"
  cleanup_backup
  docker stop "${CONTAINER_NAME}" >/dev/null 2>&1 || true
  docker rename "${CONTAINER_NAME}" "${BACKUP_CONTAINER_NAME}"
fi

echo "==> Starting production container"
docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  --env-file "${ENV_FILE}" \
  "${IMAGE_NAME}" >/dev/null

echo "==> Waiting for production health"
if ! wait_for_health "${CONTAINER_NAME}"; then
  echo "Production container failed health check."
  docker logs --tail 100 "${CONTAINER_NAME}" || true
  docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true

  if [[ "${had_existing_container}" -eq 1 ]] && docker ps -a --format '{{.Names}}' | grep -Fxq "${BACKUP_CONTAINER_NAME}"; then
    echo "==> Rolling back to previous container"
    docker rename "${BACKUP_CONTAINER_NAME}" "${CONTAINER_NAME}"
    docker start "${CONTAINER_NAME}" >/dev/null
    wait_for_health "${CONTAINER_NAME}" || true
  fi

  exit 1
fi

if [[ "${had_existing_container}" -eq 1 ]]; then
  cleanup_backup
fi

cleanup_canary
trap - EXIT

echo "==> Current containers"
docker ps --filter "name=${CONTAINER_NAME}"

echo "==> Recent logs"
docker logs --tail 20 "${CONTAINER_NAME}"
