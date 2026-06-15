'use client';

import { useEffect, useId, useRef } from 'react';
import { renderMermaid } from '@/lib/mermaid';

/**
 * Mermaid ソースを図として描画する。
 * 構文エラー時は元のコードをそのまま表示し、本文全体が壊れないようにする。
 */
function Mermaid({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9-]/g, '')}`;

  useEffect(() => {
    let active = true;

    renderMermaid(id, code)
      .then((svg) => {
        if (active && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      })
      .catch(() => {
        if (active && containerRef.current) {
          const pre = document.createElement('pre');
          const codeEl = document.createElement('code');
          codeEl.textContent = code;
          pre.appendChild(codeEl);
          containerRef.current.replaceChildren(pre);
        }
      });

    return () => {
      active = false;
    };
  }, [id, code]);

  return <div ref={containerRef} className="mermaid" />;
}

export default Mermaid;
