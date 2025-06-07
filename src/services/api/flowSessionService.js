import flowSessionData from '../mockData/flowSessions.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class FlowSessionService {
  constructor() {
    this.sessions = [...flowSessionData]
  }

  async getAll() {
    await delay(300)
    return [...this.sessions]
  }

  async getById(id) {
    await delay(200)
    const session = this.sessions.find(s => s.id === id)
    if (!session) {
      throw new Error('Flow session not found')
    }
    return { ...session }
  }

  async create(sessionData) {
    await delay(400)
    const newSession = {
      id: Date.now().toString(),
      ...sessionData,
      startTime: sessionData.startTime || new Date().toISOString(),
      tasksCompleted: sessionData.tasksCompleted || [],
      focusScore: sessionData.focusScore || 0
    }
    this.sessions.push(newSession)
    return { ...newSession }
  }

  async update(id, updates) {
    await delay(350)
    const index = this.sessions.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Flow session not found')
    }
    
    this.sessions[index] = { ...this.sessions[index], ...updates }
    return { ...this.sessions[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.sessions.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Flow session not found')
    }
    
    this.sessions.splice(index, 1)
    return true
  }

  async getRecentSessions(limit = 10) {
    await delay(300)
    return this.sessions
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, limit)
      .map(s => ({ ...s }))
  }
}

export default new FlowSessionService()