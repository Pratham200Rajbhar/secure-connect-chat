import { useState } from 'react';
import { ArrowLeft, Users, MessageSquare, HardDrive, Activity, BarChart3, Flag, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { users } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const stats = [
  { label: 'Total Users', value: '2,847', icon: Users, change: '+12%' },
  { label: 'Active (24h)', value: '1,234', icon: Activity, change: '+8%' },
  { label: 'Messages (24h)', value: '45.2K', icon: MessageSquare, change: '+23%' },
  { label: 'Storage Used', value: '1.2 TB', icon: HardDrive, change: '+5%' },
];

const mockReports = [
  { id: '1', reporter: 'user42', reported: 'spammer99', reason: 'Spam', status: 'pending', date: 'Feb 10' },
  { id: '2', reporter: 'alice', reported: 'bob', reason: 'Harassment', status: 'reviewed', date: 'Feb 9' },
  { id: '3', reporter: 'charlie', reported: 'dave', reason: 'Inappropriate', status: 'resolved', date: 'Feb 8' },
];

const mockAuditLogs = [
  { id: '1', user: 'admin', action: 'User banned', resource: 'spammer99', timestamp: '2 min ago' },
  { id: '2', user: 'admin', action: 'Report resolved', resource: 'Report #3', timestamp: '1h ago' },
  { id: '3', user: 'system', action: 'Backup completed', resource: 'Database', timestamp: '6h ago' },
  { id: '4', user: 'admin', action: 'Settings updated', resource: 'Rate limits', timestamp: '1d ago' },
];

const statusColor: Record<string, string> = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  reviewed: 'bg-primary/20 text-primary border-primary/30',
  resolved: 'bg-success/20 text-success border-success/30',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.username.toLowerCase().includes(userSearch.toLowerCase()));

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground">Admin Dashboard</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 chat-scrollbar">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview"><BarChart3 className="w-4 h-4 mr-1.5" />Overview</TabsTrigger>
              <TabsTrigger value="users"><Users className="w-4 h-4 mr-1.5" />Users</TabsTrigger>
              <TabsTrigger value="reports"><Flag className="w-4 h-4 mr-1.5" />Reports</TabsTrigger>
              <TabsTrigger value="audit"><FileText className="w-4 h-4 mr-1.5" />Audit Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s) => (
                  <Card key={s.label}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                        <s.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-foreground">{s.value}</p>
                      <p className="text-xs text-success mt-1">{s.change} from last week</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader><CardTitle className="text-base">Activity Overview</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                    <BarChart3 className="w-8 h-8 mr-2 opacity-30" />
                    Chart placeholder — connect backend for live data
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <div className="mb-4">
                <Input placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="max-w-sm" />
              </div>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium text-foreground">@{u.username}</TableCell>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>
                          <span className={cn('inline-flex items-center gap-1 text-xs', u.online ? 'text-success' : 'text-muted-foreground')}>
                            <span className={cn('w-2 h-2 rounded-full', u.online ? 'bg-success' : 'bg-muted-foreground/50')} /> {u.online ? 'Online' : 'Offline'}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{u.lastSeen || 'Now'}</TableCell>
                        <TableCell><Button variant="ghost" size="sm">View</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reported</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReports.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-foreground">@{r.reporter}</TableCell>
                        <TableCell className="text-foreground">@{r.reported}</TableCell>
                        <TableCell>{r.reason}</TableCell>
                        <TableCell><Badge variant="outline" className={cn('capitalize', statusColor[r.status])}>{r.status}</Badge></TableCell>
                        <TableCell className="text-muted-foreground text-sm">{r.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="audit">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAuditLogs.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="text-foreground font-medium">{l.user}</TableCell>
                        <TableCell>{l.action}</TableCell>
                        <TableCell className="text-muted-foreground">{l.resource}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{l.timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
