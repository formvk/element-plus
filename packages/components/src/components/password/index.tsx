import { connect, mapReadPretty, useField } from '@formvk/vue'
import { ElInput } from 'element-plus'
import { computed, defineComponent } from 'vue'
import type { CSSProperties } from 'vue'

import { TextInput } from '../preview-text'

export interface IPasswordProps {
  checkStrength?: boolean
  showPassword?: boolean
}

const isNum = (c: number) => c >= 48 && c <= 57
const isLower = (c: number) => c >= 97 && c <= 122
const isUpper = (c: number) => c >= 65 && c <= 90
const isSymbol = (c: number) => !(isLower(c) || isUpper(c) || isNum(c))
const isLetter = (c: number) => isLower(c) || isUpper(c)

const getStrength = (val: string) => {
  if (!val) return 0
  let num = 0
  let lower = 0
  let upper = 0
  let symbol = 0
  let MNS = 0
  let rep = 0
  let repC = 0
  let consecutive = 0
  let sequential = 0
  const len = () => num + lower + upper + symbol
  const callme = () => {
    let re = num > 0 ? 1 : 0
    re += lower > 0 ? 1 : 0
    re += upper > 0 ? 1 : 0
    re += symbol > 0 ? 1 : 0
    if (re > 2 && len() >= 8) {
      return re + 1
    } else {
      return 0
    }
  }
  for (let i = 0; i < val.length; i++) {
    const c = val.charCodeAt(i)
    if (isNum(c)) {
      num++
      if (i !== 0 && i !== val.length - 1) {
        MNS++
      }
      if (i > 0 && isNum(val.charCodeAt(i - 1))) {
        consecutive++
      }
    } else if (isLower(c)) {
      lower++
      if (i > 0 && isLower(val.charCodeAt(i - 1))) {
        consecutive++
      }
    } else if (isUpper(c)) {
      upper++
      if (i > 0 && isUpper(val.charCodeAt(i - 1))) {
        consecutive++
      }
    } else {
      symbol++
      if (i !== 0 && i !== val.length - 1) {
        MNS++
      }
    }
    let exists = false
    for (let j = 0; j < val.length; j++) {
      if (val[i] === val[j] && i !== j) {
        exists = true
        repC += Math.abs(val.length / (j - i))
      }
    }
    if (exists) {
      rep++
      const unique = val.length - rep
      repC = unique ? Math.ceil(repC / unique) : Math.ceil(repC)
    }
    if (i > 1) {
      const last1 = val.charCodeAt(i - 1)
      const last2 = val.charCodeAt(i - 2)
      if (isLetter(c)) {
        if (isLetter(last1) && isLetter(last2)) {
          const v = val.toLowerCase()
          const vi = v.charCodeAt(i)
          const vi1 = v.charCodeAt(i - 1)
          const vi2 = v.charCodeAt(i - 2)
          if (vi - vi1 === vi1 - vi2 && Math.abs(vi - vi1) === 1) {
            sequential++
          }
        }
      } else if (isNum(c)) {
        if (isNum(last1) && isNum(last2)) {
          if (c - last1 === last1 - last2 && Math.abs(c - last1) === 1) {
            sequential++
          }
        }
      } else {
        if (isSymbol(last1) && isSymbol(last2)) {
          if (c - last1 === last1 - last2 && Math.abs(c - last1) === 1) {
            sequential++
          }
        }
      }
    }
  }
  let sum = 0
  const length = len()
  sum += 4 * length
  if (lower > 0) {
    sum += 2 * (length - lower)
  }
  if (upper > 0) {
    sum += 2 * (length - upper)
  }
  if (num !== length) {
    sum += 4 * num
  }
  sum += 6 * symbol
  sum += 2 * MNS
  sum += 2 * callme()
  if (length === lower + upper) {
    sum -= length
  }
  if (length === num) {
    sum -= num
  }
  sum -= repC
  sum -= 2 * consecutive
  sum -= 3 * sequential
  sum = sum < 0 ? 0 : sum
  sum = sum > 100 ? 100 : sum

  if (sum >= 80) {
    return 100
  } else if (sum >= 60) {
    return 80
  } else if (sum >= 40) {
    return 60
  } else if (sum >= 20) {
    return 40
  } else {
    return 20
  }
}

const blockStyle: CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  height: 8,
  top: 0,
  background: '#fff',
  width: 1,
  transform: 'translate(-50%, 0)',
}

const PasswordWrapper = defineComponent({
  name: 'Password',
  inheritAttrs: false,
  props: {
    checkStrength: Boolean,
    showPassword: { type: Boolean, default: true },
  },
  setup(props, { attrs, slots }) {
    const field = useField()
    const score = computed(() => getStrength(String(field.value ?? '')))
    return () => {
      const { class: className, ...rest } = attrs
      return (
        <span class={className as string}>
          <ElInput {...rest} type="password" showPassword={props.showPassword}>
            {slots}
          </ElInput>
          {props.checkStrength && (
            <div style={{ background: '#e0e0e0', marginBottom: 3, position: 'relative' }}>
              <div style={{ ...blockStyle, left: '20%' }} />
              <div style={{ ...blockStyle, left: '40%' }} />
              <div style={{ ...blockStyle, left: '60%' }} />
              <div style={{ ...blockStyle, left: '80%' }} />
              <div
                style={{
                  position: 'relative',
                  backgroundImage: '-webkit-linear-gradient(left, #ff5500, #ff9300)',
                  transition: 'all 0.35s ease-in-out',
                  height: 8,
                  width: `${score.value}%`,
                  marginTop: 5,
                }}
              />
            </div>
          )}
        </span>
      )
    }
  },
})

export const Password = connect(PasswordWrapper, mapReadPretty(TextInput))
