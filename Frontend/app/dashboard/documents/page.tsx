'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Upload,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  RefreshCw,
  Share
} from 'lucide-react'

interface Document {
  id: string
  name: string
  uploadDate: string
  analyzedDate: string
  status: 'completed' | 'processing' | 'failed' | 'pending'
  overallScore: number
  riskLevel: 'high' | 'medium' | 'low' | 'compliant'
  totalClauses: number
  compliantClauses: number
  highRiskClauses: number
  fileSize: string
  fileType: string
  llmProvider: string
}

export default function DocumentsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('uploadDate')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')
  
  const documents: Document[] = [
    {
      id: '1',
      name: 'Contract_Draft_v3.pdf',
      uploadDate: '2024-01-15T10:30:00Z',
      analyzedDate: '2024-01-15T10:32:15Z',
      status: 'completed',
      overallScore: 67.7,
      riskLevel: 'medium',
      totalClauses: 65,
      compliantClauses: 44,
      highRiskClauses: 8,
      fileSize: '2.4 MB',
      fileType: 'PDF',
      llmProvider: 'Gemini Pro'
    },
    {
      id: '2',
      name: 'Disclosure_Statement_Q1.docx',
      uploadDate: '2024-01-14T15:20:00Z',
      analyzedDate: '2024-01-14T15:22:30Z',
      status: 'completed',
      overallScore: 89.2,
      riskLevel: 'low',
      totalClauses: 32,
      compliantClauses: 29,
      highRiskClauses: 1,
      fileSize: '1.8 MB',
      fileType: 'DOCX',
      llmProvider: 'Claude'
    },
    {
      id: '3',
      name: 'Board_Resolution_Jan2024.pdf',
      uploadDate: '2024-01-13T09:45:00Z',
      analyzedDate: '',
      status: 'processing',
      overallScore: 0,
      riskLevel: 'medium',
      totalClauses: 0,
      compliantClauses: 0,
      highRiskClauses: 0,
      fileSize: '890 KB',
      fileType: 'PDF',
      llmProvider: 'GPT-4'
    },
    {
      id: '4',
      name: 'Compliance_Manual_2024.pdf',
      uploadDate: '2024-01-12T14:15:00Z',
      analyzedDate: '2024-01-12T14:18:45Z',
      status: 'completed',
      overallScore: 92.5,
      riskLevel: 'compliant',
      totalClauses: 128,
      compliantClauses: 125,
      highRiskClauses: 0,
      fileSize: '5.2 MB',
      fileType: 'PDF',
      llmProvider: 'Mistral'
    },
    {
      id: '5',
      name: 'Risk_Assessment_Report.pdf',
      uploadDate: '2024-01-11T11:00:00Z',
      analyzedDate: '',
      status: 'failed',
      overallScore: 0,
      riskLevel: 'high',
      totalClauses: 0,
      compliantClauses: 0,
      highRiskClauses: 0,
      fileSize: '3.1 MB',
      fileType: 'PDF',
      llmProvider: 'Gemini Pro'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case 'processing':
        return <Badge variant="secondary"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Processing</Badge>
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Failed</Badge>
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRiskBadge = (riskLevel: string, status: string) => {
    if (status !== 'completed') return null
    
    switch (riskLevel) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>
      case 'medium':
        return <Badge variant="secondary">Medium Risk</Badge>
      case 'low':
        return <Badge variant="outline">Low Risk</Badge>
      case 'compliant':
        return <Badge variant="default" className="bg-green-100 text-green-800">Compliant</Badge>
      default:
        return null
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    const matchesRisk = filterRisk === 'all' || doc.riskLevel === filterRisk
    return matchesSearch && matchesStatus && matchesRisk
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'uploadDate':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      case 'score':
        return b.overallScore - a.overallScore
      default:
        return 0
    }
  })

  const handleViewDocument = (id: string) => {
    router.push(`/dashboard/analysis/${id}`)
  }

  const handleDeleteDocument = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      console.log('Deleting document:', id)
    }
  }

  const stats = {
    total: documents.length,
    completed: documents.filter(d => d.status === 'completed').length,
    processing: documents.filter(d => d.status === 'processing').length,
    failed: documents.filter(d => d.status === 'failed').length,
    averageScore: documents.filter(d => d.status === 'completed').reduce((acc, doc) => acc + doc.overallScore, 0) / documents.filter(d => d.status === 'completed').length || 0
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <FileText className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Document Management</h1>
              </div>
              <p className="text-muted-foreground">
                View and manage all your analyzed documents
              </p>
            </div>
            <Button onClick={() => router.push('/dashboard')}>
              <Upload className="h-4 w-4 mr-2" />
              Upload New Document
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Documents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Avg. Score</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uploadDate">Upload Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="score">Score</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Documents List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Documents ({sortedDocuments.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedDocuments.map((document, index) => (
                  <motion.div
                    key={document.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-lg">{document.name}</h3>
                          {getStatusBadge(document.status)}
                          {getRiskBadge(document.riskLevel, document.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(document.uploadDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {document.fileType} • {document.fileSize}
                          </div>
                          {document.status === 'completed' && (
                            <>
                              <div>
                                Score: <span className="font-medium">{document.overallScore}%</span>
                              </div>
                              <div>
                                Clauses: <span className="font-medium">{document.compliantClauses}/{document.totalClauses}</span>
                              </div>
                            </>
                          )}
                          {document.status === 'processing' && (
                            <div className="col-span-2">
                              <span className="font-medium">Processing with {document.llmProvider}...</span>
                            </div>
                          )}
                        </div>
                        
                        {document.status === 'completed' && document.analyzedDate && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Analyzed on {new Date(document.analyzedDate).toLocaleString()} using {document.llmProvider}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {document.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDocument(document.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Results
                          </Button>
                        )}
                        
                        {document.status === 'failed' && (
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(document.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {sortedDocuments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No documents found</p>
                  <p className="text-sm text-gray-500">
                    {searchTerm || filterStatus !== 'all' || filterRisk !== 'all' 
                      ? 'Try adjusting your filters'
                      : 'Upload your first document to get started'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}