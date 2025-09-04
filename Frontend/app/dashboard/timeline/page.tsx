'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { complianceAPI } from '@/lib/api'
import { Calendar, Clock, FileText, AlertTriangle, CheckCircle, Filter, ArrowRight } from 'lucide-react'

interface TimelineEvent {
  id: string
  type: 'document' | 'compliance' | 'risk' | 'system'
  title: string
  description: string
  timestamp: string
  status: 'completed' | 'in-progress' | 'pending' | 'failed'
  metadata?: {
    documentName?: string
    complianceScore?: number
    riskLevel?: string
    details?: string
  }
}

export default function TimelinePage() {
  const [filterType, setFilterType] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('7d')

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: complianceAPI.getAnalytics,
  })

  // Mock timeline data - this would come from your backend in a real app
  const [timelineEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      type: 'document',
      title: 'Document Processing Completed',
      description: 'Successfully processed and analyzed Investment Policy 2025.pdf',
      timestamp: '2025-09-03T14:30:00Z',
      status: 'completed',
      metadata: {
        documentName: 'Investment Policy 2025.pdf',
        complianceScore: 87,
        riskLevel: 'medium'
      }
    },
    {
      id: '2',
      type: 'compliance',
      title: 'High Risk Clause Identified',
      description: 'Clause 12.3 flagged for potential SEBI compliance violation',
      timestamp: '2025-09-03T14:25:00Z',
      status: 'completed',
      metadata: {
        documentName: 'Investment Policy 2025.pdf',
        riskLevel: 'high',
        details: 'Section related to fund allocation may not comply with SEBI guidelines'
      }
    },
    {
      id: '3',
      type: 'document',
      title: 'Document Upload Started',
      description: 'Beginning analysis of Investment Policy 2025.pdf',
      timestamp: '2025-09-03T14:20:00Z',
      status: 'completed',
      metadata: {
        documentName: 'Investment Policy 2025.pdf'
      }
    },
    {
      id: '4',
      type: 'system',
      title: 'FastAPI Backend Connected',
      description: 'Successfully established connection to backend processing service',
      timestamp: '2025-09-03T12:00:00Z',
      status: 'completed'
    },
    {
      id: '5',
      type: 'document',
      title: 'Document Processing Failed',
      description: 'Failed to process Contract Draft.pdf due to invalid format',
      timestamp: '2025-09-03T11:45:00Z',
      status: 'failed',
      metadata: {
        documentName: 'Contract Draft.pdf',
        details: 'File format not supported or corrupted'
      }
    },
    {
      id: '6',
      type: 'compliance',
      title: 'Compliance Score Updated',
      description: 'Overall compliance score improved to 94%',
      timestamp: '2025-09-03T10:30:00Z',
      status: 'completed',
      metadata: {
        complianceScore: 94
      }
    }
  ])

  const getIcon = (type: string, status: string) => {
    if (status === 'failed') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
    if (status === 'completed') {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    
    switch (type) {
      case 'document': return <FileText className="h-4 w-4 text-blue-500" />
      case 'compliance': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'risk': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'system': return <Clock className="h-4 w-4 text-gray-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="default">Completed</Badge>
      case 'failed': return <Badge variant="destructive">Failed</Badge>
      case 'in-progress': return <Badge variant="secondary">In Progress</Badge>
      case 'pending': return <Badge variant="outline">Pending</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = diff / (1000 * 60 * 60)
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes} minutes ago`
    } else if (hours < 24) {
      return `${Math.floor(hours)} hours ago`
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
  }

  const filteredEvents = timelineEvents.filter(event => {
    if (filterType === 'all') return true
    return event.type === filterType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Timeline
          </h1>
          <p className="text-muted-foreground">
            Track all document processing and compliance activities
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Export Timeline
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Tabs value={filterType} onValueChange={setFilterType}>
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value={filterType} className="mt-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-6">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start gap-6">
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 bg-background">
                      {getIcon(event.type, event.status)}
                    </div>
                  </div>

                  {/* Event Card */}
                  <Card className="flex-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{event.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatTimestamp(event.timestamp)}</span>
                            <ArrowRight className="h-3 w-3" />
                            {getStatusBadge(event.status)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        {event.description}
                      </p>
                      
                      {/* Metadata */}
                      {event.metadata && (
                        <div className="space-y-2">
                          {event.metadata.documentName && (
                            <div className="flex items-center gap-2 text-xs">
                              <FileText className="h-3 w-3" />
                              <span className="font-medium">Document:</span>
                              <span>{event.metadata.documentName}</span>
                            </div>
                          )}
                          {event.metadata.complianceScore !== undefined && (
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle className="h-3 w-3" />
                              <span className="font-medium">Compliance Score:</span>
                              <Badge variant="outline">{event.metadata.complianceScore}%</Badge>
                            </div>
                          )}
                          {event.metadata.riskLevel && (
                            <div className="flex items-center gap-2 text-xs">
                              <AlertTriangle className="h-3 w-3" />
                              <span className="font-medium">Risk Level:</span>
                              <Badge 
                                variant={
                                  event.metadata.riskLevel === 'high' ? 'destructive' :
                                  event.metadata.riskLevel === 'medium' ? 'secondary' : 'default'
                                }
                              >
                                {event.metadata.riskLevel}
                              </Badge>
                            </div>
                          )}
                          {event.metadata.details && (
                            <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                              <span className="font-medium">Details:</span> {event.metadata.details}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  No timeline events match the current filter criteria.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>
            Overview of recent activity across all categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {timelineEvents.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {timelineEvents.filter(e => e.status === 'failed').length}
              </div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {timelineEvents.filter(e => e.type === 'document').length}
              </div>
              <div className="text-xs text-muted-foreground">Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {timelineEvents.filter(e => e.type === 'compliance').length}
              </div>
              <div className="text-xs text-muted-foreground">Compliance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}