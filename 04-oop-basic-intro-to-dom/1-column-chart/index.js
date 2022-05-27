export default class ColumnChart {
  chartHeight = 50;

  constructor({ data, label, link, value, formatHeading } = {}) {
    this.data = data || [];
    this.label = label || '';
    this.link = link || '#';
    this.value = value || 0;
    this.formatHeading = formatHeading;

    this.element = '';

    this.render();
  }


  getTemplate() {
    return `
        <div class="column-chart" style="--chart-height: ${ this.chartHeight }">
            <div class="column-chart__title">
                ${ this.label }
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${ this.formatHeading ? this.formatHeading(this.value) : this.value }</div>
                <div data-element="body" class="column-chart__chart">
                    ${ this.data.length ? this.processData() : '' }
                </div>
            </div>
        </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    this.element.querySelector('.column-chart__title').insertAdjacentHTML('beforeend', `<div class="column-chart__link">${ this.link }</div>`);
    
    if (!this.data.length) { this.element.classList.add('column-chart_loading'); }

    return this.element;
  }

  processData() {
    const dataTemplate = [];
    const columnProps = this.getColumnProps();

    for (const num of columnProps) {
      dataTemplate.push(`<div style="--value: ${ num.value }" data-tooltip="${ num.percent }"></div>`);
    }
    return dataTemplate.join('');
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;
  
    return this.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  update(newData) {
    this.data = newData;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}
