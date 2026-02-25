export function logLoginSuccess(userId: string) {
  const msg = `[${new Date().toISOString()}] login_success user=${userId}`
  try { append(msg) } catch {}
  console.info(msg)
}

export function logSequenceVerified(userId: string, sequence: string) {
  const msg = `[${new Date().toISOString()}] sequence_verified user=${userId} seq=${sequence}`
  try { append(msg) } catch {}
  console.info(msg)
}

export function logPlatformAccess(userId: string) {
  const msg = `[${new Date().toISOString()}] platform_access user=${userId}`
  try { append(msg) } catch {}
  console.info(msg)
}

function append(msg: string) {
  try {
    const k = "access_logs"
    const raw = localStorage.getItem(k)
    const arr = raw ? JSON.parse(raw) : []
    arr.unshift(msg)
    localStorage.setItem(k, JSON.stringify(arr.slice(0, 200)))
  } catch {}
}

export default { logLoginSuccess, logSequenceVerified, logPlatformAccess }
