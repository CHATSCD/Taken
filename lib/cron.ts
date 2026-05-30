import cron from 'node-cron'
import { generateDueReminders, markMissedReminders } from './reminder-engine'

let started = false

export function startCronJobs(): void {
  if (started) return
  started = true

  cron.schedule('* * * * *', async () => {
    try {
      await generateDueReminders()
      await markMissedReminders()
    } catch (err) {
      console.error('[cron] reminder engine error:', err)
    }
  })

  console.log('[taken] Reminder cron job started')
}
