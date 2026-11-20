export const pickDataProps = (props: Record<string, any> = {}) => {
  const results: Record<string, any> = {}

  for (const key in props) {
    if (key.indexOf('data-') > -1) {
      results[key] = props[key]
    }
  }

  return results
}
