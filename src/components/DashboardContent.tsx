import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts'
import { 
  Users, 
  UserPlus, 
  Activity, 
  TrendingUp, 
  Dumbbell,
  Clock,
  Target,
  Zap,
  CalendarDays,
  Trophy,
  Heart,
  Timer
} from "lucide-react"
import { api } from "../utils/api"

const workoutStats = [
  { activity: '러닝', percentage: 78, icon: '🏃', color: '#00D2FF' },
  { activity: '사이클링', percentage: 65, icon: '🚴', color: '#FF6B6B' },
  { activity: '웨이트', percentage: 85, icon: '🏋️', color: '#4ECDC4' },
]

const weeklyProgress = [
  { day: '월', value: 85 },
  { day: '화', value: 92 },
  { day: '수', value: 78 },
  { day: '목', value: 88 },
  { day: '금', value: 95 },
  { day: '토', value: 75 },
  { day: '일', value: 82 },
]

const CircularProgress = ({ percentage, size = 80, strokeWidth = 8, color = "#00D2FF" }: {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-white">{percentage}%</span>
      </div>
    </div>
  )
}

const StatCard = ({ icon: Icon, title, value, subtitle, trend, bgGradient }: {
  icon: any
  title: string
  value: string | number
  subtitle: string
  trend?: string
  bgGradient: string
}) => (
  <Card className={`border-none shadow-lg ${bgGradient} text-white relative overflow-hidden`}>
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-white/80" />
            <span className="text-sm text-white/80 uppercase tracking-wide">{title}</span>
          </div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-white/70">{subtitle}</div>
          {trend && (
            <div className="text-xs text-green-300">↗ {trend}</div>
          )}
        </div>
        <div className="text-white/20 text-6xl absolute -top-2 -right-2">
          <Icon className="h-16 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
)

interface DashboardContentProps {
  initialStats?: any
  initialLogs?: any[]
  loading?: boolean
}

export function DashboardContent({ initialStats, initialLogs = [], loading: globalLoading = false }: DashboardContentProps) {
  const [stats, setStats] = useState(initialStats || {
    totalMembers: 234,
    todayAccess: 18,
    thisMonthRevenue: 2340000
  })
  const [accessLogs, setAccessLogs] = useState(initialLogs)
  const [loading, setLoading] = useState(false)

  // initialStats가 있으면 즉시 업데이트
  useEffect(() => {
    if (initialStats) {
      setStats(initialStats)
    }
  }, [initialStats])

  // initialLogs가 있으면 즉시 업데이트
  useEffect(() => {
    if (initialLogs && initialLogs.length > 0) {
      setAccessLogs(initialLogs.slice(0, 5))
    }
  }, [initialLogs])

  // 초기 데이터가 없을 때만 fetch
  useEffect(() => {
    if (!initialStats && !globalLoading) {
      const fetchData = async () => {
        try {
          setLoading(true)
          const [statsResponse, logsResponse] = await Promise.all([
            api.getDashboardStats(),
            api.getAccessLogs()
          ])
          
          if (statsResponse.stats) {
            setStats(statsResponse.stats)
          }
          if (logsResponse.logs) {
            setAccessLogs(logsResponse.logs.slice(0, 5))
          }
        } catch (error) {
          console.error('대시보드 데이터 로딩 오류:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [initialStats, globalLoading])

  const handleSeedData = async () => {
    try {
      setLoading(true)
      await api.seedData()
      
      const [statsResponse, logsResponse] = await Promise.all([
        api.getDashboardStats(),
        api.getAccessLogs()
      ])
      
      setStats(statsResponse.stats)
      setAccessLogs(logsResponse.logs.slice(0, 5))
    } catch (error) {
      console.error('샘플 데이터 생성 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || globalLoading) {
    return (
      <div className="p-6 bg-gray-900 text-white">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4">데이터를 로딩중입니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">피트니스 대시보드</h2>
        <Button 
          onClick={handleSeedData} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          샘플 데이터 생성
        </Button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="총 회원수"
          value={stats?.totalMembers || 234}
          subtitle="등록 회원"
          trend="+12%"
          bgGradient="bg-gradient-to-br from-orange-500 to-orange-600"
        />
        <StatCard
          icon={Activity}
          title="운동중"
          value={stats?.todayAccess || 18}
          subtitle="현재 운동중"
          bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          title="수익"
          value={`₩ ${Math.floor((stats?.thisMonthRevenue || 2340000) / 10000)}만`}
          subtitle="이번 달"
          trend="+8%"
          bgGradient="bg-gradient-to-br from-teal-500 to-teal-600"
        />
        <StatCard
          icon={Target}
          title="목표 달성"
          value="94%"
          subtitle="이번 주"
          bgGradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fitness Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Cards */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">일간 목표</p>
                    <p className="text-3xl font-bold mt-2">75%</p>
                    <p className="text-sm text-gray-400">목표 달성률</p>
                  </div>
                  <CircularProgress percentage={75} color="#00D2FF" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">주간 목표</p>
                    <p className="text-3xl font-bold mt-2">60%</p>
                    <p className="text-sm text-gray-400">진행률</p>
                  </div>
                  <CircularProgress percentage={60} color="#FF6B6B" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workout Programs */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center">
                <Dumbbell className="h-5 w-5 mr-2" />
                운동 프로그램
              </h3>
              <div className="grid grid-cols-3 gap-6">
                {workoutStats.map((workout, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-2">{workout.icon}</div>
                    <div className="mb-2">
                      <CircularProgress 
                        percentage={workout.percentage} 
                        size={60} 
                        strokeWidth={6}
                        color={workout.color}
                      />
                    </div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">{workout.activity}</p>
                    <p className="text-xs text-gray-500">{workout.percentage}% 달성</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress Chart */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                주간 운동 통계
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="value" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Body Stats */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                신체 통계
              </h3>
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg width="120" height="240" viewBox="0 0 120 240" className="text-white">
                    {/* Human body silhouette */}
                    <path
                      d="M60 20 C55 20, 50 25, 50 30 C50 40, 55 45, 60 45 C65 45, 70 40, 70 30 C70 25, 65 20, 60 20 Z
                         M60 45 L60 120 M45 70 L75 70 M60 120 L45 180 M60 120 L75 180 M45 180 L45 210 M75 180 L75 210"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">BMI</span>
                  <span className="font-bold">22.1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">체지방률</span>
                  <span className="font-bold">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">근육량</span>
                  <span className="font-bold">42kg</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center">
                <Timer className="h-5 w-5 mr-2" />
                실시간 활동
              </h3>
              <div className="space-y-4">
                {accessLogs.length === 0 ? (
                  <p className="text-center text-gray-400 py-4">
                    활동 기록이 없습니다.
                  </p>
                ) : (
                  accessLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {log.memberName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{log.memberName}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(log.accessTime).toLocaleTimeString('ko-KR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={log.status === '성공' ? 'default' : 'destructive'}
                        className={log.status === '성공' ? 'bg-green-600' : ''}
                      >
                        {log.status === '성공' ? '입장' : '실패'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}