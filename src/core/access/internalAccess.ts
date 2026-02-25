import { supabase } from "../../supabase"
import session from "../session/internalSession"
import logger from "../logger/access.log"

export async function openInternalPlatform(userId: string, sequenceHash: string): Promise<boolean> {
  try {
    // re-validate sequence via RPC to be safe
    const { data, error } = await supabase.rpc("verify_sequence", { sequence_input: sequenceHash })
    if (error) {
      return false
    }
    if (data === true) {
      session.createSession(userId, sequenceHash)
      logger.logSequenceVerified(userId, sequenceHash)
      logger.logPlatformAccess(userId)
      return true
    }
    return false
  } catch {
    return false
  }
}

export default { openInternalPlatform }
