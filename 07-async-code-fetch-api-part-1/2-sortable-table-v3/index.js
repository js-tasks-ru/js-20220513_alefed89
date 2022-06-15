import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  subElements = {};
  element;
  quantity = 10;
  from = 1;
  to = this.quantity + this.from;

  constructor(headersConfig, {
    url = '',
    sorted = {
      id: 'title',
      order: 'desc'
    },
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = [];
    this.sorted = sorted;
    this.url = url ? new URL(url, BACKEND_URL) : url;

    this.onScroll = this.onScroll.bind(this);
    this.isSortLocally = false;
  
    this.render();
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSort.bind(this));
    window.addEventListener('scroll', this.onScroll);
  }

  onSort(e) {
    const currentCol = e.target.closest('[data-sortable="true"]');

    if (currentCol) {
      const { order, id } = currentCol.dataset;
      const newOrder = order === 'asc' ? 'desc' : 'asc';

      currentCol.dataset.order = newOrder;
      currentCol.append(this.subElements.arrow);

      if (this.isSortLocally) {
        this.sortOnClient(id, newOrder);
      } else {
        this.sortOnServer(id, newOrder);
      }
    }
  }

  async onScroll() {
    const { bottom } = this.element.getBoundingClientRect();
    const { clientHeight } = document.documentElement;
    const { id, order } = this.sorted;

    if (bottom < clientHeight && !this.isSortLocally) {
      try {
        this.loading = true;

        this.from = this.to;
        this.to = this.to + this.quantity;
  
        const data = await this.loadData(id, order, this.from, this.to);  
        this.update(data);
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    }
  }

  update(data) {
    this.data = data;
    const element = document.createElement('div');
    element.innerHTML = this.getBodyTemplate(data);
    this.subElements.body.append(element.firstElementChild);
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll("[data-element]");

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
    
        ${ this.getBody(data) }  
    
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
    
      </div>
    </div>
    `;
  }

  getHeaderTemplate() {
    const headerTemplate = [];

    for (const col of this.headersConfig) {
      const order = this.sorted.id === col.id ? this.sorted.order : 'asc';

      headerTemplate.push(`
      <div class="sortable-table__cell" data-id="${ col.id }" data-sortable="${ col.sortable }" data-order="${ order }">
        <span>${ col.title }</span>
        ${ col.id === this.sorted.id 
    ? '<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>' 
    : ''}
      </div>`
      );
     
    }
    return headerTemplate.join('');
  }

  getBody(data) {
    return `<div data-element="body" class="sortable-table__body">
              ${ this.getBodyTemplate(data) }  
            </div>`;
  }

  getBodyTemplate(data = this.data) {
    const bodyTemplate = [];
    for (const item of data) {
      bodyTemplate.push(`
        <a href="/products/${ item.id }" class="sortable-table__row">
          ${this.getBodyRow(item)}
        </a>
        `);
    }
    return bodyTemplate.join('');
  }

  getBodyRow(item) {
    const body = [];

    this.headersConfig.forEach(({ id, template }) => {
      body.push(template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`);
    });
    return body.join('');
  }

  render() {
    const { order, id } = this.sorted;

    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
    this.initEventListeners();

    if (this.isSortLocally) {
      this.sortOnClient(id, order);
    } else {
      this.sortOnServer(id, order);
    }
  }

  async loadData(id, order, from, to) {
    try {
      this.url.searchParams.set('_sort', id);
      this.url.searchParams.set('_order', order);
      this.url.searchParams.set('_start', from);
      this.url.searchParams.set('_end', to);

      const response = await fetchJson(this.url);
      return response;
    } catch (e) {
      console.error(e);
    }
  }

  async sortOnServer(id, order) {
    this.from = this.to;
    this.to = this.to + this.quantity;

    const data = await this.loadData(id, order, this.from, this.to);  
    
    this.subElements.body.innerHTML = this.getBodyTemplate(data);
  }

  sortOnClient (id, order) {
    const sortedData = this.sortData(id, order);
    this.subElements.body.innerHTML = this.getBodyTemplate(sortedData);
  }

  sortData(field, order) {
    const sortedArr = [...this.data];
    const col = this.headersConfig.find(item => item.id === field);
    
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
    window.removeEventListener('scroll', this.onScroll);
    this.element = null;
    this.subElements = {};
  }
}
