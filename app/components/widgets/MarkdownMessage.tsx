import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import katex from "katex";

type Props = { text: string };

// Math tokenizer supports:
// - ```math ... ``` or ```latex ... ``` fenced blocks
// - \[ ... \] and \( ... \)
// - $$ ... $$ and $ ... $
// - \begin{env} ... \end{env} (approximate)
const MATH_REGEX = /```(?:math|latex)\n([\s\S]+?)\n```|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$\$([\s\S]+?)\$\$|\$([^$\n]+)\$|\\begin\{[a-z*]+\}([\s\S]+?)\\end\{[a-z*]+\}/g;

function renderMathToHTML(src: string, displayMode: boolean) {
  try {
    return katex.renderToString(src, { throwOnError: false, displayMode });
  } catch {
    return src;
  }
}

export function MarkdownMessage({ text }: Props) {
  const parts = React.useMemo(() => {
    const tokens: Array<{ type: "text" | "math-inline" | "math-block"; value: string }> = [];
    let lastIndex = 0;
    for (const m of text.matchAll(MATH_REGEX)) {
      const start = m.index ?? 0;
      const end = start + (m[0]?.length || 0);
      if (start > lastIndex) tokens.push({ type: "text", value: text.slice(lastIndex, start) });

      const [, gFence, gBrack, gParen, gBlock, gInline, gBegin] = m as unknown as string[];
      if (gFence != null) {
        tokens.push({ type: "math-block", value: gFence.trim() });
      } else if (gBrack != null) {
        tokens.push({ type: "math-block", value: gBrack.trim() });
      } else if (gParen != null) {
        tokens.push({ type: "math-inline", value: gParen.trim() });
      } else if (gBlock != null) {
        tokens.push({ type: "math-block", value: gBlock.trim() });
      } else if (gInline != null) {
        tokens.push({ type: "math-inline", value: gInline.trim() });
      } else if (gBegin != null) {
        tokens.push({ type: "math-block", value: gBegin.trim() });
      }

      lastIndex = end;
    }
    if (lastIndex < text.length) tokens.push({ type: "text", value: text.slice(lastIndex) });
    return tokens;
  }, [text]);

  return (
    <div className="whitespace-pre-wrap break-words">
      {parts.map((p, i) => {
        if (p.type === "text") {
          return (
            <ReactMarkdown
              key={i}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-2" {...props} />,
                li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
                table: ({ node, ...props }) => (
                  <div className="my-2 overflow-x-auto"><table className="min-w-[300px] text-sm border-collapse" {...props} /></div>
                ),
                th: ({ node, ...props }) => <th className="border px-2 py-1 text-left bg-muted/50" {...props} />,
                td: ({ node, ...props }) => <td className="border px-2 py-1 align-top whitespace-pre-wrap" {...props} />,
                code: ({ inline, className, children, ...props }) => {
                  const isInline = inline || !String(children).includes("\n");
                  return isInline ? (
                    <code className="px-1 py-0.5 rounded bg-muted/70" {...props}>{children}</code>
                  ) : (
                    <pre className="my-2 overflow-x-auto"><code className={className} {...props}>{children}</code></pre>
                  );
                },
              }}
            >
              {p.value}
            </ReactMarkdown>
          );
        }
        const html = renderMathToHTML(p.value, p.type === "math-block");
        return (
          <span
            key={i}
            className={p.type === "math-block" ? "block my-1" : "inline"}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </div>
  );
}

export default MarkdownMessage;
