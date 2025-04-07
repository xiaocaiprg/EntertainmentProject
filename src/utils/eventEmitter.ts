/**
 * 自定义事件发布订阅系统
 */

type EventCallback = (...args: any[]) => void;

interface EventSubscription {
  remove: () => void;
}

class EventEmitter {
  private listeners: Record<string, EventCallback[]> = {};

  /**
   * 添加事件监听
   * @param eventName 事件名称
   * @param callback 回调函数
   * @returns 订阅对象，可用于移除监听
   */
  addListener(eventName: string, callback: EventCallback): EventSubscription {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(callback);

    return {
      remove: () => this.removeListener(eventName, callback),
    };
  }

  /**
   * 移除特定事件监听
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  removeListener(eventName: string, callback: EventCallback): void {
    const callbacks = this.listeners[eventName];
    if (!callbacks) {
      return;
    }

    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * 移除某个事件的所有监听
   * @param eventName 事件名称
   */
  removeAllListeners(eventName: string): void {
    delete this.listeners[eventName];
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 传递给监听器的参数
   */
  emit(eventName: string, ...args: any[]): void {
    const callbacks = this.listeners[eventName];
    if (!callbacks) {
      return;
    }

    callbacks.forEach((callback) => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event listener for ${eventName}:`, error);
      }
    });
  }
}

// 导出单例实例
export const eventEmitter = new EventEmitter();

// 定义常量
export const TOKEN_EXPIRED_EVENT = 'TOKEN_EXPIRED';
