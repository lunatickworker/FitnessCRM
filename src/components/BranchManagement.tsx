import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { 
  Building, 
  Plus, 
  Eye, 
  Edit, 
  MapPin, 
  Users, 
  DollarSign, 
  Activity, 
  Phone,
  Mail,
  Clock
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { sampleBranches } from "../data/sampleData"

export function BranchManagement() {
  const [branches, setBranches] = useState(sampleBranches)
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    operatingHours: '',
    description: ''
  })

  const totalMembers = branches.reduce((sum, branch) => sum + branch.members, 0)
  const totalRevenue = branches.reduce((sum, branch) => sum + branch.revenue, 0)
  const totalVisits = branches.reduce((sum, branch) => sum + branch.todayVisits, 0)
  const operatingBranches = branches.filter(branch => branch.status === '운영중').length

  const handleAddBranch = () => {
    const newId = Math.max(...branches.map(b => b.id)) + 1
    const branchToAdd = {
      ...newBranch,
      id: newId,
      status: '준비중',
      openDate: new Date().toISOString().split('T')[0],
      members: 0,
      revenue: 0,
      todayVisits: 0,
      facilities: ['준비중'],
      staff: 0
    }
    setBranches([...branches, branchToAdd])
    setNewBranch({
      name: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
      operatingHours: '',
      description: ''
    })
    setShowAddDialog(false)
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-900 text-white">
        <div className="text-center py-12">
          <p>지점 데이터를 로딩중입니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 bg-gray-900 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">지점 관리</h1>
          <p className="text-gray-400 mt-2">전체 {branches.length}개 지점 운영 현황</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              신규 지점 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">신규 지점 등록</DialogTitle>
              <DialogDescription className="text-gray-400">
                새로운 지점의 정보를 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-white">지점명</label>
                <Input
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="예: 강남점"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">주소</label>
                <Input
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({...newBranch, address: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="예: 서울시 강남구 ..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white">전화번호</label>
                  <Input
                    value={newBranch.phone}
                    onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="02-0000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white">운영시간</label>
                  <Input
                    value={newBranch.operatingHours}
                    onChange={(e) => setNewBranch({...newBranch, operatingHours: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="06:00 - 23:00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-white">이메일</label>
                <Input
                  value={newBranch.email}
                  onChange={(e) => setNewBranch({...newBranch, email: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="branch@fitnesspro.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">지점장</label>
                <Input
                  value={newBranch.manager}
                  onChange={(e) => setNewBranch({...newBranch, manager: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="매니저 이름"
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
                onClick={handleAddBranch}
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
                <p className="text-sm text-gray-400">운영 지점</p>
                <p className="text-3xl font-bold">{operatingBranches}</p>
              </div>
              <Building className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">전체 회원</p>
                <p className="text-3xl font-bold">{totalMembers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">총 매출</p>
                <p className="text-3xl font-bold">{Math.floor(totalRevenue / 10000)}만원</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">오늘 방문</p>
                <p className="text-3xl font-bold">{totalVisits}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 지점 목록 */}
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>지점 목록</CardTitle>
          <CardDescription className="text-gray-400">전체 지점의 운영 현황을 확인할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">지점명</TableHead>
                <TableHead className="text-gray-300">주소</TableHead>
                <TableHead className="text-gray-300">지점장</TableHead>
                <TableHead className="text-gray-300">회원수</TableHead>
                <TableHead className="text-gray-300">월매출</TableHead>
                <TableHead className="text-gray-300">상태</TableHead>
                <TableHead className="text-gray-300">오늘 방문</TableHead>
                <TableHead className="text-gray-300">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id} className="border-gray-700">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      {branch.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {branch.address}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{branch.manager}</TableCell>
                  <TableCell className="text-gray-300 font-medium">{branch.members}명</TableCell>
                  <TableCell className="text-gray-300 font-medium">{branch.revenue.toLocaleString()}원</TableCell>
                  <TableCell>
                    <Badge variant={branch.status === '운영중' ? 'default' : 'secondary'}
                           className={branch.status === '운영중' ? 'bg-green-600' : 'bg-yellow-600'}>
                      {branch.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300 font-medium">{branch.todayVisits}명</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedBranch(branch)}
                            className="border-gray-600 text-white bg-transparent hover:bg-gray-700 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
                          <DialogHeader>
                            <DialogTitle className="text-white">{branch.name} 상세 정보</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              지점의 상세 정보 및 운영 현황
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="text-gray-300">{branch.address}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="text-gray-300">{branch.phone}</span>
                              </div>
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="text-gray-300">{branch.email}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="text-gray-300">{branch.operatingHours}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-300">등록 회원:</span>
                                <span className="text-white font-medium">{branch.members}명</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">직원 수:</span>
                                <span className="text-white font-medium">{branch.staff}명</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">이번 달 매출:</span>
                                <span className="text-white font-medium">{branch.revenue.toLocaleString()}원</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">오늘 방문:</span>
                                <span className="text-white font-medium">{branch.todayVisits}명</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium mb-2 text-white">시설 정보</h4>
                            <div className="flex flex-wrap gap-2">
                              {branch.facilities.map((facility, index) => (
                                <Badge key={index} variant="outline" className="border-gray-500 text-gray-300">
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          </div>
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
    </div>
  )
}