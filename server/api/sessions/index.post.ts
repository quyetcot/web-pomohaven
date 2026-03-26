import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// Định dạng Body từ Frontend gửi lên:
// {
//   started_at: ISOString,
//   planned_duration: number (giây),
//   actual_duration: number (giây),
//   type: "deep_focus" | "learning" | "creative",
//   interruptions: [ { task_name: string, pause_duration: number, reason: string } ]
// }

export default defineEventHandler(async (event) => {
  // 1. Xác thực user (Yêu cầu phải login mới bắn lịch sử được)
  const supabase = createClient(
    process.env.SUPABASE_URL || 'https://gmmswfopjusuyixaeiqk.supabase.co',
    process.env.SUPABASE_KEY || 'sb_publishable_KQQGl39WB7sAPlF3r_9uJQ_UmQTP8Wg'
  )
  const user = { id: '00000000-0000-0000-0000-000000000000' }
  // 2. Parsed payload từ client
  const body = await readBody(event)

  try {
    // 3. Batch INSERT: Bắn data vào Supabase
    // Chúng ta tạo session_id tự sinh bằng JS để bắn được các bảng con trong 1 lần.
    const newSessionId = uuidv4()

    // Bảng lõi: pomo_sessions
    const { error: sessionError } = await supabase
      .from('pomo_sessions')
      .insert({
        id: newSessionId,
        user_id: user.id,
        task_id: body.taskId || null,
        type: body.type,
        planned_duration: body.plannedDuration,
        actual_duration: body.actualDuration,
        status: body.status,
        started_at: body.startedAt,
        created_at: new Date().toISOString()
      })

    if (sessionError) throw sessionError;

    // Bảng phụ: session_interruptions (Xao nhãng)
    if (body.interruptions && body.interruptions.length > 0) {
      const interruptionsToInsert = body.interruptions.map((inc: any) => ({
        session_id: newSessionId,
        interrupted_at: inc.interruptedAt,
        resumed_at: inc.resumedAt || null,
        duration: inc.duration,
        cause: inc.cause || 'manual_pause'
      }))

      const { error: interruptionError } = await supabase
        .from('session_interruptions')
        .insert(interruptionsToInsert)

      if (interruptionError) throw interruptionError;
    }

    return { 
      success: true, 
      message: 'Session recorded with high precision tracking.', 
      sessionId: newSessionId 
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database error',
      data: error.message
    })
  }
})
