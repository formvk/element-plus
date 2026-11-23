export const pickDataProps = (props: Record<string, any> = {}) => {
  const results: Record<string, any> = {}

  for (const [key, value] of Object.entries(props)) {
    if (key.includes('data-')) {
      results[key] = value
    }
  }

  return results
}
