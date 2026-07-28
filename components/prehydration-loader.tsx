"use client";

import { useServerInsertedHTML } from "next/navigation";

export default function PrehydrationLoader() {
  useServerInsertedHTML(() => (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html.is-loading, body.is-loading {
              overflow: hidden !important;
            }
            #__loader-shield {
              position: fixed !important;
              inset: 0 !important;
              z-index: 9999 !important;
              background: #ffffff !important;
              pointer-events: none;
            }
          `,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            history.scrollRestoration = 'manual';
            document.documentElement.classList.add('is-loading');
            if (!document.getElementById('__loader-shield')) {
              var shield = document.createElement('div');
              shield.id = '__loader-shield';
              shield.setAttribute('aria-hidden', 'true');
              document.documentElement.appendChild(shield);
            }
          `,
        }}
      />
    </>
  ));

  return null;
}
