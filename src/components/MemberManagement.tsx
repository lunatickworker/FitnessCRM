import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Search, Plus, Eye, Edit, Calendar, CreditCard, Activity, UserPlus, Phone } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { api } from "../utils/api"
import { sampleMembers, sampleTrainers } from "../data/sampleData"

const membershipHistory = [
  { id: 1, type: 'VIP 월회원권', startDate: '2024-08-01', endDate: '2024-08-31', status: '사용중', amount: 150000 },
  { id: 2, type: '일반 월회원권', startDate: '2024-07-01', endDate: '2024-07-31', status: '만료', amount: 80000 },
  { id: 3, type: 'PT 10회권', startDate: '2024-06-01', endDate: '2024-09-01', status: '사용중', amount: 500000 },
]

const attendanceHistory = [
  { id: 1, date: '2024-08-22', checkIn: '14:30', checkOut: '16:15', duration: '1시간 45분', program: '웨이트 트레이닝' },
  { id: 2, date: '2024-08-20', checkIn: '09:15', checkOut: '10:45', duration: '1시간 30분', program: '유산소' },
  { id: 3, date: '2024-08-18', checkIn: '18:30', checkOut: '20:00', duration: '1시간 30분', program: 'PT 수업' },
  { id: 4, date: '2024-08-16', checkIn: '13:00', checkOut: '14:30', duration: '1시간 30분', program: '요가' },
  { id: 5, date: '2024-08-14', checkIn: '19:00', checkOut: '20:45', duration: '1시간 45분', program: '크로스핏' },
]

const consultationNotes = [
  { id: 1, date: '2024-08-15', trainer: '김트레이너', note: '하체 근력 강화 프로그램 시작. 스쿼트 자세 교정 필요. 무릎 안정성 향상을 위한 운동 추가 권장.', goal: '하체 근력 강화' },
  { id: 2, date: '2024-08-01', trainer: '이트레이너', note: '체지방 감량 목표. 유산소 운동 시간 증가 권장. 식단 관리 상담 진행.', goal: '체지방 감량' },
  { id: 3, date: '2024-07-20', trainer: '박트레이너', note: '상체 근육량 증가 프로그램. 벤치프레스 중량 증가, 단백질 섭취량 조절 필요.', goal: '근육량 증가' },
]

interface MemberManagementProps {
  initialMembers?: any[]
  loading?: boolean
}

export function MemberManagement({ initialMembers = [], loading: globalLoading = false }: MemberManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [membershipFilter, setMembershipFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [members, setMembers] = useState<any[]>(initialMembers.length > 0 ? initialMembers : sampleMembers)
  const [loading, setLoading] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    email: '',
    membership: '일반',
    age: '',
    gender: '남성',
    address: '',
    emergencyContact: '',
    trainer: '배정예정'
  })

  // initialMembers가 있으면 즉시 업데이트
  useEffect(() => {
    if (initialMembers && initialMembers.length > 0) {
      setMembers(initialMembers)
    }
  }, [initialMembers])

  // 초기 데이터가 없을 때만 fetch
  useEffect(() => {
    if (initialMembers.length === 0 && !globalLoading) {
      const fetchMembers = async () => {
        try {
          setLoading(true)
          const response = await api.getMembers()
          if (response.members && response.members.length > 0) {
            setMembers(response.members)
          }
        } catch (error) {
          console.error('회원 데이터 로딩 오류:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchMembers()
    }
  }, [initialMembers, globalLoading])

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMembership = membershipFilter === 'all' || member.membership === membershipFilter
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter
    return matchesSearch && matchesMembership && matchesStatus
  })

  const handleAddMember = () => {
    const newId = Math.max(...members.map(m => m.id)) + 1
    const memberToAdd = {
      ...newMember,
      id: newId,
      joinDate: new Date().toISOString().split('T')[0],
      status: '활성',
      lastVisit: ''
    }
    setMembers([...members, memberToAdd])
    setNewMember({
      name: '',
      phone: '',
      email: '',
      membership: '일반',
      age: '',
      gender: '남성',
      address: '',
      emergencyContact: '',
      trainer: '배정예정'
    })
    setShowAddDialog(false)
  }

  if (loading || globalLoading) {
    return (
      <div className="p-8 bg-gray-900 text-white">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4">회원 데이터를 로딩중입니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 bg-gray-900 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">회원 관리</h1>
          <p className="text-gray-400 mt-2">총 {members.length}명의 회원이 등록되어 있습니다</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              신규 회원 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>신규 회원 등록</DialogTitle>
              <DialogDescription className="text-gray-400">
                새로운 회원의 정보를 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>이름</label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label>나이</label>
                  <Input
                    value={newMember.age}
                    onChange={(e) => setNewMember({...newMember, age: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label>전화번호</label>
                <Input
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <label>이메일</label>
                <Input
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>성별</label>
                  <Select value={newMember.gender} onValueChange={(value) => setNewMember({...newMember, gender: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="남성" className="text-white">남성</SelectItem>
                      <SelectItem value="여성" className="text-white">여성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label>이용권</label>
                  <Select value={newMember.membership} onValueChange={(value) => setNewMember({...newMember, membership: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="일반" className="text-white">일반</SelectItem>
                      <SelectItem value="VIP" className="text-white">VIP</SelectItem>
                      <SelectItem value="PT" className="text-white">PT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label>주소</label>
                <Input
                  value={newMember.address}
                  onChange={(e) => setNewMember({...newMember, address: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <label>비상연락처</label>
                <Input
                  value={newMember.emergencyContact}
                  onChange={(e) => setNewMember({...newMember, emergencyContact: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">담당 트레이너</label>
                <Select value={newMember.trainer} onValueChange={(value) => setNewMember({...newMember, trainer: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="트레이너 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="배정예정" className="text-white">배정예정</SelectItem>
                    {sampleTrainers.map(trainer => (
                      <SelectItem key={trainer.id} value={trainer.name} className="text-white">
                        {trainer.name} ({trainer.branch})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="border-gray-600 text-white hover:bg-gray-700">
                취소
              </Button>
              <Button onClick={handleAddMember} className="bg-blue-600 hover:bg-blue-700">
                등록
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
                <p className="text-sm text-gray-400">총 회원수</p>
                <p className="text-3xl font-bold">{members.length}</p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">활성 회원</p>
                <p className="text-3xl font-bold">{members.filter(m => m.status === '활성').length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">VIP 회원</p>
                <p className="text-3xl font-bold">{members.filter(m => m.membership === 'VIP').length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">신규 가입</p>
                <p className="text-3xl font-bold">{members.filter(m => new Date(m.joinDate).getMonth() === new Date().getMonth()).length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>회원 검색 및 필터</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="이름, 전화번호, 이메일로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <Select value={membershipFilter} onValueChange={setMembershipFilter}>
              <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="이용권 종류" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">전체</SelectItem>
                <SelectItem value="VIP" className="text-white">VIP</SelectItem>
                <SelectItem value="일반" className="text-white">일반</SelectItem>
                <SelectItem value="PT" className="text-white">PT</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">전체</SelectItem>
                <SelectItem value="활성" className="text-white">활성</SelectItem>
                <SelectItem value="휴면" className="text-white">휴면</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 회원 리스트 */}
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>회원 목록</CardTitle>
          <CardDescription className="text-gray-400">총 {filteredMembers.length}명의 회원</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">이름</TableHead>
                <TableHead className="text-gray-300">연락처</TableHead>
                <TableHead className="text-gray-300">이메일</TableHead>
                <TableHead className="text-gray-300">가입일</TableHead>
                <TableHead className="text-gray-300">이용권</TableHead>
                <TableHead className="text-gray-300">상태</TableHead>
                <TableHead className="text-gray-300">최근 방문</TableHead>
                <TableHead className="text-gray-300">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} className="border-gray-700">
                  <TableCell className="font-medium text-white">{member.name}</TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {member.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{member.email}</TableCell>
                  <TableCell className="text-gray-300">{member.joinDate}</TableCell>
                  <TableCell>
                    <Badge variant={member.membership === 'VIP' ? 'default' : 'secondary'} 
                           className={member.membership === 'VIP' ? 'bg-yellow-600' : member.membership === 'PT' ? 'bg-purple-600' : 'bg-gray-600'}>
                      {member.membership}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === '활성' ? 'default' : 'secondary'}
                           className={member.status === '활성' ? 'bg-green-600' : 'bg-red-600'}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{member.lastVisit || '미방문'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedMember(member)}
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 text-white">
                          <DialogHeader>
                            <DialogTitle>{member.name} 회원 상세 정보</DialogTitle>
                            <DialogDescription className="text-gray-400">회원의 상세 정보 및 이용 내역</DialogDescription>
                          </DialogHeader>
                          
                          <Tabs defaultValue="info" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                              <TabsTrigger value="info" className="text-white">기본 정보</TabsTrigger>
                              <TabsTrigger value="membership" className="text-white">이용권 내역</TabsTrigger>
                              <TabsTrigger value="attendance" className="text-white">출석 기록</TabsTrigger>
                              <TabsTrigger value="consultation" className="text-white">상담 기록</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="info" className="space-y-4">
                              <Card className="bg-gray-700 border-gray-600">
                                <CardHeader>
                                  <CardTitle className="text-white">기본 정보</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                      <div className="flex items-center">
                                        <span className="font-medium text-gray-300 w-24">이름:</span>
                                        <span className="text-white">{member.name}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="font-medium text-gray-300 w-24">나이:</span>
                                        <span className="text-white">{member.age}세</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="font-medium text-gray-300 w-24">성별:</span>
                                        <span className="text-white">{member.gender}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="font-medium text-gray-300 w-24">전화번호:</span>
                                        <span className="text-white">{member.phone}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center">
                                        <span className="font-medium text-gray-300 w-24">이메일:</span>
                                        <span className="text-white">{member.email}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="font-medium text-gray-300 w-24">가입일:</span>
                                        <span className="text-white">{member.joinDate}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="font-medium text-gray-300 w-24">주소:</span>
                                        <span className="text-white">{member.address}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="font-medium text-gray-300 w-24">담당트레이너:</span>
                                        <span className="text-white">{member.trainer}</span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>
                            
                            <TabsContent value="membership">
                              <Card className="bg-gray-700 border-gray-600">
                                <CardHeader>
                                  <CardTitle className="text-white">이용권 내역</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="border-gray-600">
                                        <TableHead className="text-gray-300">이용권 종류</TableHead>
                                        <TableHead className="text-gray-300">시작일</TableHead>
                                        <TableHead className="text-gray-300">종료일</TableHead>
                                        <TableHead className="text-gray-300">금액</TableHead>
                                        <TableHead className="text-gray-300">상태</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {membershipHistory.map((history) => (
                                        <TableRow key={history.id} className="border-gray-600">
                                          <TableCell className="text-white">{history.type}</TableCell>
                                          <TableCell className="text-gray-300">{history.startDate}</TableCell>
                                          <TableCell className="text-gray-300">{history.endDate}</TableCell>
                                          <TableCell className="text-gray-300">{history.amount.toLocaleString()}원</TableCell>
                                          <TableCell>
                                            <Badge variant={history.status === '사용중' ? 'default' : 'secondary'}
                                                   className={history.status === '사용중' ? 'bg-green-600' : 'bg-gray-600'}>
                                              {history.status}
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </CardContent>
                              </Card>
                            </TabsContent>
                            
                            <TabsContent value="attendance">
                              <Card className="bg-gray-700 border-gray-600">
                                <CardHeader>
                                  <CardTitle className="text-white">출석 기록</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="border-gray-600">
                                        <TableHead className="text-gray-300">날짜</TableHead>
                                        <TableHead className="text-gray-300">입장 시간</TableHead>
                                        <TableHead className="text-gray-300">퇴장 시간</TableHead>
                                        <TableHead className="text-gray-300">이용 시간</TableHead>
                                        <TableHead className="text-gray-300">이용 프로그램</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {attendanceHistory.map((record) => (
                                        <TableRow key={record.id} className="border-gray-600">
                                          <TableCell className="text-white">{record.date}</TableCell>
                                          <TableCell className="text-gray-300">{record.checkIn}</TableCell>
                                          <TableCell className="text-gray-300">{record.checkOut}</TableCell>
                                          <TableCell className="text-gray-300">{record.duration}</TableCell>
                                          <TableCell className="text-gray-300">{record.program}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </CardContent>
                              </Card>
                            </TabsContent>
                            
                            <TabsContent value="consultation">
                              <Card className="bg-gray-700 border-gray-600">
                                <CardHeader>
                                  <CardTitle className="text-white">상담 기록 및 트레이너 메모</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  {consultationNotes.map((note) => (
                                    <div key={note.id} className="p-4 border border-gray-600 rounded-lg">
                                      <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center space-x-3">
                                          <span className="font-medium text-white">{note.trainer}</span>
                                          <Badge className="bg-blue-600 text-white">{note.goal}</Badge>
                                        </div>
                                        <span className="text-sm text-gray-400">{note.date}</span>
                                      </div>
                                      <p className="text-gray-300 leading-relaxed">{note.note}</p>
                                    </div>
                                  ))}
                                </CardContent>
                              </Card>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-700">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}