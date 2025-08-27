import { createVNode, render } from 'vue'
import Loading from './Loading.vue'

interface LoadingOptions {
  text?: string
  spinner?: 'default' | 'circle' | 'wave'
  background?: string
  fullscreen?: boolean
  lock?: boolean
  customClass?: string
  closeOnClickMask?: boolean
  onClose?: () => void
}

const loadingInstances: Record<string, HTMLElement> = {}

const createLoading = (options: LoadingOptions = {}) => {
  const id = `loading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const container = document.createElement('div')
  document.body.appendChild(container)

  const vnode = createVNode(Loading, {
    modelValue: true,
    ...options,
    onClose: () => {
      render(null, container)
      document.body.removeChild(container)
      delete loadingInstances[id]
      if (options.onClose) {
        options.onClose()
      }
    }
  })

  render(vnode, container)
  loadingInstances[id] = container

  return {
    close: () => {
      if (vnode.component) {
        vnode.component.props.modelValue = false
      }
    }
  }
}

const LoadingService = {
  show: (options: LoadingOptions = {}) => createLoading({ ...options, fullscreen: true }),
  closeAll: () => {
    Object.values(loadingInstances).forEach(container => {
      render(null, container)
      document.body.removeChild(container)
    })
    Object.keys(loadingInstances).forEach(key => {
      delete loadingInstances[key]
    })
  }
}

export default LoadingService
