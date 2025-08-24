import { projectId, publicAnonKey } from './supabase/info'

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-91550dad`

const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  // 회원 관리
  getMembers: () => apiRequest('/members'),
  createMember: (memberData: any) => apiRequest('/members', {
    method: 'POST',
    body: JSON.stringify(memberData),
  }),

  // 결제 관리
  getPayments: () => apiRequest('/payments'),
  createPayment: (paymentData: any) => apiRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),

  // 출입 관리
  getAccessLogs: () => apiRequest('/access-logs'),
  createAccessLog: (accessData: any) => apiRequest('/access-logs', {
    method: 'POST',
    body: JSON.stringify(accessData),
  }),

  // 대시보드 통계
  getDashboardStats: () => apiRequest('/dashboard-stats'),

  // 샘플 데이터 생성
  seedData: () => apiRequest('/seed-data', {
    method: 'POST',
  }),
}