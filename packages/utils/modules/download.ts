export const downloadJSON = (data: Record<string, any>, fileName: string) => {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json ' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
