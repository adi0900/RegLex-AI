'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, AlertCircle, CheckCircle, Info, Settings, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
  category: 'compliance' | 'system' | 'document' | 'general'
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High Risk Clause Detected',
      message: 'Document "Investment Policy 2025.pdf" contains clauses with high compliance risk. Review required.',
      timestamp: '2025-09-03T14:30:00Z',
      read: false,
      category: 'compliance'
    },
    {
      id: '2',
      type: 'success',
      title: 'Document Processing Complete',
      message: 'Successfully analyzed "Financial Report Q3.pdf" - 98% compliance score achieved.',
      timestamp: '2025-09-03T13:15:00Z',
      read: true,
      category: 'document'
    },
    {
      id: '3',
      type: 'info',
      title: 'System Update',
      message: 'FastAPI backend connection established. All features are now available.',
      timestamp: '2025-09-03T12:00:00Z',
      read: true,
      category: 'system'
    },
    {
      id: '4',
      type: 'error',
      title: 'Processing Failed',
      message: 'Failed to process "Contract Draft.pdf" - invalid file format detected.',
      timestamp: '2025-09-03T11:45:00Z',
      read: false,
      category: 'document'
    }
  ])

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    complianceAlerts: true,
    documentUpdates: true,
    systemNotifications: false,
    weeklyReports: true
  })

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'warning': return 'destructive'
      case 'error': return 'destructive'
      case 'success': return 'default'
      default: return 'secondary'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Stay updated on compliance status and system events
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-2">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-colors ${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getIcon(notification.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                            {notification.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {notification.category}
                          </Badge>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark read
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <div className="space-y-2">
            {notifications.filter(n => !n.read).map((notification) => (
              <Card key={notification.id} className="border-primary/50 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getIcon(notification.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                            {notification.type}
                          </Badge>
                          <div className="h-2 w-2 bg-primary rounded-full" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark read
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {notifications.filter(n => !n.read).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No unread notifications
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="space-y-2">
            {notifications.filter(n => n.category === 'compliance').map((notification) => (
              <Card key={notification.id} className={!notification.read ? 'border-primary/50 bg-primary/5' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getIcon(notification.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="space-y-2">
            {notifications.filter(n => n.category === 'system').map((notification) => (
              <Card key={notification.id} className={!notification.read ? 'border-primary/50 bg-primary/5' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getIcon(notification.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive browser push notifications
                    </p>
                  </div>
                  <Switch 
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Compliance Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified about compliance issues
                    </p>
                  </div>
                  <Switch 
                    checked={settings.complianceAlerts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, complianceAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Document Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Notifications for document processing status
                    </p>
                  </div>
                  <Switch 
                    checked={settings.documentUpdates}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, documentUpdates: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">System Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      System maintenance and update notifications
                    </p>
                  </div>
                  <Switch 
                    checked={settings.systemNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, systemNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Reports</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly compliance summary reports
                    </p>
                  </div>
                  <Switch 
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}