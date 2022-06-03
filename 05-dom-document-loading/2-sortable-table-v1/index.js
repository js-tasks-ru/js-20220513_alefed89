export default class SortableTable {
  subElements = {};
  element;
  directions = {
    asc: 1,
    desc: -1,
  };

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  getTemplate() {
    return `
     <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
    
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${ this.getHeaderTemplate() }  
        </div>
    
        <div data-element="body" class="sortable-table__body">
          ${ this.getBodyTemplate() }  
        </div>
    
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
    
      </div>
    </div>
    `;
  }

  getImageURL(item) {
    return item ?? item.images[0].url;
  }

  getHeaderTemplate() {
    const headerTemplate = [];

    for (const col of this.headerConfig) {
      headerTemplate.push(`
      <div class="sortable-table__cell" data-id="${ col.id }" data-sortable="${ col.sortable }" data-order="">
        <span>${ col.title }</span>
      </div>`
      );
    }
    return headerTemplate.join('');
  }

  getBodyTemplate(data = [...this.data]) {
    const bodyTemplate = [];
    for (const item of data) {
      bodyTemplate.push(`
        <a href="/products/${ item.id }" class="sortable-table__row">
          ${this.getBody(item)}
        </a>
        `);
    }
    return bodyTemplate.join('');
  }

  getBody(item) {
    const body = [];

    this.headerConfig.forEach(({ id, template }) => {
      body.push(template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`);
    });
    return body.join('');
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements();
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);

    const allCols = document.querySelectorAll('.sortable-table__cell[data-id]');
    const currentCol = document.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    for (const c of allCols) {
      c.dataset.order = '';
    }

    currentCol.dataset.order = order;

    this.subElements.body.innerHTML = this.getBodyTemplate(sortedData);
  }

  sortData(field, order) {
    const sorted = [...this.data];
    const col = this.headerConfig.find(item => item.id === field);
    
    return sorted.sort((a, b) => {
      switch (col.sortType) {
      case 'number':
        return this.directions[order] * (a[field] - b[field]);
      case 'string':
        return this.directions[order] * a[field].localeCompare(b[field], ['ru', 'en'], { caseFirst: 'upper'});
      }
    });
  }

  remove() {
    if (this.element) { 
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    // this.element = null;
    // this.subElements = {};
  }
}