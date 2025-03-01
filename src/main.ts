import { bangs } from "./bang"
import './global.css'

function defaultRender() {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    app.innerHTML = `
        <div class='bse-info'>
            <svg className='' xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 240 240"> <path id="Selection" d="M 65.03,36.02 C 65.02,36.01 80.63,30.59 88.12,30.31 88.12,30.31 105.00,30.31 105.00,30.31 122.96,33.06 141.23,44.19 150.45,60.04 160.38,77.09 162.21,94.06 157.50,113.00 157.50,113.00 153.99,123.12 151.81,126.25 149.56,129.80 147.10,132.09 147.10,132.09 147.10,132.09 147.04,132.13 147.04,132.13 147.04,132.13 195.00,180.00 195.00,180.00 198.01,183.01 209.69,192.91 208.66,197.00 208.03,199.54 199.54,208.03 197.00,208.46 195.80,208.96 195.09,208.77 194.00,208.46 191.59,207.10 177.95,192.95 175.00,190.00 175.00,190.00 132.00,147.00 132.00,147.00 130.20,150.01 126.06,151.98 123.00,153.61 113.19,158.84 101.97,160.24 91.00,159.99 86.32,159.88 85.34,159.34 81.00,158.45 57.40,153.60 39.27,137.25 32.71,114.00 31.37,109.25 30.15,106.32 30.16,101.28 30.16,88.29 29.57,85.95 33.37,73.00 34.78,68.22 36.03,65.07 36.03,65.05 36.03,65.05 40.00,58.00 40.00,58.00 40.00,58.00 58.00,40.00 58.00,40.00 58.00,40.00 65.03,36.02 65.03,36.02 Z M 138.00,79.00 C 133.45,73.55 131.82,63.72 117.92,56.05 110.40,51.91 103.65,50.01 95.02,50.06 88.19,50.09 80.54,51.54 74.41,54.63 68.97,57.37 64.33,61.35 60.33,65.91 56.86,69.86 56.00,72.23 53.79,76.83 50.76,83.15 50.08,89.61 50.21,96.59 50.81,129.66 86.97,150.38 116.01,134.92 132.12,126.35 132.56,117.51 138.00,111.00 138.00,111.00 139.72,95.87 139.72,95.87 139.72,95.87 138.00,79.00 138.00,79.00 Z M 88.00,62.00 C 88.00,62.00 102.00,62.00 102.00,62.00 102.00,62.00 102.00,109.00 102.00,109.00 102.00,109.00 88.00,109.00 88.00,109.00 88.00,109.00 88.00,62.00 88.00,62.00 Z M 88.00,118.00 C 88.00,118.00 102.00,118.00 102.00,118.00 102.00,118.00 102.00,133.00 102.00,133.00 102.00,133.00 88.00,133.00 88.00,133.00 88.00,133.00 88.00,118.00 88.00,118.00 Z" /> </svg>

            <p>
                DuckDuckGo's bang redirects but more optimized.<br />
                Add the url bellow as a custom search engine to your browser. <a href='https://duckduckgo.com/bangs.html' target="_blank">List of DuckDuckGo's bangs.</a>
            </p>

            <div class='copy-url'>
                <input class='url-input' type='text' value='https://bse.gg?q=%s' readOnly />

                <button class='copy-button'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
                </button>
            </div>
        </div>
    `;

    const copyButton = app.querySelector<HTMLButtonElement>('.copy-button')!;
    const urlInput = app.querySelector<HTMLInputElement>('.url-input')!;

    copyButton.addEventListener('click', async () => {
        await navigator.clipboard.writeText(urlInput.value);
    });
}

const LS_DEFAULT_BANG = localStorage.getItem('default-bang') ?? 'g';
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get('q')?.trim() ?? '';
  if (!query) {
    defaultRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;

  const cleanQuery = query.replace(/!\S+\s*/i, '').trim();

  const searchUrl = selectedBang?.u.replace(
    '{{{s}}}', encodeURIComponent(cleanQuery).replace(/%2F/g, '/')
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();