export const generateUUID = () => {
  const cryptoObj = window.crypto || (window as any).msCrypto // 兼容性处理
  if (!cryptoObj) {
    console.warn('不支持crypto API')
    return Date.now()
  }

  const buffer = new Uint8Array(16)
  cryptoObj.getRandomValues(buffer)
  buffer[6] = (buffer[6] & 0x0f) | 0x40 // 设置版本位为4
  buffer[8] = (buffer[8] & 0x3f) | 0x80 // 设置变体位为10

  const hex = Array.from(buffer).map((b) => {
    const hex = b.toString(16).padStart(2, '0')
    return hex
  })

  return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`
}
