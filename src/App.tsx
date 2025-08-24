import { useState, useEffect, useMemo } from "react"
import { AppSidebar } from "./components/AppSidebar"
import { DashboardHeader } from "./components/DashboardHeader"
import { DashboardContent } from "./components/DashboardContent"
import { MemberManagement } from "./components/MemberManagement"
import { TrainerManagement } from "./components/TrainerManagement"
import { ConsultationManagement } from "./components/ConsultationManagement"
import { PaymentManagement } from "./components/PaymentManagement"
import { AccessManagement } from "./components/AccessManagement"
import { BranchManagement } from "./components/BranchManagement"
import { Settings } from "./components/Settings"
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar"
import { api } from "./utils/api"

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedBranch, setSelectedBranch] = useState('all')
  
  // 전역 데이터 상태 관리
  const [globalData, setGlobalData] = useState({
    dashboardStats: null,
    members: [],
    trainers: [],
    consultations: [],
    payments: [],
    accessLogs: [],
    branches: [],
    users: [],
    loading: {
      dashboard: false,
      members: false,
      trainers: false,
      consultations: false,
      payments: false,
      access: false,
      branches: false,
      users: false
    }
  })

  // 데이터 prefetch 함수들
  const prefetchData = async (page: string) => {
    setGlobalData(prev => ({
      ...prev,
      loading: { ...prev.loading, [page]: true }
    }))

    try {
      switch (page) {
        case 'dashboard':
          if (!globalData.dashboardStats) {
            const [statsResponse, logsResponse] = await Promise.all([
              api.getDashboardStats(),
              api.getAccessLogs()
            ])
            setGlobalData(prev => ({
              ...prev,
              dashboardStats: statsResponse.stats,
              accessLogs: logsResponse.logs || []
            }))
          }
          break
        
        case 'members':
          if (globalData.members.length === 0) {
            const response = await api.getMembers()
            setGlobalData(prev => ({
              ...prev,
              members: response.members || []
            }))
          }
          break
        
        case 'trainers':
          if (globalData.trainers.length === 0) {
            // 트레이너 데이터는 현재 샘플 데이터 사용
            setGlobalData(prev => ({
              ...prev,
              trainers: []
            }))
          }
          break
        
        case 'consultations':
          if (globalData.consultations.length === 0) {
            // 상담 데이터는 현재 샘플 데이터 사용
            setGlobalData(prev => ({
              ...prev,
              consultations: []
            }))
          }
          break
        
        case 'payments':
          if (globalData.payments.length === 0) {
            const response = await api.getPayments()
            setGlobalData(prev => ({
              ...prev,
              payments: response.payments || []
            }))
          }
          break
        
        case 'access':
          if (globalData.accessLogs.length === 0) {
            const response = await api.getAccessLogs()
            setGlobalData(prev => ({
              ...prev,
              accessLogs: response.logs || []
            }))
          }
          break
      }
    } catch (error) {
      console.error(`데이터 로딩 오류 (${page}):`, error)
    } finally {
      setGlobalData(prev => ({
        ...prev,
        loading: { ...prev.loading, [page]: false }
      }))
    }
  }

  // 초기 대시보드 데이터 로딩
  useEffect(() => {
    prefetchData('dashboard')
  }, [])

  // 페이지 변경 시 데이터 prefetch
  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    
    // 페이지 변경과 동시에 데이터 prefetch
    const pageMap: { [key: string]: string } = {
      'dashboard': 'dashboard',
      'members': 'members',
      'trainers': 'trainers',
      'consultations': 'consultations',
      'payments': 'payments',
      'access': 'access',
      'branches': 'branches',
      'settings': 'users'
    }
    
    const dataKey = pageMap[page]
    if (dataKey) {
      prefetchData(dataKey)
    }
  }

  // 최적화된 페이지 렌더링 with 데이터 전달
  const CurrentPageComponent = useMemo(() => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardContent 
            initialStats={globalData.dashboardStats}
            initialLogs={globalData.accessLogs}
            loading={globalData.loading.dashboard}
          />
        )
      case 'members':
        return (
          <MemberManagement 
            initialMembers={globalData.members}
            loading={globalData.loading.members}
          />
        )
      case 'trainers':
        return (
          <TrainerManagement />
        )
      case 'consultations':
        return (
          <ConsultationManagement />
        )
      case 'payments':
        return (
          <PaymentManagement 
            initialPayments={globalData.payments}
            loading={globalData.loading.payments}
          />
        )
      case 'access':
        return (
          <AccessManagement 
            initialAccessLogs={globalData.accessLogs}
            loading={globalData.loading.access}
          />
        )
      case 'branches':
        return <BranchManagement />
      case 'settings':
        return <Settings />
      default:
        return (
          <DashboardContent 
            initialStats={globalData.dashboardStats}
            initialLogs={globalData.accessLogs}
            loading={globalData.loading.dashboard}
          />
        )
    }
  }, [currentPage, globalData])

  return (
    <div className="dark h-screen w-screen bg-gray-900">
      <SidebarProvider>
        <div className="flex h-full w-full bg-gray-900">
          <AppSidebar currentPage={currentPage} onPageChange={handlePageChange} />
          <SidebarInset className="flex-1 flex flex-col bg-gray-900 min-h-0">
            <DashboardHeader
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              selectedBranch={selectedBranch}
              onBranchChange={setSelectedBranch}
            />
            <main className="flex-1 overflow-y-auto bg-gray-900 min-h-0">
              {CurrentPageComponent}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}