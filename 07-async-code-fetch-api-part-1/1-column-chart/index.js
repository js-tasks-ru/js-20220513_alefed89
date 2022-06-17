import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    chartHeight = 50;
    subElements = {};
    data = {};
  
    constructor({ 
      label = '', 
      link = '',
      url = '',
      range = {
        from: '',
        to: '',
      }} = {}) {
      this.label = label;
      this.link = link;
      this.url = new URL(url, BACKEND_URL);
      this.range = range;
  
      this.render();
      this.update(this.range.from, this.range.to);
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
  
    getTemplate(data, total = 0) {
      return `
          <div class="column-chart" style="--chart-height: ${ this.chartHeight }">
              <div class="column-chart__title">
                  ${ this.label }
              </div>
              <div class="column-chart__container">
                  <div data-element="header" class="column-chart__header">${ total }</div>
                  <div data-element="body" class="column-chart__chart">
                      ${ this.processData(data) }
                  </div>
              </div>
          </div>
      `;
    }
  
    render() {
      const element = document.createElement('div');
      element.innerHTML = this.getTemplate();
      this.element = element.firstElementChild;

      this.subElements = this.getSubElements(this.element);
  
      this.element.querySelector('.column-chart__title').insertAdjacentHTML('beforeend', `<div class="column-chart__link">${ this.link }</div>`);
      
      if (!this.data.length) { this.element.classList.add('column-chart_loading'); }
  
      document.body.append(this.element);
    }

    async update(start, end) {
      this.element.classList.add('column-chart_loading');

      this.range.from = start;
      this.range.to = end;
  
      const data = await this.fetchData(start, end);
      const total = Object.values(data).reduce((a, b) => a + b);
      
      if (data && Object.values(data).length) {
        this.subElements.header.innerHTML = total;
        this.subElements.body.innerHTML = this.processData(data);

        this.element.classList.remove('column-chart_loading');
      }

      this.data = data;
      return this.data;
    }

    async fetchData(start, end) {
      try {
        this.url.searchParams.set('from', start);
        this.url.searchParams.set('to', end);

        const response = await fetchJson(this.url);
        return response;
      } catch (e) {
        console.error(e);
      }
    }
  
    processData(data) {
      if (!data) {
        return '';
      }
      const dataTemplate = [];
      const columnProps = this.getColumnProps(data);
      for (const num of columnProps) {
        dataTemplate.push(`<div style="--value: ${ num.value }" data-tooltip="${ num.percent }"></div>`);
      }

      return dataTemplate.join('');
    }
  
    getColumnProps(data) {
      const values = Object.values(data);

      const maxValue = Math.max(...values);
      const scale = this.chartHeight / maxValue;
    
      return values.map(item => {
        return {
          percent: (item / maxValue * 100).toFixed(0) + '%',
          value: String(Math.floor(item * scale))
        };
      });
    }
  
    remove() {
      this.element.remove();
    }
  
    destroy() {
      this.remove();
    }
}
  
