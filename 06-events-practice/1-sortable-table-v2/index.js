export default class SortableTable {
  subElements = {};
  element;
  directions = {
    asc: 1,
    desc: -1,
  };

  constructor(headerConfig = [], { data, sorted } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSort.bind(this));
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

  getTemplate(data = []) {
    return `
     <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
    
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${ this.getHeaderTemplate() }  
        </div>
    
        <div data-element="body" class="sortable-table__body">
          ${ this.getBodyTemplate(data) }  
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
    let firstSortable = false;

    for (const col of this.headerConfig) {
      if (col.id === this.sorted.id) {
        firstSortable = true;
      }
      const order = this.sorted.id === col.id ? this.sorted.order : 'asc';

      headerTemplate.push(`
      <div class="sortable-table__cell" data-id="${ col.id }" data-sortable="${ col.sortable }" data-order="${ order }">
        <span>${ col.title }</span>
        ${ firstSortable 
    ? '<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>' 
    : ''}
      </div>`
      );
     
      firstSortable = false;
    }
    return headerTemplate.join('');
  }

  getBodyTemplate(data = this.data) {
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
    const { order, id } = this.sorted;
    const sortedData = this.sortData(id, order);

    const element = document.createElement('div');
    element.innerHTML = this.getTemplate(sortedData);
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements();
    this.initEventListeners();
  }

  onSort(e) {
    const currentCol = e.target.closest('[data-sortable="true"]');

    if (currentCol) {
      const { order, id } = currentCol.dataset;
      const newOrder = order === 'asc' ? 'desc' : 'asc';
      const sortedData = this.sortData(id, newOrder);
      const arrow = currentCol.querySelector('.sortable-table__sort-arrow');

      if (!arrow) {
        currentCol.append(this.subElements.arrow);
      }

      currentCol.dataset.order = newOrder;

      this.subElements.body.innerHTML = this.getBodyTemplate(sortedData);
    }
  }

  sortData(field, order) {
    const sortedArr = [...this.data];
    const col = this.headerConfig.find(item => item.id === field);
    
    return sortedArr.sort((a, b) => {
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
    this.element = null;
    this.subElements = {};
  }
}