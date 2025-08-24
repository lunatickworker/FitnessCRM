import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// CORS 설정
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

app.use('*', logger(console.log))

// Supabase 클라이언트 설정
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// 회원 관리 API
app.get('/make-server-91550dad/members', async (c) => {
  try {
    const members = await kv.getByPrefix('member:')
    return c.json({ success: true, members })
  } catch (error) {
    console.log('Error fetching members:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.post('/make-server-91550dad/members', async (c) => {
  try {
    const memberData = await c.req.json()
    const memberId = `member:${Date.now()}`
    
    const member = {
      id: memberId,
      name: memberData.name,
      phone: memberData.phone,
      joinDate: new Date().toISOString().split('T')[0],
      membership: memberData.membership,
      status: '활성',
      lastVisit: null,
      createdAt: new Date().toISOString()
    }
    
    await kv.set(memberId, member)
    
    return c.json({ success: true, member })
  } catch (error) {
    console.log('Error creating member:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 결제 관리 API
app.get('/make-server-91550dad/payments', async (c) => {
  try {
    const payments = await kv.getByPrefix('payment:')
    return c.json({ success: true, payments })
  } catch (error) {
    console.log('Error fetching payments:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.post('/make-server-91550dad/payments', async (c) => {
  try {
    const paymentData = await c.req.json()
    const paymentId = `payment:${Date.now()}`
    
    const payment = {
      id: paymentId,
      memberName: paymentData.memberName,
      amount: paymentData.amount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentData.paymentMethod,
      status: paymentData.status || '완료',
      membershipType: paymentData.membershipType,
      createdAt: new Date().toISOString()
    }
    
    await kv.set(paymentId, payment)
    
    return c.json({ success: true, payment })
  } catch (error) {
    console.log('Error creating payment:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 출입 로그 API
app.get('/make-server-91550dad/access-logs', async (c) => {
  try {
    const logs = await kv.getByPrefix('access:')
    return c.json({ success: true, logs })
  } catch (error) {
    console.log('Error fetching access logs:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

app.post('/make-server-91550dad/access-logs', async (c) => {
  try {
    const accessData = await c.req.json()
    const logId = `access:${Date.now()}`
    
    const accessLog = {
      id: logId,
      memberName: accessData.memberName,
      accessTime: new Date().toISOString(),
      accessType: accessData.accessType,
      status: accessData.status,
      device: accessData.device,
      reason: accessData.reason || null,
      createdAt: new Date().toISOString()
    }
    
    await kv.set(logId, accessLog)
    
    return c.json({ success: true, accessLog })
  } catch (error) {
    console.log('Error creating access log:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 대시보드 통계 API
app.get('/make-server-91550dad/dashboard-stats', async (c) => {
  try {
    const members = await kv.getByPrefix('member:')
    const payments = await kv.getByPrefix('payment:')
    const accessLogs = await kv.getByPrefix('access:')
    
    // 오늘 날짜
    const today = new Date().toISOString().split('T')[0]
    
    // 통계 계산
    const totalMembers = members.length
    const activeMembers = members.filter(m => m.status === '활성').length
    const todayAccess = accessLogs.filter(log => log.accessTime.startsWith(today)).length
    const thisMonthRevenue = payments
      .filter(p => p.paymentDate.startsWith(today.substring(0, 7)))
      .reduce((sum, p) => sum + p.amount, 0)
    
    const stats = {
      totalMembers,
      activeMembers,
      todayAccess,
      thisMonthRevenue,
      newMembersThisWeek: 12, // 임시 데이터
      attendanceRate: Math.round((todayAccess / activeMembers) * 100) || 0
    }
    
    return c.json({ success: true, stats })
  } catch (error) {
    console.log('Error fetching dashboard stats:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// 샘플 데이터 생성 (개발용)
app.post('/make-server-91550dad/seed-data', async (c) => {
  try {
    // 샘플 회원 데이터
    const sampleMembers = [
      { name: '김민수', phone: '010-1234-5678', membership: 'VIP' },
      { name: '이수진', phone: '010-2345-6789', membership: '일반' },
      { name: '박준호', phone: '010-3456-7890', membership: 'PT' },
      { name: '최유리', phone: '010-4567-8901', membership: 'VIP' }
    ]
    
    // 샘플 결제 데이터
    const samplePayments = [
      { memberName: '김민수', amount: 89000, paymentMethod: '카드', membershipType: 'VIP 월회원권' },
      { memberName: '이수진', amount: 59000, paymentMethod: '카드', membershipType: '일반 월회원권' },
      { memberName: '박준호', amount: 120000, paymentMethod: '현금', membershipType: 'PT 10회권' },
      { memberName: '최유리', amount: 89000, paymentMethod: '카드', membershipType: 'VIP 월회원권' }
    ]
    
    // 샘플 출입 로그 데이터
    const sampleAccessLogs = [
      { memberName: '김민수', accessType: 'QR', status: '성공', device: 'QR 스캐너 #1' },
      { memberName: '이수진', accessType: 'QR', status: '성공', device: 'QR 스캐너 #2' },
      { memberName: '박준호', accessType: 'QR', status: '실패', device: 'QR 스캐너 #1', reason: '만료된 이용권' },
      { memberName: '최유리', accessType: 'Suprema', status: '성공', device: 'Suprema 단말기 #1' }
    ]
    
    // 데이터 저장
    for (const member of sampleMembers) {
      const memberId = `member:${Date.now()}_${Math.random()}`
      await kv.set(memberId, {
        id: memberId,
        ...member,
        joinDate: new Date().toISOString().split('T')[0],
        status: '활성',
        lastVisit: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      })
    }
    
    for (const payment of samplePayments) {
      const paymentId = `payment:${Date.now()}_${Math.random()}`
      await kv.set(paymentId, {
        id: paymentId,
        ...payment,
        paymentDate: new Date().toISOString().split('T')[0],
        status: '완료',
        createdAt: new Date().toISOString()
      })
    }
    
    for (const accessLog of sampleAccessLogs) {
      const logId = `access:${Date.now()}_${Math.random()}`
      await kv.set(logId, {
        id: logId,
        ...accessLog,
        accessTime: new Date().toISOString(),
        createdAt: new Date().toISOString()
      })
    }
    
    return c.json({ success: true, message: '샘플 데이터가 생성되었습니다' })
  } catch (error) {
    console.log('Error seeding data:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

Deno.serve(app.fetch)