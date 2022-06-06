class Tooltip {
  static tooltipInstance;

  constructor() {
    if (Tooltip.tooltipInstance) {
      return Tooltip.tooltipInstance;
    }
    Tooltip.tooltipInstance = this;

    this.onPointerOver = this.onPointerOver.bind(this);
    this.onPointerOut = this.onPointerOut.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
  }

  initialize () {
    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

  render(tooltipText) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = tooltipText;

    document.body.append(this.element);
  }

  onPointerOver(e) {
    const tooltipEl = e.target.closest('[data-tooltip]');
    if (tooltipEl) {
      this.render(tooltipEl.dataset.tooltip);
      document.addEventListener('pointermove', this.onPointerMove);
    }
  }

  onPointerOut() {
    this.remove();
    document.removeEventListener('pointermove', this.onPointerMove);
  }

  onPointerMove(e) {
    this.onMove(e);
  }

  onMove(e) {
    const shift = 5;

    const left = e.clientX + shift;
    const top = e.clientY + shift;

    this.element.style.left = left + 'px';
    this.element.style.top = top + 'px';
  }

  remove() {
    if (this.element) { 
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;

    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);
  }


}

export default Tooltip;
