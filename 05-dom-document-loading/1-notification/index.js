export default class NotificationMessage {
  constructor(message = 'Hello World', { duration, type } = { duration: 1000, type: 'success' }) {
    this.message = message;
    this.duration = duration; 
    this.type = type;

    this.render();
  }

  getTemplate() {
    return `
      <div class="notification" style="--value:${ this.getDuration() }s">
          <div class="timer"></div>
          <div class="inner-wrapper">
            // <div class="notification-header">Notification</div>
            <div class="notification-body">
              ${ this.message }
            </div>
          </div>
      </div>
    `;
  }

  getDuration() {
    return this.duration / 1000;
  }

  render() {
    this.show();
  }

  show(element) {
    this.element = element ? element : document.createElement('div');
    this.element.innerHTML = this.getTemplate();
    this.element.classList.add(this.type);
    
    document.body.append(this.element);

    return setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    if (this.element) { 
      return this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }
}
