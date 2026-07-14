#!/usr/bin/env bash
# Bump the patch version only when there are actual changes to build,
# commit everything (source + version), and sync Cargo.toml so the
# web display and the native build agree on the same committed version.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# Stage all tracked changes (excludes gitignored artifacts but includes
# new untracked files that haven't been ignored).
git add -A

# If nothing changed since the last commit, there's nothing to build —
# use the existing version and skip the bump.
if git diff --cached --quiet; then
  echo "→ no changes to build, keeping version $(node -p "require('./package.json').version")"
  exit 0
fi

# There ARE real changes — bump the patch version (no git tag, the
# commit below replaces the auto-commit that npm version would make).
npm version patch --no-git-tag-version

# Sync Cargo.toml with the new version
NEW_VER="$(node -p "require('./package.json').version")"
sed -i '' -E 's/^version = ".*"/version = "'"$NEW_VER"'"/' apps/desktop/src-tauri/Cargo.toml

# Stage the version files and commit everything together
git add package.json package-lock.json apps/desktop/src-tauri/Cargo.toml
git commit -m "build: v$NEW_VER"

echo "→ bumped to $NEW_VER and committed"
