import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  MessageSquare,
  Plus,
  Eye,
  Search,
  Calendar,
  Clock,
  User,
  Target,
  TrendingUp,
  FileText,
  Star,
  Filter
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { sampleConsultations, sampleTrainers, sampleMembers } from "../data/sampleData"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export function ConsultationManagement() {
  const [consultations, setConsultations] = useState(sampleConsultations)
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [trainerFilter, setTrainerFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const [newConsultation, setNewConsultation] = useState({
    memberId: '',
    memberName: '',
    trainerId: '',
    trainerName: '',
    consultationDate: new Date().toISOString().split('T')[0],
    consultationTime: '14:00',
    duration: 30,
    type: '정기상담',
    category: '운동상담',
    goals: '',
    currentStatus: '',
    exerciseProgram: '',
    dietAdvice: '',
    nextAppointment: '',
    notes: '',
    satisfaction: 5,
    followUpRequired: false
  })

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.trainerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTrainer = trainerFilter === 'all' || consultation.trainerId.toString() === trainerFilter
    const matchesType = typeFilter === 'all' || consultation.type === typeFilter
    const matchesDate = dateFilter === 'all' ||
      (dateFilter === 'today' && consultation.consultationDate === new Date().toISOString().split('T')[0]) ||
      (dateFilter === 'week' && new Date(consultation.consultationDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    return matchesSearch && matchesTrainer && matchesType && matchesDate
  })

  // 통계 계산
  const totalConsultations = consultations.length
  const todayConsultations = consultations.filter(c => c.consultationDate === new Date().toISOString().split('T')[0]).length
  const avgSatisfaction = consultations.reduce((sum, c) => sum + c.satisfaction, 0) / consultations.length
  const followUpRequired = consultations.filter(c => c.followUpRequired).length

  // 차트 데이터
  const consultationTypes = consultations.reduce((acc, consultation) => {
    acc[consultation.type] = (acc[consultation.type] || 0) + 1
    return acc
  }, {} as { [key: string]: number })

  const typeChartData = Object.entries(consultationTypes).map(([type, count]) => ({
    type,
    count,
    percentage: Math.round((count / totalConsultations) * 100)
  }))

  const trainerStats = sampleTrainers.map(trainer => {
    const trainerConsultations = consultations.filter(c => c.trainerId === trainer.id)
    const avgRating = trainerConsultations.length > 0
      ? trainerConsultations.reduce((sum, c) => sum + c.satisfaction, 0) / trainerConsultations.length
      : 0
    return {
      name: trainer.name,
      consultations: trainerConsultations.length,
      avgRating: avgRating,
      followUps: trainerConsultations.filter(c => c.followUpRequired).length
    }
  })

  const handleAddConsultation = () => {
    const newId = Math.max(...consultations.map(c => c.id)) + 1
    const consultationToAdd = {
      ...newConsultation,
      id: Date.now(), // 고유 ID 생성
      memberId: Number(newConsultation.memberId), // string을 number로 변환
      trainerId: Number(newConsultation.trainerId), // string을 number로 변환
      goals: newConsultation.goals.split(',').map(g => g.trim()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: []
    }
    setConsultations([...consultations, consultationToAdd])
    setNewConsultation({
      memberId: '',
      memberName: '',
      trainerId: '',
      trainerName: '',
      consultationDate: new Date().toISOString().split('T')[0],
      consultationTime: '14:00',
      duration: 30,
      type: '정기상담',
      category: '운동상담',
      goals: '',
      currentStatus: '',
      exerciseProgram: '',
      dietAdvice: '',
      nextAppointment: '',
      notes: '',
      satisfaction: 5,
      followUpRequired: false
    })
    setShowAddDialog(false)
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-900 text-white">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4">상담 데이터를 로딩중입니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 bg-gray-900 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">상담 관리</h1>
          <p className="text-gray-400 mt-2">총 {consultations.length}건의 상담 기록이 있습니다</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              상담 기록 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">상담 기록 추가</DialogTitle>
              <DialogDescription className="text-gray-400">
                새로운 상담 기록을 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white">회원</label>
                  <Select value={newConsultation.memberId} onValueChange={(value) => {
                    const member = sampleMembers.find(m => m.id.toString() === value)
                    setNewConsultation({
                      ...newConsultation,
                      memberId: value,
                      memberName: member?.name || ''
                    })
                  }}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="회원 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {sampleMembers.map(member => (
                        <SelectItem key={member.id} value={member.id.toString()} className="text-white">
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-white">트레이너</label>
                  <Select value={newConsultation.trainerId} onValueChange={(value) => {
                    const trainer = sampleTrainers.find(t => t.id.toString() === value)
                    setNewConsultation({
                      ...newConsultation,
                      trainerId: value,
                      trainerName: trainer?.name || ''
                    })
                  }}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="트레이너 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {sampleTrainers.map(trainer => (
                        <SelectItem key={trainer.id} value={trainer.id.toString()} className="text-white">
                          {trainer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-white">상담 날짜</label>
                  <Input
                    type="date"
                    value={newConsultation.consultationDate}
                    onChange={(e) => setNewConsultation({ ...newConsultation, consultationDate: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white">상담 시간</label>
                  <Input
                    type="time"
                    value={newConsultation.consultationTime}
                    onChange={(e) => setNewConsultation({ ...newConsultation, consultationTime: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white">소요 시간 (분)</label>
                  <Input
                    type="number"
                    value={newConsultation.duration}
                    onChange={(e) => setNewConsultation({ ...newConsultation, duration: parseInt(e.target.value) || 30 })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white">상담 유형</label>
                  <Select value={newConsultation.type} onValueChange={(value) => setNewConsultation({ ...newConsultation, type: value })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="정기상담" className="text-white">정기상담</SelectItem>
                      <SelectItem value="체크인" className="text-white">체크인</SelectItem>
                      <SelectItem value="재등록상담" className="text-white">재등록상담</SelectItem>
                      <SelectItem value="특별상담" className="text-white">특별상담</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-white">상담 분야</label>
                  <Select value={newConsultation.category} onValueChange={(value) => setNewConsultation({ ...newConsultation, category: value })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="운동상담" className="text-white">운동상담</SelectItem>
                      <SelectItem value="다이어트상담" className="text-white">다이어트상담</SelectItem>
                      <SelectItem value="건강상담" className="text-white">건강상담</SelectItem>
                      <SelectItem value="종합상담" className="text-white">종합상담</SelectItem>
                      <SelectItem value="컨디션체크" className="text-white">컨디션체크</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-white">목표 (쉼표로 구분)</label>
                <Input
                  value={newConsultation.goals}
                  onChange={(e) => setNewConsultation({ ...newConsultation, goals: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="근육량 증가, 체지방 감소"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">현재 상태</label>
                <Input
                  value={newConsultation.currentStatus}
                  onChange={(e) => setNewConsultation({ ...newConsultation, currentStatus: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="목표 달성률 70%"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">운동 프로그램</label>
                <Textarea
                  value={newConsultation.exerciseProgram}
                  onChange={(e) => setNewConsultation({ ...newConsultation, exerciseProgram: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="권장 운동 프로그램"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">식단 조언</label>
                <Textarea
                  value={newConsultation.dietAdvice}
                  onChange={(e) => setNewConsultation({ ...newConsultation, dietAdvice: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="식단 관련 조언"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">다음 예약일</label>
                <Input
                  type="date"
                  value={newConsultation.nextAppointment}
                  onChange={(e) => setNewConsultation({ ...newConsultation, nextAppointment: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">상담 메모</label>
                <Textarea
                  value={newConsultation.notes}
                  onChange={(e) => setNewConsultation({ ...newConsultation, notes: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="상세한 상담 내용을 입력해주세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white">만족도 (1-5)</label>
                  <Select value={newConsultation.satisfaction.toString()} onValueChange={(value) => setNewConsultation({ ...newConsultation, satisfaction: parseInt(value) })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="5" className="text-white">5 - 매우 만족</SelectItem>
                      <SelectItem value="4" className="text-white">4 - 만족</SelectItem>
                      <SelectItem value="3" className="text-white">3 - 보통</SelectItem>
                      <SelectItem value="2" className="text-white">2 - 불만족</SelectItem>
                      <SelectItem value="1" className="text-white">1 - 매우 불만족</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-white">후속 조치 필요</label>
                  <Select value={newConsultation.followUpRequired.toString()} onValueChange={(value) => setNewConsultation({ ...newConsultation, followUpRequired: value === 'true' })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="false" className="text-white">불필요</SelectItem>
                      <SelectItem value="true" className="text-white">필요</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="border-gray-600 text-white bg-transparent hover:bg-gray-700 hover:text-white"
              >
                취소
              </Button>
              <Button
                onClick={handleAddConsultation}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                저장
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">총 상담 건수</p>
                <p className="text-3xl font-bold">{totalConsultations}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">오늘 상담</p>
                <p className="text-3xl font-bold">{todayConsultations}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">평균 만족도</p>
                <p className="text-3xl font-bold">{avgSatisfaction.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">후속 조치</p>
                <p className="text-3xl font-bold">{followUpRequired}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="list" className="text-white">상담 기록</TabsTrigger>
          <TabsTrigger value="analytics" className="text-white">분석 리포트</TabsTrigger>
          <TabsTrigger value="trainer-stats" className="text-white">트레이너별 통계</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>상담 기록 목록</CardTitle>
              <CardDescription className="text-gray-400">모든 상담 기록을 검색하고 관리할 수 있습니다</CardDescription>
              <div className="flex gap-4 mt-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="회원명, 트레이너명, 메모로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <Select value={trainerFilter} onValueChange={setTrainerFilter}>
                  <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="트레이너" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white">전체 트레이너</SelectItem>
                    {sampleTrainers.map(trainer => (
                      <SelectItem key={trainer.id} value={trainer.id.toString()} className="text-white">
                        {trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="상담 유형" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white">전체</SelectItem>
                    <SelectItem value="정기상담" className="text-white">정기상담</SelectItem>
                    <SelectItem value="체크인" className="text-white">체크인</SelectItem>
                    <SelectItem value="재등록상담" className="text-white">재등록상담</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[120px] bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="기간" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white">전체</SelectItem>
                    <SelectItem value="today" className="text-white">오늘</SelectItem>
                    <SelectItem value="week" className="text-white">최근 7일</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">날짜/시간</TableHead>
                    <TableHead className="text-gray-300">회원</TableHead>
                    <TableHead className="text-gray-300">트레이너</TableHead>
                    <TableHead className="text-gray-300">유형</TableHead>
                    <TableHead className="text-gray-300">분야</TableHead>
                    <TableHead className="text-gray-300">만족도</TableHead>
                    <TableHead className="text-gray-300">후속조치</TableHead>
                    <TableHead className="text-gray-300">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.map((consultation) => (
                    <TableRow key={consultation.id} className="border-gray-700">
                      <TableCell className="text-gray-300">
                        <div>
                          <div>{consultation.consultationDate}</div>
                          <div className="text-xs text-gray-400">{consultation.consultationTime}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">{consultation.memberName}</TableCell>
                      <TableCell className="text-gray-300">{consultation.trainerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-blue-500 text-blue-300">
                          {consultation.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{consultation.category}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {consultation.satisfaction}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={consultation.followUpRequired ? 'destructive' : 'secondary'}
                          className={consultation.followUpRequired ? 'bg-orange-600' : 'bg-gray-600'}>
                          {consultation.followUpRequired ? '필요' : '완료'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedConsultation(consultation)}
                              className="border-gray-600 text-white bg-transparent hover:bg-gray-700 hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl bg-gray-800 border-gray-700 text-white">
                            <DialogHeader>
                              <DialogTitle className="text-white">상담 기록 상세</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                {consultation.consultationDate} {consultation.consultationTime} 상담
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="font-medium text-white">기본 정보</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">회원:</span>
                                      <span className="text-white">{consultation.memberName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">트레이너:</span>
                                      <span className="text-white">{consultation.trainerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">상담 시간:</span>
                                      <span className="text-white">{consultation.duration}분</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">만족도:</span>
                                      <span className="text-white flex items-center">
                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                        {consultation.satisfaction}/5
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="font-medium text-white">상담 목표</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {consultation.goals.map((goal, index) => (
                                      <Badge key={index} variant="outline" className="border-green-500 text-green-300">
                                        {goal}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">현재 상태:</span>
                                      <span className="text-white">{consultation.currentStatus}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">다음 예약:</span>
                                      <span className="text-white">{consultation.nextAppointment}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-medium text-white">운동 프로그램</h4>
                                <p className="text-gray-300 bg-gray-700 p-3 rounded">{consultation.exerciseProgram}</p>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-medium text-white">식단 조언</h4>
                                <p className="text-gray-300 bg-gray-700 p-3 rounded">{consultation.dietAdvice}</p>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-medium text-white">상담 메모</h4>
                                <p className="text-gray-300 bg-gray-700 p-3 rounded leading-relaxed">{consultation.notes}</p>
                              </div>

                              {consultation.followUpRequired && (
                                <div className="bg-orange-600/20 border border-orange-500 rounded-lg p-4">
                                  <div className="flex items-center">
                                    <TrendingUp className="h-5 w-5 text-orange-400 mr-2" />
                                    <span className="text-orange-300 font-medium">후속 조치가 필요한 상담입니다</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>상담 유형별 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ type, percentage }) => `${type} (${percentage}%)`}
                      >
                        {typeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 80}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>월별 상담 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { month: '6월', count: 15 },
                      { month: '7월', count: 23 },
                      { month: '8월', count: consultations.length }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Bar dataKey="count" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trainer-stats">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>트레이너별 상담 통계</CardTitle>
              <CardDescription className="text-gray-400">각 트레이너의 상담 성과를 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainerStats.map((trainer, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {trainer.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{trainer.name}</h4>
                          <p className="text-sm text-gray-400">트레이너</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">총 상담 건수</p>
                        <p className="text-2xl font-bold text-white">{trainer.consultations}건</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">평균 만족도</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-xl font-bold text-white">{trainer.avgRating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">후속 조치 건수</p>
                        <p className="text-2xl font-bold text-white">{trainer.followUps}건</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}