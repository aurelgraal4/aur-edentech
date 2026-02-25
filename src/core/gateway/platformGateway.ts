import access from "../access/internalAccess"
import logger from "../logger/access.log"

export async function handleLoginSuccess(user: { id: string; sequenceHash?: string }) {
  const uid = user.id
  const seq = user.sequenceHash || user.id
  try {
    const ok = await access.openInternalPlatform(uid, seq)
    if (ok) {
      logger.logLoginSuccess(uid)
      // redirect to internal app
      try { window.location.href = "/app" } catch {}
      return true
    }
  } catch {}
  return false
}

export default { handleLoginSuccess }
