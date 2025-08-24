import { 
  Users, 
  CreditCard, 
  DoorOpen, 
  Building, 
  Settings,
  BarChart3,
  Dumbbell,
  Activity,
  UserCheck,
  MessageSquare
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"

const menuItems = [
  {
    title: "대시보드",
    url: "#",
    icon: BarChart3,
  },
  {
    title: "회원 관리", 
    url: "#members",
    icon: Users,
  },
  {
    title: "트레이너 관리",
    url: "#trainers",
    icon: UserCheck,
  },
  {
    title: "상담 관리",
    url: "#consultations",
    icon: MessageSquare,
  },
  {
    title: "결제 관리",
    url: "#payments", 
    icon: CreditCard,
  },
  {
    title: "출입 관리",
    url: "#access",
    icon: DoorOpen,
  },
  {
    title: "지점 관리",
    url: "#branches",
    icon: Building,
  },
  {
    title: "설정",
    url: "#settings",
    icon: Settings,
  },
]

interface AppSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function AppSidebar({ currentPage, onPageChange }: AppSidebarProps) {
  return (
    <Sidebar className="bg-gray-800 border-gray-700">
      <SidebarContent className="bg-gray-800">
        <SidebarGroup>
          <div className="px-4 py-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FitnessPro</h1>
                <p className="text-xs text-gray-400">관리 시스템</p>
              </div>
            </div>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onPageChange(item.url.replace('#', '') || 'dashboard')}
                    isActive={currentPage === (item.url.replace('#', '') || 'dashboard')}
                    className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 ${
                      currentPage === (item.url.replace('#', '') || 'dashboard') 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : ''
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Footer */}
        <div className="mt-auto px-4 py-6">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">시스템 상태</span>
            </div>
            <div className="text-xs text-green-400">정상 운영중</div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}