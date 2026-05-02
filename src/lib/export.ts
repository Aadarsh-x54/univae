// UNIVAE — Chat Export Utilities

import { SerializedMessage } from "./types";

interface ExportData {
  title: string;
  model: string;
  mode: string;
  createdAt: Date;
  messages: SerializedMessage[];
}

/**
 * Export conversation as a Markdown file and trigger download.
 */
export function exportAsMarkdown(data: ExportData): void {
  const { title, model, mode, createdAt, messages } = data;

  const header = [
    `# ${title}`,
    ``,
    `> **Model:** ${model}  `,
    `> **Mode:** ${mode}  `,
    `> **Date:** ${createdAt.toLocaleString()}  `,
    `> **Exported by:** UNIVAE`,
    ``,
    `---`,
    ``,
  ].join("\n");

  const body = messages
    .map((msg) => {
      const role = msg.role === "user" ? "🧑 **You**" : "✦ **UNIVAE**";
      return `${role}\n\n${msg.content}\n\n---\n`;
    })
    .join("\n");

  const markdown = header + body;
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `univae-${slugify(title)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export conversation as a PDF using the browser's print dialog.
 * Opens a styled print window.
 */
export function exportAsPDF(data: ExportData): void {
  const { title, model, mode, createdAt, messages } = data;

  const messageHTML = messages
    .map((msg) => {
      const isUser = msg.role === "user";
      const roleLabel = isUser ? "You" : "UNIVAE";
      const roleClass = isUser ? "user-msg" : "ai-msg";
      // Basic markdown-to-HTML (bold, code, newlines)
      const content = basicMarkdownToHtml(msg.content);
      return `
        <div class="message ${roleClass}">
          <div class="role-badge">${isUser ? "🧑" : "✦"} ${roleLabel}</div>
          <div class="content">${content}</div>
        </div>`;
    })
    .join("\n");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title} — UNIVAE</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      color: #1a1a2e;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.7;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #4c1d95;
      margin-bottom: 8px;
    }
    .meta {
      color: #6b7280;
      font-size: 12px;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 2px solid #ede9fe;
    }
    .message {
      margin-bottom: 24px;
      padding: 16px 20px;
      border-radius: 12px;
      page-break-inside: avoid;
    }
    .user-msg {
      background: #f5f3ff;
      border-left: 3px solid #7c3aed;
    }
    .ai-msg {
      background: #faf5ff;
      border-left: 3px solid #a855f7;
    }
    .role-badge {
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #7c3aed;
      margin-bottom: 8px;
    }
    .content { color: #374151; }
    .content code {
      background: #e0e7ff;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 13px;
    }
    .content pre {
      background: #1e1b4b;
      color: #e0e7ff;
      padding: 12px 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 8px 0;
      font-size: 12px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #ede9fe;
      text-align: center;
      color: #9ca3af;
      font-size: 11px;
    }
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">
    Model: ${model} &nbsp;|&nbsp; Mode: ${mode} &nbsp;|&nbsp; Date: ${createdAt.toLocaleString()} &nbsp;|&nbsp; ${messages.length} messages
  </div>
  ${messageHTML}
  <div class="footer">Exported from UNIVAE — Cosmic Intelligence Platform</div>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

/**
 * Export raw messages as a JSON file.
 */
export function exportAsJSON(data: ExportData): void {
  const json = JSON.stringify(
    {
      title: data.title,
      model: data.model,
      mode: data.mode,
      createdAt: data.createdAt,
      exportedAt: new Date().toISOString(),
      messages: data.messages,
    },
    null,
    2
  );
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `univae-${slugify(data.title)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function basicMarkdownToHtml(text: string): string {
  return text
    // Code blocks
    .replace(/```[\w]*\n?([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Newlines
    .replace(/\n/g, "<br>");
}
