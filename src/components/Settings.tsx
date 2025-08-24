import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Switch } from "./ui/switch"
import { 
  Users, 
  Plus,
  Edit,
  Trash2,
  Globe,
  Phone,
  Mail,
  Shield,
  Bell,
  Building
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { sampleUsers, userRoles } from "../data/sampleData"

export function Settings() {
  const [users, setUsers] = useState(sampleUsers)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '직원',
    branch: '본사'
  })
  
  const [systemSettings, setSystemSettings] = useState({
    company: {
      name: 'FitnessPro',
      phone: '02-1234-5678',
      email: 'info@fitnesspro.com',
      address: '서울시 강남구 테헤란로 123',
      website: 'https://fitnesspro.com'
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      systemAlerts: true,
      paymentAlerts: true,
      securityAlerts: true
    }
  })

  const handleAddUser = () => {
    const newId = Math.max(...users.map(u => u.id)) + 1
    const userPermissions = newUser.role === '최고관리자' ? ['모든 권한'] :
                           newUser.role === '지점관리자' ? ['회원관리', '결제관리', '출입관리'] :
                           newUser.role === '트레이너' ? ['회원관리', '출입관리'] : ['출입관리']
    
    const userToAdd = {
      ...newUser,
      id: newId,
      status: '활성',
      lastLogin: '최초 로그인 전',
      permissions: userPermissions
    }
    setUsers([...users, userToAdd])
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: '직원',
      branch: '본사'
    })
    setShowAddUserDialog(false)
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId))
  }

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSystemSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  return (
    <div className="p-8 space-y-8 bg-gray-900 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">시스템 설정</h1>
          <p className="text-gray-400 mt-2">사용자 권한 및 시스템 환경 설정</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="users" className="text-white">사용자 관리</TabsTrigger>
          <TabsTrigger value="company" className="text-white">회사 정보</TabsTrigger>
          <TabsTrigger value="security" className="text-white">보안 설정</TabsTrigger>
          <TabsTrigger value="notifications" className="text-white">알림 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">사용자 관리</h2>
              <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    사용자 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-gray-800 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>신규 사용자 추가</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      새로운 사용자 계정을 생성합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label>이름</label>
                      <Input
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="사용자 이름"
                      />
                    </div>
                    <div className="space-y-2">
                      <label>이메일</label>
                      <Input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="user@fitnesspro.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label>비밀번호</label>
                      <Input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="최소 8자 이상"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label>역할</label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {userRoles.map(role => (
                              <SelectItem key={role.value} value={role.value} className="text-white">
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label>소속 지점</label>
                        <Select value={newUser.branch} onValueChange={(value) => setNewUser({...newUser, branch: value})}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="본사" className="text-white">본사</SelectItem>
                            <SelectItem value="강남점" className="text-white">강남점</SelectItem>
                            <SelectItem value="홍대점" className="text-white">홍대점</SelectItem>
                            <SelectItem value="잠실점" className="text-white">잠실점</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddUserDialog(false)}
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      취소
                    </Button>
                    <Button 
                      onClick={handleAddUser}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      추가
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>등록된 사용자</CardTitle>
                <CardDescription className="text-gray-400">시스템에 등록된 모든 사용자 목록</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">이름</TableHead>
                      <TableHead className="text-gray-300">이메일</TableHead>
                      <TableHead className="text-gray-300">역할</TableHead>
                      <TableHead className="text-gray-300">소속</TableHead>
                      <TableHead className="text-gray-300">권한</TableHead>
                      <TableHead className="text-gray-300">최근 로그인</TableHead>
                      <TableHead className="text-gray-300">상태</TableHead>
                      <TableHead className="text-gray-300">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-gray-700">
                        <TableCell className="font-medium text-white">{user.name}</TableCell>
                        <TableCell className="text-gray-300">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === '최고관리자' ? 'default' : 'secondary'}
                                 className={user.role === '최고관리자' ? 'bg-red-600' : 
                                           user.role === '지점관리자' ? 'bg-blue-600' :
                                           user.role === '트레이너' ? 'bg-green-600' : 'bg-gray-600'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{user.branch}</TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.slice(0, 2).map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
                                {permission}
                              </Badge>
                            ))}
                            {user.permissions.length > 2 && (
                              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                                +{user.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm">{user.lastLogin}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === '활성' ? 'default' : 'secondary'}
                                 className={user.status === '활성' ? 'bg-green-600' : 'bg-gray-600'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-700">
                              <Edit className="h-3 w-3" />
                            </Button>
                            {user.role !== '최고관리자' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="company">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>회사 정보</CardTitle>
              <CardDescription className="text-gray-400">회사 기본 정보를 설정합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      회사명
                    </label>
                    <Input
                      value={systemSettings.company.name}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      대표 전화
                    </label>
                    <Input
                      value={systemSettings.company.phone}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      대표 이메일
                    </label>
                    <Input
                      value={systemSettings.company.email}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label>회사 주소</label>
                    <Textarea
                      value={systemSettings.company.address}
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      웹사이트
                    </label>
                    <Input
                      value={systemSettings.company.website}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>보안 설정</CardTitle>
              <CardDescription className="text-gray-400">시스템 보안 관련 설정을 관리합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      세션 타임아웃 (분)
                    </label>
                    <Input
                      type="number"
                      defaultValue="30"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label>비밀번호 만료 기간 (일)</label>
                    <Input
                      type="number"
                      defaultValue="90"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label>최대 로그인 시도 횟수</label>
                    <Input
                      type="number"
                      defaultValue="5"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label>2단계 인증 활성화</label>
                    <Switch />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription className="text-gray-400">시스템 알림 및 메시지 설정을 관리합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>이메일 알림</span>
                  </div>
                  <Switch
                    checked={systemSettings.notifications.emailAlerts}
                    onCheckedChange={(checked) => updateNotificationSetting('emailAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>SMS 알림</span>
                  </div>
                  <Switch
                    checked={systemSettings.notifications.smsAlerts}
                    onCheckedChange={(checked) => updateNotificationSetting('smsAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    <span>시스템 알림</span>
                  </div>
                  <Switch
                    checked={systemSettings.notifications.systemAlerts}
                    onCheckedChange={(checked) => updateNotificationSetting('systemAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>결제 관련 알림</span>
                  <Switch
                    checked={systemSettings.notifications.paymentAlerts}
                    onCheckedChange={(checked) => updateNotificationSetting('paymentAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>보안 알림</span>
                  <Switch
                    checked={systemSettings.notifications.securityAlerts}
                    onCheckedChange={(checked) => updateNotificationSetting('securityAlerts', checked)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}