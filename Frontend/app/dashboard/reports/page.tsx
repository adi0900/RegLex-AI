'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { complianceAPI } from '@/lib/api'
import { Download, FileText, Filter, Calendar, BarChart3 } from 'lucide-react'

export default function ReportsPage() {
  const [reportType, setReportType] = useState('compliance')
  const [timeRange, setTimeRange] = useState('30d')

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: complianceAPI.getAnalytics,
  })

  const handleExportReport = async (format: 'pdf' | 'csv' | 'json') => {
    try {
      const exportData = complianceAPI.exportData()
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json'
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'csv') {
        // CSV export logic would go here
        console.log('CSV export not implemented yet')
      } else if (format === 'pdf') {
        // PDF export logic would go here
        console.log('PDF export not implemented yet')
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const reports = [
    {
      id: '1',
      name: 'Monthly Compliance Report',
      type: 'Compliance',
      date: '2025-09-01',
      status: 'Ready',
      size: '2.3 MB'
    },
    {
      id: '2',
      name: 'Risk Assessment Summary',
      type: 'Risk Analysis',
      date: '2025-08-28',
      status: 'Ready',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Document Analysis Report',
      type: 'Analysis',
      date: '2025-08-25',
      status: 'Processing',
      size: 'N/A'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download compliance and analysis reports
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Quick Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Generate New Report
          </CardTitle>
          <CardDescription>
            Export current compliance data in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => handleExportReport('json')}>
              <Download className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>
            <Button variant="outline" onClick={() => handleExportReport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" onClick={() => handleExportReport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList>
          <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Compliance Reports</CardTitle>
              <CardDescription>
                Download comprehensive compliance analysis reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.filter(r => r.type === 'Compliance').map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Generated on {report.date} • {report.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                      <Button size="sm" disabled={report.status !== 'Ready'}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis Reports</CardTitle>
              <CardDescription>
                Detailed risk assessment and mitigation reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.filter(r => r.type === 'Risk Analysis').map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Generated on {report.date} • {report.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                      <Button size="sm" disabled={report.status !== 'Ready'}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis Reports</CardTitle>
              <CardDescription>
                Historical compliance trends and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No trend reports available yet. Upload more documents to generate trend analysis.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Create custom reports with specific criteria and filters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Custom report builder coming soon. Use the quick export options above for now.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}