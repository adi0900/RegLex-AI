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
  const [exportLoading, setExportLoading] = useState(false)

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: complianceAPI.getAnalytics,
  })

  const { data: gcpReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['gcp-reports'],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const response = await fetch(`${apiUrl}/api/dashboard/reports`)
      if (!response.ok) {
        throw new Error('Failed to fetch reports')
      }
      const result = await response.json()
      return result.data || []
    },
  })

  const handleExportReport = async (format: 'pdf' | 'csv' | 'json', reportType?: string) => {
    setExportLoading(true)
    try {
      let exportData
      let filename

      if (reportType) {
        // Use GCP export endpoints for detailed reports
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

        let endpoint = ''
        switch (reportType) {
          case 'compliance':
            endpoint = '/api/dashboard/reports/export/compliance'
            filename = `compliance-reports-${new Date().toISOString().split('T')[0]}`
            break
          case 'risk':
            endpoint = '/api/dashboard/reports/export/risk-analysis'
            filename = `risk-analysis-${new Date().toISOString().split('T')[0]}`
            break
          case 'trends':
            endpoint = '/api/dashboard/reports/export/trend-analysis'
            filename = `trend-analysis-${new Date().toISOString().split('T')[0]}`
            break
          case 'custom':
            endpoint = '/api/dashboard/reports/export/custom'
            filename = `custom-report-${new Date().toISOString().split('T')[0]}`
            break
          default:
            endpoint = '/api/dashboard/reports/export/compliance'
            filename = `compliance-report-${new Date().toISOString().split('T')[0]}`
        }

        const response = await fetch(`${apiUrl}${endpoint}`)
        if (!response.ok) {
          throw new Error('Failed to fetch export data from GCP')
        }

        const result = await response.json()
        exportData = result.data
      } else {
        // Fallback to basic export
        exportData = complianceAPI.exportData()
        filename = `compliance-report-${new Date().toISOString().split('T')[0]}`
      }
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json'
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'csv') {
        await exportToCSV(exportData, filename, reportType)
      } else if (format === 'pdf') {
        await exportToPDF(exportData, filename, reportType)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setExportLoading(false)
    }
  }

  const exportToCSV = async (data: any, filename: string, reportType?: string) => {
    try {
      let csvContent = ''

      if (reportType === 'compliance' && data.documents) {
        // Compliance reports CSV
        csvContent = 'Document ID,Filename,Upload Date,Compliance Status,Risk Level,Clauses Analyzed,Compliant Clauses,Violations Count\n'
        data.documents.forEach((doc: any) => {
          csvContent += `${doc.document_id},${doc.filename},${doc.uploaded_at},${doc.compliance_status},${doc.risk_level},${doc.clauses_analyzed},${doc.compliant_clauses},${doc.violations?.length || 0}\n`
        })
      } else if (reportType === 'risk' && data.risk_categories) {
        // Risk analysis CSV
        csvContent = 'Document ID,Filename,Risk Level,Risk Score,Recommendations Count,Violations Count\n'
        Object.values(data.risk_categories).forEach((category: any) => {
          if (Array.isArray(category)) {
            category.forEach((item: any) => {
              csvContent += `${item.document_id},${item.filename},${item.risk_level},${item.risk_score},${item.recommendations?.length || 0},${item.violations?.length || 0}\n`
            })
          }
        })
      } else if (reportType === 'trends' && data.compliance_trends) {
        // Trend analysis CSV
        csvContent = 'Date,Compliance Rate,Documents Count\n'
        data.compliance_trends.forEach((trend: any) => {
          csvContent += `${trend.date},${trend.compliance_rate}%,${trend.total_documents}\n`
        })
      } else {
        // Generic CSV export
        csvContent = 'Key,Value\n'
        const flattenObject = (obj: any, prefix = '') => {
          Object.keys(obj).forEach(key => {
            const newKey = prefix ? `${prefix}.${key}` : key
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              flattenObject(obj[key], newKey)
            } else {
              csvContent += `${newKey},${obj[key]}\n`
            }
          })
        }
        flattenObject(data)
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('CSV export failed:', error)
      throw error
    }
  }

  const exportToPDF = async (data: any, filename: string, reportType?: string) => {
    try {
      // For PDF export, we'll create a simple HTML structure and convert it
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${reportType?.toUpperCase() || 'COMPLIANCE'} REPORT</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #666; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>${reportType?.toUpperCase() || 'COMPLIANCE'} REPORT</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      `

      if (reportType === 'compliance' && data.documents) {
        htmlContent += `
          <div class="summary">
            <h2>Summary</h2>
            <p><strong>Total Documents:</strong> ${data.summary?.total_documents || 0}</p>
            <p><strong>Compliant Documents:</strong> ${data.summary?.compliant_documents || 0}</p>
            <p><strong>Compliance Rate:</strong> ${data.compliance_rate?.toFixed(1) || 0}%</p>
          </div>

          <h2>Document Details</h2>
          <table>
            <thead>
              <tr>
                <th>Document ID</th>
                <th>Filename</th>
                <th>Compliance Status</th>
                <th>Risk Level</th>
                <th>Clauses Analyzed</th>
              </tr>
            </thead>
            <tbody>
        `

        data.documents.forEach((doc: any) => {
          htmlContent += `
            <tr>
              <td>${doc.document_id}</td>
              <td>${doc.filename}</td>
              <td>${doc.compliance_status}</td>
              <td>${doc.risk_level}</td>
              <td>${doc.clauses_analyzed}</td>
            </tr>
          `
        })

        htmlContent += `
            </tbody>
          </table>
        `
      } else if (reportType === 'risk' && data.summary) {
        htmlContent += `
          <div class="summary">
            <h2>Risk Summary</h2>
            <p><strong>Total Risks:</strong> ${data.summary.total_risks}</p>
            <p><strong>High Risks:</strong> ${data.summary.high_risks}</p>
            <p><strong>Medium Risks:</strong> ${data.summary.medium_risks}</p>
            <p><strong>Low Risks:</strong> ${data.summary.low_risks}</p>
          </div>
        `
      } else {
        // Generic PDF content
        htmlContent += `
          <div class="summary">
            <h2>Report Data</h2>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </div>
        `
      }

      htmlContent += `
        </body>
        </html>
      `

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.html`
      a.click()
      URL.revokeObjectURL(url)

      // Note: For a full PDF implementation, you would typically use a library like jsPDF or Puppeteer
      alert('PDF export saved as HTML. For full PDF support, consider using a PDF generation library.')
    } catch (error) {
      console.error('PDF export failed:', error)
      throw error
    }
  }

  // Transform GCP reports data for display
  const reports = gcpReports ? gcpReports.map((report: any, index: number) => ({
    id: report.id || `report_${index + 1}`,
    name: report.title || `Report ${index + 1}`,
    type: report.type || 'Compliance',
    date: report.generatedAt || new Date().toISOString().split('T')[0],
    status: report.status || 'Ready',
    size: report.size || 'N/A'
  })) : []

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
            Export detailed compliance reports from GCP in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => handleExportReport('json', 'compliance')}
                disabled={exportLoading}
                className="flex flex-col items-center gap-2 h-auto p-4"
              >
                {exportLoading ? (
                  <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Download className="h-6 w-6" />
                )}
                <div className="text-center">
                  <div className="font-medium">Compliance Reports</div>
                  <div className="text-xs text-muted-foreground">Detailed compliance data</div>
                </div>
              </Button>
              <Button
                onClick={() => handleExportReport('json', 'risk')}
                disabled={exportLoading}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto p-4"
              >
                {exportLoading ? (
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                ) : (
                  <Download className="h-6 w-6" />
                )}
                <div className="text-center">
                  <div className="font-medium">Risk Analysis</div>
                  <div className="text-xs text-muted-foreground">Risk assessment reports</div>
                </div>
              </Button>
              <Button
                onClick={() => handleExportReport('json', 'trends')}
                disabled={exportLoading}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto p-4"
              >
                {exportLoading ? (
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                ) : (
                  <Download className="h-6 w-6" />
                )}
                <div className="text-center">
                  <div className="font-medium">Trend Analysis</div>
                  <div className="text-xs text-muted-foreground">Historical trends</div>
                </div>
              </Button>
              <Button
                onClick={() => handleExportReport('json', 'custom')}
                disabled={exportLoading}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto p-4"
              >
                {exportLoading ? (
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                ) : (
                  <Download className="h-6 w-6" />
                )}
                <div className="text-center">
                  <div className="font-medium">Custom Report</div>
                  <div className="text-xs text-muted-foreground">Filtered custom reports</div>
                </div>
            </Button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="secondary"
                size="sm"
                disabled={exportLoading}
                onClick={() => handleExportReport('csv', 'compliance')}
              >
                {exportLoading ? 'Exporting...' : 'Export All as CSV'}
            </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={exportLoading}
                onClick={() => handleExportReport('pdf', 'compliance')}
              >
                {exportLoading ? 'Exporting...' : 'Export All as PDF'}
            </Button>
            </div>
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
                Download comprehensive compliance analysis reports from GCP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                    <span className="ml-2">Loading reports from GCP...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 mb-4">
                      <Button
                        onClick={() => handleExportReport('json', 'compliance')}
                        disabled={exportLoading}
                        variant="outline"
                        size="sm"
                      >
                        {exportLoading ? (
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Export Detailed Compliance Report (JSON)
                      </Button>
                      <Button
                        onClick={() => handleExportReport('csv', 'compliance')}
                        disabled={exportLoading}
                        variant="outline"
                        size="sm"
                      >
                        {exportLoading ? (
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Export as CSV
                      </Button>
                    </div>
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
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis Reports</CardTitle>
              <CardDescription>
                Detailed risk assessment and mitigation reports from GCP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={() => handleExportReport('json', 'risk')}
                    disabled={exportLoading}
                    variant="outline"
                    size="sm"
                  >
                    {exportLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export Detailed Risk Analysis (JSON)
                  </Button>
                  <Button
                    onClick={() => handleExportReport('csv', 'risk')}
                    disabled={exportLoading}
                    variant="outline"
                    size="sm"
                  >
                    {exportLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export as CSV
                  </Button>
                </div>
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
                Historical compliance trends and patterns from GCP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={() => handleExportReport('json', 'trends')}
                    disabled={exportLoading}
                    variant="outline"
                    size="sm"
                  >
                    {exportLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export Detailed Trend Analysis (JSON)
                  </Button>
                  <Button
                    onClick={() => handleExportReport('csv', 'trends')}
                    disabled={exportLoading}
                    variant="outline"
                    size="sm"
                  >
                    {exportLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export as CSV
                  </Button>
                </div>
              <div className="text-center py-8 text-muted-foreground">
                No trend reports available yet. Upload more documents to generate trend analysis.
                  Use the export buttons above to generate detailed trend analysis from GCP storage.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Create custom reports with specific criteria and filters from GCP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={() => handleExportReport('json', 'custom')}
                    disabled={exportLoading}
                    variant="outline"
                    size="sm"
                  >
                    {exportLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export Custom Report (JSON)
                  </Button>
                  <Button
                    onClick={() => handleExportReport('csv', 'custom')}
                    disabled={exportLoading}
                    variant="outline"
                    size="sm"
                  >
                    {exportLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export as CSV
                  </Button>
                </div>
              <div className="text-center py-8 text-muted-foreground">
                  Custom report builder with advanced filters. Use the export buttons above to generate
                  custom reports from GCP storage with specific criteria and filters.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}