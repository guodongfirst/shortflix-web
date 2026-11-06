#!/usr/bin/env bash
set -euo pipefail

release_id=${1:?release id is required}
[[ "$release_id" =~ ^[0-9a-f]{40}$ ]] || { echo "Invalid release id" >&2; exit 2; }

base_dir=/opt/shortflix
release_dir="$base_dir/releases/$release_id/web"
live_dir="$base_dir/web/dist"
previous_dir="$base_dir/web/previous"

[[ -f "$release_dir/index.html" ]] || { echo "Release is missing index.html" >&2; exit 2; }

exec 9>"$base_dir/.deploy-web.lock"
flock -n 9 || { echo "Another web deployment is running" >&2; exit 1; }

install -d -m 755 "$live_dir"
rm -rf "$previous_dir"
cp -a "$live_dir" "$previous_dir"

find "$live_dir" -mindepth 1 -delete
cp -a "$release_dir"/. "$live_dir"/
find "$live_dir" -type d -exec chmod 755 {} +
find "$live_dir" -type f -exec chmod 644 {} +

expected=$(sha256sum "$release_dir/index.html" | awk '{print $1}')
healthy=false
for _ in $(seq 1 8); do
  actual=$(docker exec shortflix-web wget -qO- http://127.0.0.1/index.html | sha256sum | awk '{print $1}' || true)
  health=$(docker exec shortflix-web wget -qO- http://127.0.0.1/health || true)
  if [[ "$actual" == "$expected" && "$health" == *ok* ]]; then
    healthy=true
    break
  fi
  sleep 1
done
if [[ "$healthy" != true ]]; then
  echo "Web health check failed; rolling back" >&2
  find "$live_dir" -mindepth 1 -delete
  cp -a "$previous_dir"/. "$live_dir"/
  find "$live_dir" -type d -exec chmod 755 {} +
  find "$live_dir" -type f -exec chmod 644 {} +
  exit 1
fi

echo "Web deployment $release_id is healthy"
