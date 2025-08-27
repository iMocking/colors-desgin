import { createVNode, render } from 'vue'
import Notification from './Notification.vue'

type NotificationType = 'success' | 'warning' | 'error' | 'info'
type NotificationPlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

interface NotificationOptions {
  type?: NotificationType
  title?: string
  message?: string
  duration?: number
  showIcon?: boolean
  showClose?: boolean
  placement?: NotificationPlacement
  onClose?: () => void
}

const notifications: Record<string, HTMLElement> = {}

const createNotification = (options: NotificationOptions) => {
  const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const container = document.createElement('div')
  document.body.appendChild(container)

  const vnode = createVNode(Notification, {
    ...options,
    onClose: () => {
      render(null, container)
      document.body.removeChild(container)
      delete notifications[id]
      if (options.onClose) {
        options.onClose()
      }
    }
  })

  render(vnode, container)
  notifications[id] = container

  return {
    close: () => {
      if (vnode.component) {
        vnode.component.exposed?.close()
      }
    }
  }
}

const NotificationManager = {
  open: (options: NotificationOptions) => createNotification(options),
  success: (options: Omit<NotificationOptions, 'type'>) => createNotification({ ...options, type: 'success' }),
  warning: (options: Omit<NotificationOptions, 'type'>) => createNotification({ ...options, type: 'warning' }),
  error: (options: Omit<NotificationOptions, 'type'>) => createNotification({ ...options, type: 'error' }),
  info: (options: Omit<NotificationOptions, 'type'>) => createNotification({ ...options, type: 'info' }),
  closeAll: () => {
    Object.values(notifications).forEach(container => {
      render(null, container)
      document.body.removeChild(container)
    })
    Object.keys(notifications).forEach(key => {
      delete notifications[key]
    })
  }
}

export default NotificationManager
