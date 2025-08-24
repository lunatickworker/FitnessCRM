import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { 
  UserCheck, 
  Plus, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Award,
  Clock,
  Users,
  Target,
  Star,
  Briefcase
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Progress } from "./ui/progress"
import { sampleTrainers, sampleAttendance } from "../data/sampleData"

export function TrainerManagement() {
  const [trainers, setTrainers] = useState(sampleTrainers)
  const [attendance, setAttendance] = useState(sampleAttendance)
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    phone: '',
    email: '',
    employeeId: '',
    branch: '강남점',
    department: 'PT팀',
    position: '트레이너',
    specialties: [],
    certifications: [],
    experience: 0,
    salary: 0,
    workingHours: '09:00 - 18:00',
    emergencyContact: '',
    address: '',
    bankAccount: '',
    notes: ''
  })

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.phone.includes(searchTerm) ||
                         trainer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || trainer.status === statusFilter
    const matchesBranch = branchFilter === 'all' || trainer.branch === branchFilter
    return matchesSearch && matchesStatus && matchesBranch
  })

  const activeTrainers = trainers.filter(t => t.status === '재직').length
  const totalMembers = trainers.reduce((sum, trainer) => sum + trainer.assignedMembers, 0)
  const avgRating = trainers.reduce((sum, trainer) => sum + trainer.rating, 0) / trainers.length
  const totalSalary = trainers.reduce((sum, trainer) => sum + trainer.salary, 0)

  const handleAddTrainer = () => {
    const newId = Math.max(...trainers.map(t => t.id)) + 1
    const trainerToAdd = {
      ...newTrainer,
      id: newId,
      hireDate: new Date().toISOString().split('T')[0],
      status: '재직',
      assignedMembers: 0,
      rating: 0,
      profileImage: null
    }
    setTrainers([...trainers, trainerToAdd])
    setNewTrainer({
      name: '',
      phone: '',
      email: '',
      employeeId: '',
      branch: '강남점',
      department: 'PT팀',
      position: '트레이너',
      specialties: [],
      certifications: [],
      experience: 0,
      salary: 0,
      workingHours: '09:00 - 18:00',
      emergencyContact: '',
      address: '',
      bankAccount: '',
      notes: ''
    })
    setShowAddDialog(false)
  }

  const todayAttendance = attendance.filter(a => a.date === '2024-08-23')

  if (loading) {
    return (
      <div className="p-8 bg-gray-900 text-white">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4">트레이너 데이터를 로딩중입니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 bg-gray-900 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">트레이너 관리</h1>
          <p className="text-gray-400 mt-2">총 {trainers.length}명의 트레이너가 등록되어 있습니다</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              신규 트레이너 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">신규 트레이너 등록</DialogTitle>
              <DialogDescription className="text-gray-400">
                새로운 트레이너의 정보를 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white">이름</label>
                  <Input
                    value={newTrainer.name}
                    onChange={(e) => setNewTrainer({...newTrainer, name: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="트레이너 이름"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white">직원번호</label>
                  <Input
                    value={newTrainer.employeeId}
                    onChange={(e) => setNewTrainer({...newTrainer, employeeId: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="TR001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white">전화번호</label>
                  <Input
                    value={newTrainer.phone}
                    onChange={(e) => setNewTrainer({...newTrainer, phone: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="010-0000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white">이메일</label>
                  <Input
                    value={newTrainer.email}
                    onChange={(e) => setNewTrainer({...newTrainer, email: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="trainer@fitnesspro.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-white">지점</label>
                  <Select value={newTrainer.branch} onValueChange={(value) => setNewTrainer({...newTrainer, branch: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="강남점" className="text-white">강남점</SelectItem>
                      <SelectItem value="홍대점" className="text-white">홍대점</SelectItem>
                      <SelectItem value="잠실점" className="text-white">잠실점</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-white">부서</label>
                  <Select value={newTrainer.department} onValueChange={(value) => setNewTrainer({...newTrainer, department: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="PT팀" className="text-white">PT팀</SelectItem>
                      <SelectItem value="GX팀" className="text-white">GX팀</SelectItem>
                      <SelectItem value="수영팀" className="text-white">수영팀</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-white">직급</label>
                  <Select value={newTrainer.position} onValueChange={(value) => setNewTrainer({...newTrainer, position: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="수석 트레이너" className="text-white">수석 트레이너</SelectItem>
                      <SelectItem value="선임 트레이너" className="text-white">선임 트레이너</SelectItem>
                      <SelectItem value="트레이너" className="text-white">트레이너</SelectItem>
                      <SelectItem value="신입 트레이너" className="text-white">신입 트레이너</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white">경력 (년)</label>
                  <Input
                    type="number"
                    value={newTrainer.experience}
                    onChange={(e) => setNewTrainer({...newTrainer, experience: parseInt(e.target.value) || 0})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white">급여</label>
                  <Input
                    type="number"
                    value={newTrainer.salary}
                    onChange={(e) => setNewTrainer({...newTrainer, salary: parseInt(e.target.value) || 0})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="3000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-white">근무시간</label>
                <Input
                  value={newTrainer.workingHours}
                  onChange={(e) => setNewTrainer({...newTrainer, workingHours: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="09:00 - 18:00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">주소</label>
                <Input
                  value={newTrainer.address}
                  onChange={(e) => setNewTrainer({...newTrainer, address: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="주소를 입력해주세요"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">비상연락처</label>
                <Input
                  value={newTrainer.emergencyContact}
                  onChange={(e) => setNewTrainer({...newTrainer, emergencyContact: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="010-0000-0000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">계좌정보</label>
                <Input
                  value={newTrainer.bankAccount}
                  onChange={(e) => setNewTrainer({...newTrainer, bankAccount: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="은행명 계좌번호"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">메모</label>
                <Textarea
                  value={newTrainer.notes}
                  onChange={(e) => setNewTrainer({...newTrainer, notes: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="추가 정보나 특이사항"
                />
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
                onClick={handleAddTrainer}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
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
                <p className="text-sm text-gray-400">재직 트레이너</p>
                <p className="text-3xl font-bold">{activeTrainers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">담당 회원</p>
                <p className="text-3xl font-bold">{totalMembers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">평균 평점</p>
                <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">월 급여 총계</p>
                <p className="text-3xl font-bold">{Math.floor(totalSalary / 10000)}만</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="list" className="text-white">트레이너 목록</TabsTrigger>
          <TabsTrigger value="attendance" className="text-white">출근 현황</TabsTrigger>
          <TabsTrigger value="performance" className="text-white">성과 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>트레이너 목록</CardTitle>
              <CardDescription className="text-gray-400">등록된 모든 트레이너를 관리할 수 있습니다</CardDescription>
              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <Input
                    placeholder="이름, 전화번호, 이메일로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white">전체</SelectItem>
                    <SelectItem value="재직" className="text-white">재직</SelectItem>
                    <SelectItem value="휴직" className="text-white">휴직</SelectItem>
                    <SelectItem value="퇴사" className="text-white">퇴사</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="지점" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white">전체</SelectItem>
                    <SelectItem value="강남점" className="text-white">강남점</SelectItem>
                    <SelectItem value="홍대점" className="text-white">홍대점</SelectItem>
                    <SelectItem value="잠실점" className="text-white">잠실점</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">이름</TableHead>
                    <TableHead className="text-gray-300">직원번호</TableHead>
                    <TableHead className="text-gray-300">지점</TableHead>
                    <TableHead className="text-gray-300">부서/직급</TableHead>
                    <TableHead className="text-gray-300">담당회원</TableHead>
                    <TableHead className="text-gray-300">평점</TableHead>
                    <TableHead className="text-gray-300">상태</TableHead>
                    <TableHead className="text-gray-300">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainers.map((trainer) => (
                    <TableRow key={trainer.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            {trainer.name.charAt(0)}
                          </div>
                          <div>
                            <div>{trainer.name}</div>
                            <div className="text-xs text-gray-400">{trainer.phone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{trainer.employeeId}</TableCell>
                      <TableCell className="text-gray-300">{trainer.branch}</TableCell>
                      <TableCell className="text-gray-300">
                        <div>{trainer.department}</div>
                        <div className="text-xs text-gray-400">{trainer.position}</div>
                      </TableCell>
                      <TableCell className="text-gray-300 font-medium">{trainer.assignedMembers}명</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {trainer.rating.toFixed(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={trainer.status === '재직' ? 'default' : 'secondary'}
                               className={trainer.status === '재직' ? 'bg-green-600' : 'bg-gray-600'}>
                          {trainer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedTrainer(trainer)}
                                className="border-gray-600 text-white bg-transparent hover:bg-gray-700 hover:text-white"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 text-white">
                              <DialogHeader>
                                <DialogTitle className="text-white">{trainer.name} 트레이너 상세 정보</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  트레이너의 상세 정보 및 성과
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="font-medium text-white">기본 정보</h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center">
                                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                      <span className="text-gray-300">{trainer.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                      <span className="text-gray-300">{trainer.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                      <span className="text-gray-300">{trainer.address}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                      <span className="text-gray-300">입사일: {trainer.hireDate}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                      <span className="text-gray-300">근무시간: {trainer.workingHours}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <h4 className="font-medium text-white">전문 분야</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {trainer.specialties.map((specialty, index) => (
                                      <Badge key={index} variant="outline" className="border-blue-500 text-blue-300">
                                        {specialty}
                                      </Badge>
                                    ))}
                                  </div>
                                  
                                  <h4 className="font-medium text-white mt-4">자격증</h4>
                                  <div className="space-y-2">
                                    {trainer.certifications.map((cert, index) => (
                                      <div key={index} className="flex items-center">
                                        <Award className="h-4 w-4 mr-2 text-yellow-400" />
                                        <span className="text-gray-300">{cert}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="bg-gray-700 border-gray-600">
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-white">{trainer.assignedMembers}</p>
                                      <p className="text-sm text-gray-400">담당 회원</p>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card className="bg-gray-700 border-gray-600">
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-white">{trainer.experience}년</p>
                                      <p className="text-sm text-gray-400">경력</p>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card className="bg-gray-700 border-gray-600">
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-white">{trainer.rating}</p>
                                      <p className="text-sm text-gray-400">평점</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                              
                              {trainer.notes && (
                                <div className="mt-6">
                                  <h4 className="font-medium mb-2 text-white">메모</h4>
                                  <p className="text-gray-300 bg-gray-700 p-3 rounded">{trainer.notes}</p>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-gray-600 text-white bg-transparent hover:bg-gray-700 hover:text-white"
                          >
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
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>트레이너 출근 현황</CardTitle>
              <CardDescription className="text-gray-400">오늘의 출근 현황을 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">트레이너</TableHead>
                    <TableHead className="text-gray-300">출근 시간</TableHead>
                    <TableHead className="text-gray-300">퇴근 시간</TableHead>
                    <TableHead className="text-gray-300">근무 시간</TableHead>
                    <TableHead className="text-gray-300">상태</TableHead>
                    <TableHead className="text-gray-300">지점</TableHead>
                    <TableHead className="text-gray-300">메모</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAttendance.map((record) => (
                    <TableRow key={record.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{record.trainerName}</TableCell>
                      <TableCell className="text-gray-300">{record.checkIn || '-'}</TableCell>
                      <TableCell className="text-gray-300">{record.checkOut || '-'}</TableCell>
                      <TableCell className="text-gray-300">{record.workingHours}</TableCell>
                      <TableCell>
                        <Badge variant={
                          record.status === '정상' ? 'default' : 
                          record.status === '지각' ? 'secondary' : 
                          'outline'
                        } className={
                          record.status === '정상' ? 'bg-green-600' :
                          record.status === '지각' ? 'bg-yellow-600' :
                          'bg-gray-600'
                        }>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{record.location}</TableCell>
                      <TableCell className="text-gray-300">{record.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>트레이너 성과 관리</CardTitle>
              <CardDescription className="text-gray-400">트레이너별 성과 지표를 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {trainers.slice(0, 5).map((trainer) => (
                <div key={trainer.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {trainer.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{trainer.name}</h4>
                        <p className="text-sm text-gray-400">{trainer.position} • {trainer.branch}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-white font-medium">{trainer.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">담당 회원</p>
                      <p className="text-xl font-bold text-white">{trainer.assignedMembers}명</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">경력</p>
                      <p className="text-xl font-bold text-white">{trainer.experience}년</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">전문분야</p>
                      <p className="text-sm text-white">{trainer.specialties.slice(0, 2).join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">이달 평점</p>
                      <div className="flex items-center">
                        <Progress value={(trainer.rating / 5) * 100} className="flex-1 mr-2" />
                        <span className="text-sm text-white">{trainer.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}