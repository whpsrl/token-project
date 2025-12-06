import { supabase } from '../supabase'

const AIRDROP_TASKS = [
  { type: 'email', points: 500, label: 'Email verificata + Wallet' },
  { type: 'twitter', points: 150, label: 'Segui @FreeppleToken su X' },
  { type: 'like', points: 50, label: 'Like al post fissato' },
  { type: 'retweet', points: 100, label: 'Retweet post fissato' },
  { type: 'telegram', points: 200, label: 'Telegram + Verifica Bot' },
]

export async function getAirdropProgress(userId: string) {
  const { data: tasks, error } = await supabase
    .from('airdrop_tasks')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error

  const completedTasks = tasks?.filter(t => t.completed) || []
  const totalPoints = completedTasks.reduce((sum, t) => sum + t.points, 0)

  return {
    tasks: AIRDROP_TASKS.map(task => {
      const userTask = tasks?.find(t => t.task_type === task.type)
      return {
        ...task,
        completed: userTask?.completed || false,
        verified_at: userTask?.verified_at
      }
    }),
    totalPoints,
    maxPoints: 1000,
    completed: totalPoints >= 1000
  }
}

export async function completeAirdropTask(userId: string, taskType: string) {
  const task = AIRDROP_TASKS.find(t => t.type === taskType)
  if (!task) throw new Error('Task non trovato')

  const { data, error } = await supabase
    .from('airdrop_tasks')
    .upsert({
      user_id: userId,
      task_type: taskType,
      completed: true,
      points: task.points,
      verified_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,task_type'
    })

  if (error) throw error
  return data
}

