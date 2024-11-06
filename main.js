import { marked } from 'marked';

// Initialize marked with default options
marked.setOptions({
  breaks: true,
  gfm: true
});

// DOM Elements
const markdownInput = document.getElementById('markdownInput');
const htmlOutput = document.getElementById('htmlOutput');
const preview = document.getElementById('preview');
const convertBtn = document.getElementById('convertBtn');
const generateSlugBtn = document.getElementById('generateSlugBtn');
const downloadBtn = document.getElementById('downloadBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Convert Markdown to HTML
function convertToHtml(markdown) {
  try {
    const html = marked(markdown);
    htmlOutput.value = html;
    preview.innerHTML = html;
  } catch (error) {
    console.error('Conversion error:', error);
    htmlOutput.value = 'Error converting Markdown to HTML';
    preview.innerHTML = '<p>Error previewing HTML</p>';
  }
}

// Generate URL slug
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Download HTML file
function downloadHtml() {
  const html = htmlOutput.value;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'converted.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Tab switching functionality
function switchTab(event) {
  const targetTab = event.target.dataset.tab;
  
  // Update tab buttons
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === targetTab);
  });
  
  // Update tab panes
  tabPanes.forEach(pane => {
    pane.classList.toggle('active', 
      pane.id === `${targetTab}Tab`);
  });
}

// Event Listeners
convertBtn.addEventListener('click', () => {
  convertToHtml(markdownInput.value);
});

generateSlugBtn.addEventListener('click', () => {
  const slug = generateSlug(markdownInput.value);
  htmlOutput.value = slug;
  preview.innerHTML = `<p>Generated slug: ${slug}</p>`;
});

downloadBtn.addEventListener('click', downloadHtml);

// Tab switching
tabBtns.forEach(btn => {
  btn.addEventListener('click', switchTab);
});

// Real-time preview
markdownInput.addEventListener('input', () => {
  convertToHtml(markdownInput.value);
});

// Initial conversion if there's any default content
if (markdownInput.value) {
  convertToHtml(markdownInput.value);
}