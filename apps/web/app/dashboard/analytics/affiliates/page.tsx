'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  Users,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const affiliates = [
  {
    username: '@daphnemarie',
    name: 'Daphne',
    email: 'daphne@example.com',
    status: 'Active',
    purchases: 1,
    resellStatus: 'Deleted',
    chargebacks: 1,
    revenue: '$4.99',
  },
  {
    username: '@nathannn',
    name: 'Nathan',
    email: 'nathan@example.com',
    status: 'Active',
    purchases: 0,
    resellStatus: 'Active',
    chargebacks: 0,
    revenue: '$0.00',
  },
  {
    username: '@athena',
    name: 'Athena',
    email: 'athena@example.com',
    status: 'Active',
    purchases: 0,
    resellStatus: 'Active',
    chargebacks: 0,
    revenue: '$0.00',
  },
]

export default function AffiliateAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-500">My Store / Affiliate Analytics</p>
        <h1 className="text-3xl font-bold">Affiliate Analytics</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Affiliate Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$4.99</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Affiliates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      {/* Affiliates Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Affiliates</CardTitle>
              <CardDescription>
                Manage your store affiliates and their performance.
              </CardDescription>
            </div>
            <Button>Send Email</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Purchases</TableHead>
                <TableHead>Resell Status</TableHead>
                <TableHead>Chargebacks</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affiliates.map((affiliate) => (
                <TableRow key={affiliate.email}>
                  <TableCell className="font-medium">
                    {affiliate.username}
                  </TableCell>
                  <TableCell>{affiliate.name}</TableCell>
                  <TableCell>{affiliate.email}</TableCell>
                  <TableCell>
                    <Badge variant={affiliate.status === 'Active' ? 'default' : 'secondary'}>
                      {affiliate.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{affiliate.purchases}</TableCell>
                  <TableCell>
                     <Badge variant={affiliate.resellStatus === 'Active' ? 'default' : 'destructive'}>
                      {affiliate.resellStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{affiliate.chargebacks}</TableCell>
                  <TableCell>{affiliate.revenue}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
