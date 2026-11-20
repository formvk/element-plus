import { onBeforeUnmount, onMounted } from 'vue'
import type { Ref } from 'vue'

type EventType = MouseEvent | TouchEvent

type TargetElement = HTMLElement | Element | Document | Window

type BasicTarget<T extends TargetElement = TargetElement> = Ref<T | null | undefined> | T | null | (() => T | null)

function getTargetElement(target?: BasicTarget, defaultElement?: TargetElement): TargetElement | undefined | null {
  if (!target) return defaultElement
  let targetElement: TargetElement | undefined | null

  if (typeof target === 'function') {
    targetElement = target()
  } else if (typeof target === 'object' && 'value' in target) {
    targetElement = target.value
  } else {
    targetElement = target as TargetElement
  }

  return targetElement
}

export const useClickAway = (
  onClickAway: (event: EventType) => void,
  target: BasicTarget | BasicTarget[],
  eventName: string = 'click'
) => {
  const handler = (event: EventType) => {
    const targets = Array.isArray(target) ? target : [target]
    if (
      targets.some(targetItem => {
        const targetElement = getTargetElement(targetItem) as HTMLElement
        return !targetElement || targetElement?.contains(event.target as Node)
      })
    ) {
      return
    }
    onClickAway(event)
  }

  onMounted(() => {
    document.addEventListener(eventName, handler as EventListener)
  })

  onBeforeUnmount(() => {
    document.removeEventListener(eventName, handler as EventListener)
  })
}
