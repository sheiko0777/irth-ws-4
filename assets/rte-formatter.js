import { Component } from '@theme/component';

/**
 * A custom element that formats rte content for easier styling
 */
class RTEFormatter extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.#unescapeDoubleEncodedMarkup();
    this.querySelectorAll('table').forEach(this.#formatTable);
  }

  /**
   * Guards against rich text sources (e.g. a collection/product description
   * imported with its HTML already entity-encoded) that render as literal
   * "&lt;p&gt;...&lt;/p&gt;" text instead of parsed markup. If the element's
   * content is just escaped HTML with no real elements, decode it once and
   * re-parse it as markup.
   */
  #unescapeDoubleEncodedMarkup() {
    const raw = this.innerHTML.trim();
    if (!raw || this.children.length > 0) return;
    if (!/&lt;\s*\/?\s*[a-z][a-z0-9]*[^&]*?&gt;/i.test(raw)) return;

    const decoded = raw
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');

    this.innerHTML = decoded;
  }

  /**
   * Formats a table for easier styling
   * @param {HTMLTableElement} table
   */
  #formatTable(table) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('rte-table-wrapper');
    const parent = table.parentNode;
    if (parent) {
      parent.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  }
}

if (!customElements.get('rte-formatter')) {
  customElements.define('rte-formatter', RTEFormatter);
}
