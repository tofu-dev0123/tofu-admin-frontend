#!/usr/bin/env bash
# lint / 型チェック / フォーマットチェック / UT を実行し、成功したら HEAD の sha を
# .claude/.last-check に記録する。
# .claude/hooks/require-check.sh が git push / gh pr create 時にこの記録と HEAD を照合する。
#
# next build は含めない（遅いため。ビルドは develop 向け PR の CI で確認する）。
# node / pnpm は nix devShell で供給する。direnv 未使用で pnpm が PATH に無い場合は
# nix develop 経由で自身を再実行する。
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

if ! command -v pnpm >/dev/null 2>&1; then
  if [ -n "${CHECK_SH_IN_NIX:-}" ]; then
    echo "==> nix develop 内でも pnpm が見つかりません。flake.nix を確認してください。" >&2
    exit 1
  fi
  echo "==> pnpm が PATH にないため nix develop 経由で再実行します"
  CHECK_SH_IN_NIX=1 exec nix develop "$ROOT" --command "$ROOT/scripts/check.sh"
fi

MARKER="$ROOT/.claude/.last-check"

rm -f "$MARKER"

echo "==> lint"
pnpm lint

echo "==> type"
pnpm type

echo "==> format"
pnpm exec prettier --check .

echo "==> test"
pnpm test

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "==> チェックは成功しましたが、未コミットの変更があるため記録しません。コミット後に再実行してください。" >&2
  exit 1
fi

git rev-parse HEAD > "$MARKER"
echo "==> OK: $(cat "$MARKER") を記録しました"
