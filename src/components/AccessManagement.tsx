import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { QrCode, Shield, AlertTriangle, CheckCircle, Clock, DoorOpen, Wifi, WifiOff } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { api } from "../utils/api"
import { sampleAccessLogs } from "../data/sampleData"

const suspiciousAccess = [
  {
    id: 1,
    memberName: '미등록 사용자',
    accessTime: '2024-08-23 13:45:12',
    device: 'QR 스캐너 #2',
    location: '후문 출입구',
    reason: '유효하지 않은 QR 코드',
    severity: '높음'
  },
  {
    id: 2,
    memberName: '홍길동',
    accessTime: '2024-08-23 12:30:45',
    device: 'Suprema 단말기 #1',
    location: '락커룸 출입구',
    reason: '중복 출입 시도',
    severity: '중간'
  },
  {
    id: 3,
    memberName: '박준호',
    accessTime: '2024-08-23 11:15:30',
    device: 'QR 스캐너 #1',
    location: '메인 출입구',
    reason: '만료된 이용권으로 반복 시도',
    severity: '낮음'
  }
]

const deviceStatus = [
  {
    id: 1,
    deviceName: 'QR 스캐너 #1',
    location: '메인 출입구',
    status: '정상',
    lastSync: '2024-08-23 14:30:00',
    todayCount: 145,
    batteryLevel: 85,
    firmware: 'v2.1.3'
  },
  {
    id: 2,
    deviceName: 'QR 스캐너 #2',
    location: '후문 출입구',
    status: '정상',
    lastSync: '2024-08-23 14:29:45',
    todayCount: 89,
    batteryLevel: 72,
    firmware: 'v2.1.3'
  },
  {
    id: 3,
    deviceName: 'Suprema 단말기 #1',
    location: '락커룸 출입구',
    status: '오프라인',
    lastSync: '2024-08-23 13:15:22',
    todayCount: 67,
    batteryLevel: 0,
    firmware: 'v1.8.9'
  },
  {
    id: 4,
    deviceName: 'QR 스캐너 #3',
    location: 'PT룸 출입구',
    status: '정상',
    lastSync: '2024-08-23 14:31:10',
    todayCount: 32,
    batteryLevel: 91,
    firmware: 'v2.1.3'
  }
]

interface AccessManagementProps {
  initialAccessLogs?: any[]
  loading?: boolean
}

export function AccessManagement({ initialAccessLogs = [], loading: globalLoading = false }: AccessManagementProps) {
  const [accessLogs, setAccessLogs] = useState<any[]>(initialAccessLogs.length > 0 ? initialAccessLogs : sampleAccessLogs)
  const [loading, setLoading] = useState(false)

  // initialAccessLogs가 있으면 즉시 업데이트
  useEffect(() => {
    if (initialAccessLogs && initialAccessLogs.length > 0) {
      setAccessLogs(initialAccessLogs)
    }
  }, [initialAccessLogs])

  // 초기 데이터가 없을 때만 fetch
  useEffect(() => {
    if (initialAccessLogs.length === 0 && !globalLoading) {
      const fetchAccessLogs = async () => {
        try {
          setLoading(true)
          const response = await api.getAccessLogs()
          if (response.logs && response.logs.length > 0) {
            setAccessLogs(response.logs)
          }
        } catch (error) {
          console.error('출입 로그 데이터 로딩 오류:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchAccessLogs()
    }
  }, [initialAccessLogs, globalLoading])

  const failedAccess = accessLogs.filter(log => log.status === '실패')
  const successfulAccess = accessLogs.filter(log => log.status === '성공')
  const qrAccess = accessLogs.filter(log => log.accessType === 'QR')

  const handleDeviceRestart = (deviceId: number) => {
    console.log(`장비 ${deviceId} 재시작`)
  }

  const handleSecurityCheck = (accessId: number) => {
    console.log(`보안 알림 ${accessId} 확인`)
  }

  if (loading || globalLoading) {
    return (
      <div className="p-8 bg-gray-900 text-white">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4">출입 데이터를 로딩중입니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 bg-gray-900 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">출입 관리</h1>
          <p className="text-gray-400 mt-2">실시간 출입 모니터링 및 보안 관리</p>
        </div>
      </div>

      {/* 부정 출입 알림 */}
      {suspiciousAccess.length > 0 && (
        <Alert className="bg-red-900/20 border-red-500 text-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>부정 출입 감지 알림</AlertTitle>
          <AlertDescription>
            {suspiciousAccess.length}건의 의심스러운 출입 시도가 감지되었습니다.
          </AlertDescription>
        </Alert>
      )}

      {/* 출입 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">오늘 총 출입</CardTitle>
            <DoorOpen className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{accessLogs.length}건</div>
            <p className="text-xs text-gray-400">
              총 출입 기록
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">성공률</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {accessLogs.length > 0 ? 
                Math.round((successfulAccess.length / accessLogs.length) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-400">
              {successfulAccess.length}건 성공 / {failedAccess.length}건 실패
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">QR 출입</CardTitle>
            <QrCode className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{qrAccess.length}건</div>
            <p className="text-xs text-gray-400">
              전체 출입의 {accessLogs.length > 0 ? Math.round((qrAccess.length / accessLogs.length) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">보안 알림</CardTitle>
            <Shield className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{suspiciousAccess.length}건</div>
            <p className="text-xs text-gray-400">
              확인 필요
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="logs" className="text-white">출입 로그</TabsTrigger>
          <TabsTrigger value="qr" className="text-white">QR 코드 관리</TabsTrigger>
          <TabsTrigger value="security" className="text-white">보안 알림</TabsTrigger>
          <TabsTrigger value="devices" className="text-white">장비 상태</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>실시간 출입 로그</CardTitle>
              <CardDescription className="text-gray-400">모든 출입 기록을 실시간으로 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">회원명</TableHead>
                    <TableHead className="text-gray-300">출입 시간</TableHead>
                    <TableHead className="text-gray-300">인증 방식</TableHead>
                    <TableHead className="text-gray-300">장비</TableHead>
                    <TableHead className="text-gray-300">위치</TableHead>
                    <TableHead className="text-gray-300">상태</TableHead>
                    <TableHead className="text-gray-300">사유</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessLogs.map((log) => (
                    <TableRow key={log.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{log.memberName}</TableCell>
                      <TableCell className="text-gray-300">{new Date(log.accessTime).toLocaleString('ko-KR')}</TableCell>
                      <TableCell className="text-gray-300">
                        <Badge variant="outline" className="border-gray-600">
                          {log.accessType === 'QR' ? <QrCode className="w-3 h-3 mr-1" /> : <Shield className="w-3 h-3 mr-1" />}
                          {log.accessType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{log.device}</TableCell>
                      <TableCell className="text-gray-300">{log.location}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === '성공' ? 'default' : 'destructive'}
                               className={log.status === '성공' ? 'bg-green-600' : 'bg-red-600'}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{log.reason || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="qr">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>QR 코드 관리</CardTitle>
              <CardDescription className="text-gray-400">회원별 QR 코드 발급 및 관리</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">QR 코드 통계</h3>
                  <p className="text-sm text-gray-400">총 1,234개의 QR 코드가 활성화되어 있습니다</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <QrCode className="mr-2 h-4 w-4" />
                  새 QR 코드 발급
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <QrCode className="h-12 w-12 mx-auto mb-3 text-green-400" />
                      <p className="text-gray-300 mb-2">활성 QR 코드</p>
                      <p className="text-3xl font-bold text-white">1,187개</p>
                      <p className="text-xs text-gray-400 mt-1">96.2% 활성률</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Clock className="h-12 w-12 mx-auto mb-3 text-yellow-400" />
                      <p className="text-gray-300 mb-2">만료 예정</p>
                      <p className="text-3xl font-bold text-white">23개</p>
                      <p className="text-xs text-gray-400 mt-1">7일 이내</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-red-400" />
                      <p className="text-gray-300 mb-2">비활성</p>
                      <p className="text-3xl font-bold text-white">24개</p>
                      <p className="text-xs text-gray-400 mt-1">재발급 필요</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>보안 알림</CardTitle>
              <CardDescription className="text-gray-400">부정 출입 시도 및 보안 이벤트</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">사용자</TableHead>
                    <TableHead className="text-gray-300">시간</TableHead>
                    <TableHead className="text-gray-300">장비</TableHead>
                    <TableHead className="text-gray-300">위치</TableHead>
                    <TableHead className="text-gray-300">사유</TableHead>
                    <TableHead className="text-gray-300">심각도</TableHead>
                    <TableHead className="text-gray-300">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suspiciousAccess.map((access) => (
                    <TableRow key={access.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{access.memberName}</TableCell>
                      <TableCell className="text-gray-300">{access.accessTime}</TableCell>
                      <TableCell className="text-gray-300">{access.device}</TableCell>
                      <TableCell className="text-gray-300">{access.location}</TableCell>
                      <TableCell className="text-gray-300">{access.reason}</TableCell>
                      <TableCell>
                        <Badge variant={access.severity === '높음' ? 'destructive' : access.severity === '중간' ? 'secondary' : 'outline'}
                               className={access.severity === '높음' ? 'bg-red-600' : access.severity === '중간' ? 'bg-yellow-600' : 'bg-gray-600'}>
                          {access.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSecurityCheck(access.id)}
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            확인
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                            차단
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
        
        <TabsContent value="devices">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>출입 장비 상태</CardTitle>
              <CardDescription className="text-gray-400">QR 스캐너 및 Suprema 장비 모니터링</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">장비명</TableHead>
                    <TableHead className="text-gray-300">위치</TableHead>
                    <TableHead className="text-gray-300">상태</TableHead>
                    <TableHead className="text-gray-300">마지막 동기화</TableHead>
                    <TableHead className="text-gray-300">오늘 사용</TableHead>
                    <TableHead className="text-gray-300">배터리</TableHead>
                    <TableHead className="text-gray-300">펌웨어</TableHead>
                    <TableHead className="text-gray-300">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviceStatus.map((device) => (
                    <TableRow key={device.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{device.deviceName}</TableCell>
                      <TableCell className="text-gray-300">{device.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {device.status === '정상' ? 
                            <Wifi className="h-3 w-3 mr-1 text-green-400" /> : 
                            <WifiOff className="h-3 w-3 mr-1 text-red-400" />
                          }
                          <Badge variant={device.status === '정상' ? 'default' : 'destructive'}
                                 className={device.status === '정상' ? 'bg-green-600' : 'bg-red-600'}>
                            {device.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{device.lastSync}</TableCell>
                      <TableCell className="text-gray-300 font-medium">{device.todayCount}회</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            device.batteryLevel > 70 ? 'bg-green-400' :
                            device.batteryLevel > 30 ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                          {device.batteryLevel}%
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono text-sm">{device.firmware}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            설정
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeviceRestart(device.id)}
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            재시작
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
      </Tabs>
    </div>
  )
}