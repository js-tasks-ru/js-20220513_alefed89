export default class NotificationMessage {
  static activeNotification; // позаимствовала из вашего решения

  constructor(message = '', { duration, type } = { duration: 1000, type: 'success' }) {
    this.message = message;
    this.duration = duration; 
    this.type = type;

    this.render();
  }

  getTemplate() {
    return `<div class="notification ${ this.type }" style="--value:${ this.getDuration() }s">
          <div class="timer"></div>
          <div class="inner-wrapper">
            <div class="notification-header">Notification</div>
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
    const el = document.createElement('div');
    el.innerHTML = this.getTemplate();
    this.element = el.firstElementChild;

    this.show();
  }

  show(element = document.body) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }

    element.append(this.element);

    setTimeout(() => this.remove(), this.duration);

    NotificationMessage.activeNotification = this;
  }

  remove() {
    if (this.element) { 
      return this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.activeNotification = null;
  }
}
