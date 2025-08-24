import { CalendarDays, MapPin, Bell, User } from "lucide-react"
import { Button } from "./ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useState } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface DashboardHeaderProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  selectedBranch: string
  onBranchChange: (branch: string) => void
}

export function DashboardHeader({ 
  selectedDate, 
  onDateChange, 
  selectedBranch, 
  onBranchChange 
}: DashboardHeaderProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const branches = [
    { value: "all", label: "전체 지점" },
    { value: "gangnam", label: "강남점" },
    { value: "hongdae", label: "홍대점" },
    { value: "jamsil", label: "잠실점" },
    { value: "sinchon", label: "신촌점" }
  ]

  return (
    <div className="flex items-center justify-between p-6 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white">피트니스 관리 시스템</h1>
        <div className="text-sm text-gray-400">
          실시간 모니터링 대시보드
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* 날짜 선택 */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-[200px] justify-start bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  onDateChange(date)
                  setIsCalendarOpen(false)
                }
              }}
              initialFocus
              className="text-white"
            />
          </PopoverContent>
        </Popover>

        {/* 지점 선택 */}
        <Select value={selectedBranch} onValueChange={onBranchChange}>
          <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
            <MapPin className="mr-2 h-4 w-4" />
            <SelectValue placeholder="지점 선택" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {branches.map((branch) => (
              <SelectItem 
                key={branch.value} 
                value={branch.value}
                className="text-white hover:bg-gray-700"
              >
                {branch.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 알림 */}
        <Button 
          variant="ghost" 
          size="icon"
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <Bell className="h-5 w-5" />
        </Button>

        {/* 사용자 프로필 */}
        <Button 
          variant="ghost" 
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <User className="mr-2 h-4 w-4" />
          관리자
        </Button>
      </div>
    </div>
  )
}