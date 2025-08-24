import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { CreditCard, AlertTriangle, CheckCircle, XCircle, Repeat, DollarSign, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { api } from "../utils/api"
import { samplePayments } from "../data/sampleData"

const autoPayments = [
  {
    id: 1,
    memberName: '김민수',
    cardNumber: '**** **** **** 1234',
    nextPayment: '2024-09-01',
    amount: 150000,
    status: '활성',
    membershipType: 'VIP 월회원권'
  },
  {
    id: 2,
    memberName: '이수진',
    cardNumber: '**** **** **** 5678',
    nextPayment: '2024-09-02',
    amount: 80000,
    status: '활성',
    membershipType: '일반 월회원권'
  },
  {
    id: 3,
    memberName: '최유리',
    cardNumber: '**** **** **** 9012',
    nextPayment: '2024-09-05',
    amount: 150000,
    status: '정지',
    membershipType: 'VIP 월회원권'
  },
  {
    id: 4,
    memberName: '한소영',
    cardNumber: '**** **** **** 3456',
    nextPayment: '2024-09-10',
    amount: 500000,
    status: '활성',
    membershipType: 'PT 10회권'
  }
]

interface PaymentManagementProps {
  initialPayments?: any[]
  loading?: boolean
}

export function PaymentManagement({ initialPayments = [], loading: globalLoading = false }: PaymentManagementProps) {
  const [payments, setPayments] = useState<any[]>(initialPayments.length > 0 ? initialPayments : samplePayments)
  const [loading, setLoading] = useState(false)

  // initialPayments가 있으면 즉시 업데이트
  useEffect(() => {
    if (initialPayments && initialPayments.length > 0) {
      setPayments(initialPayments)
    }
  }, [initialPayments])

  // 초기 데이터가 없을 때만 fetch
  useEffect(() => {
    if (initialPayments.length === 0 && !globalLoading) {
      const fetchPayments = async () => {
        try {
          setLoading(true)
          const response = await api.getPayments()
          if (response.payments && response.payments.length > 0) {
            setPayments(response.payments)
          }
        } catch (error) {
          console.error('결제 데이터 로딩 오류:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchPayments()
    }
  }, [initialPayments, globalLoading])

  const failedPayments = payments.filter(payment => payment.status === '실패')
  const successPayments = payments.filter(payment => payment.status === '완료')
  const totalRevenue = successPayments.reduce((sum, payment) => sum + payment.amount, 0)

  const handleRetryPayment = (paymentId: number) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: '완료', approvalNumber: '99999999' }
        : payment
    ))
  }

  const toggleAutoPayment = (autoPaymentId: number) => {
    console.log(`자동결제 ${autoPaymentId} 상태 변경`)
  }

  if (loading || globalLoading) {
    return (
      <div className="p-8 bg-gray-900 text-white">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4">결제 데이터를 로딩중입니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 bg-gray-900 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">결제 관리</h1>
          <p className="text-gray-400 mt-2">결제 내역 및 자동결제 관리</p>
        </div>
      </div>

      {/* 결제 실패 알림 */}
      {failedPayments.length > 0 && (
        <Alert className="bg-red-900/20 border-red-500 text-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>결제 실패 알림</AlertTitle>
          <AlertDescription>
            {failedPayments.length}건의 결제 실패가 있습니다. 확인이 필요합니다.
          </AlertDescription>
        </Alert>
      )}

      {/* 결제 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">이번 달 총 매출</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRevenue.toLocaleString()}원</div>
            <p className="text-xs text-gray-400">
              지난달 대비 +12%
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">성공한 결제</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{successPayments.length}건</div>
            <p className="text-xs text-gray-400">
              성공률: {payments.length > 0 ? Math.round((successPayments.length / payments.length) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">실패한 결제</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{failedPayments.length}건</div>
            <p className="text-xs text-gray-400">
              처리 대기중
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">자동결제 등록</CardTitle>
            <Repeat className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{autoPayments.filter(ap => ap.status === '활성').length}명</div>
            <p className="text-xs text-gray-400">
              전체 자동결제의 {Math.round((autoPayments.filter(ap => ap.status === '활성').length / autoPayments.length) * 100)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="history" className="text-white">결제 내역</TabsTrigger>
          <TabsTrigger value="failed" className="text-white">결제 실패</TabsTrigger>
          <TabsTrigger value="auto" className="text-white">자동 결제</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>결제 내역</CardTitle>
              <CardDescription className="text-gray-400">최근 결제 내역을 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">회원명</TableHead>
                    <TableHead className="text-gray-300">결제일</TableHead>
                    <TableHead className="text-gray-300">이용권</TableHead>
                    <TableHead className="text-gray-300">결제 방법</TableHead>
                    <TableHead className="text-gray-300">금액</TableHead>
                    <TableHead className="text-gray-300">상태</TableHead>
                    <TableHead className="text-gray-300">승인번호</TableHead>
                    <TableHead className="text-gray-300">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{payment.memberName}</TableCell>
                      <TableCell className="text-gray-300">{payment.paymentDate}</TableCell>
                      <TableCell className="text-gray-300">{payment.membershipType}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <CreditCard className="h-3 w-3 mr-1" />
                          {payment.paymentMethod}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 font-medium">{payment.amount.toLocaleString()}원</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === '완료' ? 'default' : 'destructive'}
                               className={payment.status === '완료' ? 'bg-green-600' : 'bg-red-600'}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono text-sm">
                        {payment.approvalNumber || '-'}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-700">
                          상세보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="failed">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>결제 실패 내역</CardTitle>
              <CardDescription className="text-gray-400">처리가 필요한 결제 실패 건들입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">회원명</TableHead>
                    <TableHead className="text-gray-300">결제 시도일</TableHead>
                    <TableHead className="text-gray-300">이용권</TableHead>
                    <TableHead className="text-gray-300">결제 방법</TableHead>
                    <TableHead className="text-gray-300">금액</TableHead>
                    <TableHead className="text-gray-300">실패 사유</TableHead>
                    <TableHead className="text-gray-300">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {failedPayments.map((payment) => (
                    <TableRow key={payment.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{payment.memberName}</TableCell>
                      <TableCell className="text-gray-300">{payment.paymentDate}</TableCell>
                      <TableCell className="text-gray-300">{payment.membershipType}</TableCell>
                      <TableCell className="text-gray-300">{payment.paymentMethod}</TableCell>
                      <TableCell className="text-gray-300 font-medium">{payment.amount.toLocaleString()}원</TableCell>
                      <TableCell className="text-red-400">{payment.failureReason}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleRetryPayment(payment.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            재시도
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-700">
                            연락
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
        
        <TabsContent value="auto">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>자동 결제 관리</CardTitle>
              <CardDescription className="text-gray-400">회원들의 자동 결제 설정을 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">회원명</TableHead>
                    <TableHead className="text-gray-300">등록 카드</TableHead>
                    <TableHead className="text-gray-300">이용권</TableHead>
                    <TableHead className="text-gray-300">다음 결제일</TableHead>
                    <TableHead className="text-gray-300">결제 금액</TableHead>
                    <TableHead className="text-gray-300">상태</TableHead>
                    <TableHead className="text-gray-300">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {autoPayments.map((payment) => (
                    <TableRow key={payment.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{payment.memberName}</TableCell>
                      <TableCell className="text-gray-300 font-mono text-sm">{payment.cardNumber}</TableCell>
                      <TableCell className="text-gray-300">{payment.membershipType}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {payment.nextPayment}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 font-medium">{payment.amount.toLocaleString()}원</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === '활성' ? 'default' : 'secondary'}
                               className={payment.status === '활성' ? 'bg-green-600' : 'bg-gray-600'}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleAutoPayment(payment.id)}
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            {payment.status === '활성' ? '정지' : '활성화'}
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-700">
                            수정
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