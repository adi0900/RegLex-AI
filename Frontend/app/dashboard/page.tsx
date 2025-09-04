'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { FileUpload } from '@/features/document-upload/components/FileUpload'
import { ComplianceChart, generateMockData } from '@/features/compliance-dashboard/components/ComplianceChart'
import { LLMProviderSelector } from '@/features/compliance-dashboard/components/LLMProviderSelector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BackendStatus } from '@/components/ui/backend-status'
import { FastAPIStatus } from '@/components/ui/fastapi-status'
import { ChartLoading } from '@/components/ui/loading'
import { ExportButton } from '@/components/shared/ExportButton'
import { ExportData } from '@/lib/export-utils'
import { 
  Upload,
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  FileText,
  Download,
  Filter,
  Eye,
  Plus,
  Calendar,
  Users,
  RefreshCw,
  Share,
  Settings,
  Bell,
  Clock,
  Activity
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function DashboardPage() {
  const { complianceData, riskData } = generateMockData()
  
  // Load debug results data for export functionality
  const getExportData = (): ExportData => {
    // This data structure matches the debug_results.json format
    return {
      summary: "This document details the terms and conditions for a Personal Power Loan agreement between Axis Bank Ltd. and the applicant, POYYAR DASS S, operating from ASC Madurai. The loan amount sanctioned is Rs. 20,00,000, with a fixed annual interest rate of 10.49%. The repayment tenure is set for 84 months, with Equated Monthly Installments (EMIs) amounting to Rs. 33,711.",
      timelines: {
        loan_repayment_period: {
          start: "Date of Agreement/Disbursal",
          end: "84 months from start",
          description: "The period over which the Personal Power Loan of Rs. 20,00,000 is to be repaid in 84 monthly installments."
        },
        foreclosure_charges_initial_period: {
          start: "Loan A/c opening Date",
          end: "Up to 36 EMIs from Loan A/c opening Date",
          description: "Foreclosure charges of 3% + GST are applicable on the principal outstanding."
        },
        npa_classification_term_loan: {
          start: "More than 90 days overdue",
          end: "Null",
          description: "Loan account is classified as Non-Performing Asset (NPA) if interest and/or installment of principal remains overdue."
        }
      },
      clauses: [
        {
          clause_id: "C-1",
          text_en: "I/We have been provided the following information and I/We have read and understood the following information and agree with the same and have accordingly filled up the aforesaid application form."
        },
        {
          clause_id: "C-2", 
          text_en: "Interest on the Personal Power loan shall accrue from the date on which the disbursal has been effected in the loan account and accordingly the computation of the first EMI shall be calculated only for the actual number of days remaining for the due date of first installment."
        },
        {
          clause_id: "C-3",
          text_en: "The Bank agrees, based on the Borrower's Request, Representations, Warranties, Covenants and Undertakings as contained herein and in the application for Personal Power Loan and other documents executed or tendered by the Borrower in relation to the Personal Power Loan, to lend to the Borrower and the Borrower agrees to borrow from the Bank, the Personal Power Loan on the terms and conditions as fully contained in this Agreement and the Schedule 'B'."
        },
        {
          clause_id: "C-4",
          text_en: "The Bank may not disburse at any time, any amount under the Personal Power Loan unless all the conditions and any other formalities prescribed by the Bank including the following, but not restricted to, are complied with, in the sole discretion of the Bank."
        },
        {
          clause_id: "C-5",
          text_en: "The Bank shall be entitled to disclose any information about the Borrower, his/her account relationship with the Bank and/or any default committed by him to its head office, other branch offices, affiliated entities, Reserve Bank of India, any Refinancing agency, credit rating agency and such third parties as the Bank may in its sole and exclusive discretion, deem fit and proper."
        },
        {
          clause_id: "C-6", 
          text_en: "The Bank may by a written notice to the Borrower, declare all sums outstanding under the Personal Power Loan (including the principal, interest, charges, expenses) to become due and payable forthwith and enforce the security (if applicable) in relation to the Personal Power Loan upon the occurrence (in the sole decision of the Bank) of any one or more of the following: The Borrower fails to pay to the Bank any amount when due and payable under this Agreement."
        },
        {
          clause_id: "C-7",
          text_en: "Notwithstanding anything to the contrary contained herein, any dispute, controversy, or claim arising out of or relating to this contract, including its construction, interpretation, scope, operation, effect, or validity (collectively, the 'Dispute'), shall be finally resolved through arbitration administered by a single independent arbitral institution ('Independent Institution') in accordance with its applicable rules ('Institution's Rules')."
        },
        {
          clause_id: "C-8",
          text_en: "Non-performing Asset (NPA) is a loan or an advance where: Interest and/or instalment of principal remains overdue for a period of more than 90 days in respect of a term loan."
        }
      ],
      compliance_results: {
        verification_results: [
          {
            clause: "I/We have been provided the following information and I/We have read and understood the following information and agree with the same and have accordingly filled up the aforesaid application form.",
            is_compliant: null,
            matched_rules: [],
            final_reason: "Compliance cannot be determined as no specific regulatory rules were provided for comparison.",
            Section: "Compliance"
          },
          {
            clause: {
              clause_id: "C-2",
              text_en: "Interest on the Personal Power loan shall accrue from the date on which the disbursal has been effected in the loan account and accordingly the computation of the first EMI shall be calculated only for the actual number of days remaining for the due date of first installment."
            },
            is_compliant: false,
            matched_rules: [],
            final_reason: "Compliance verification for the clause could not be performed due to incomplete rule data.",
            Section: "Banking"
          },
          {
            clause: {
              clause_id: "C-3",
              text_en: "The Bank agrees, based on the Borrower's Request, Representations, Warranties, Covenants and Undertakings as contained herein and in the application for Personal Power Loan and other documents executed or tendered by the Borrower in relation to the Personal Power Loan, to lend to the Borrower and the Borrower agrees to borrow from the Bank, the Personal Power Loan on the terms and conditions as fully contained in this Agreement and the Schedule 'B'."
            },
            is_compliant: true,
            matched_rules: [],
            final_reason: "The clause describes a standard agreement for a personal loan, outlining the parties' commitments and the basis for the loan with terms defined in the agreement and Schedule 'B'. It appears to be a standard contractual provision for a lending agreement.",
            Section: "Banking"
          },
          {
            clause: {
              clause_id: "C-4", 
              text_en: "The Bank may not disburse at any time, any amount under the Personal Power Loan unless all the conditions and any other formalities prescribed by the Bank including the following, but not restricted to, are complied with, in the sole discretion of the Bank."
            },
            is_compliant: true,
            matched_rules: [],
            final_reason: "The clause outlines reasonable and standard conditions for a bank to disburse a Personal Power Loan, including verifying employment, assessing financial statements, and securing repayment mechanisms. These are typical due diligence and risk management practices for responsible lending.",
            Section: "Banking"
          },
          {
            clause: {
              clause_id: "C-5",
              text_en: "The Bank shall be entitled to disclose any information about the Borrower, his/her account relationship with the Bank and/or any default committed by him to its head office, other branch offices, affiliated entities, Reserve Bank of India, any Refinancing agency, credit rating agency and such third parties as the Bank may in its sole and exclusive discretion, deem fit and proper."
            },
            is_compliant: true,
            matched_rules: [],
            final_reason: "The clause describes the Bank's right to disclose various types of borrower information to a range of internal and external entities, including regulatory bodies and third parties. Based on the absence of specific prohibitive content in the provided rules, the clause is deemed compliant in this context.",
            Section: "Banking/Compliance"
          },
          {
            clause: {
              clause_id: "C-6",
              text_en: "The Bank may by a written notice to the Borrower, declare all sums outstanding under the Personal Power Loan (including the principal, interest, charges, expenses) to become due and payable forthwith and enforce the security (if applicable) in relation to the Personal Power Loan upon the occurrence (in the sole decision of the Bank) of any one or more of the following: The Borrower fails to pay to the Bank any amount when due and payable under this Agreement."
            },
            is_compliant: false,
            matched_rules: [],
            final_reason: "The compliance verification process could not be completed due to lack of actionable rules, rather than the clause being actively non-compliant based on specific regulations.",
            Section: "Banking"
          },
          {
            clause: {
              clause_id: "C-7",
              text_en: "Notwithstanding anything to the contrary contained herein, any dispute, controversy, or claim arising out of or relating to this contract, including its construction, interpretation, scope, operation, effect, or validity (collectively, the 'Dispute'), shall be finally resolved through arbitration administered by a single independent arbitral institution ('Independent Institution') in accordance with its applicable rules ('Institution's Rules')."
            },
            is_compliant: null,
            matched_rules: [],
            final_reason: "Compliance cannot be determined as all provided candidate regulatory rules are placeholders and do not contain actual regulatory content. The clause itself outlines a standard arbitration agreement, which is generally permissible.",
            Section: "Compliance"
          },
          {
            clause: {
              clause_id: "C-8",
              text_en: "Non-performing Asset (NPA) is a loan or an advance where: Interest and/or instalment of principal remains overdue for a period of more than 90 days in respect of a term loan."
            },
            is_compliant: true,
            matched_rules: [],
            final_reason: "The clause defines a Non-performing Asset (NPA) for a term loan as an account where interest and/or principal remains overdue for more than 90 days. This definition is consistent with widely accepted prudential norms for NPA classification for standard term loans.",
            Section: "Banking"
          }
        ],
        risk_explanations: [
          {
            severity: "Medium",
            category: "General",
            risk_score: 5,
            impact: "Unclassified risk detected.",
            mitigation: "Manual review recommended."
          },
          {
            severity: "Medium", 
            category: "General",
            risk_score: 5,
            impact: "Unclassified risk detected.",
            mitigation: "Manual review recommended."
          },
          {
            severity: "None",
            category: "None", 
            risk_score: 0,
            impact: "No regulatory exposure.",
            mitigation: "No action required."
          },
          {
            severity: "None",
            category: "None",
            risk_score: 0, 
            impact: "No regulatory exposure.",
            mitigation: "No action required."
          },
          {
            severity: "None",
            category: "None",
            risk_score: 0,
            impact: "No regulatory exposure.",
            mitigation: "No action required."
          },
          {
            severity: "Medium",
            category: "General",
            risk_score: 5,
            impact: "Unclassified risk detected.",
            mitigation: "Manual review recommended."
          },
          {
            severity: "Medium",
            category: "General", 
            risk_score: 5,
            impact: "Unclassified risk detected.",
            mitigation: "Manual review recommended."
          },
          {
            severity: "None",
            category: "None",
            risk_score: 0,
            impact: "No regulatory exposure.",
            mitigation: "No action required."
          }
        ]
      },
      metadata: {
        exportDate: new Date().toISOString(),
        exportedBy: "SEBI Compliance Dashboard",
        documentName: "Personal Power Loan Agreement - POYYAR DASS S"
      }
    }
  }
  
  // Mock data for documents
  const mockDocuments = [
    {
      id: '1',
      name: 'Contract_Draft_v3.pdf',
      uploadDate: '2024-01-15T10:30:00Z',
      status: 'completed',
      overallScore: 67.7,
      riskLevel: 'medium',
      fileSize: '2.4 MB'
    },
    {
      id: '2', 
      name: 'Disclosure_Statement_Q1.docx',
      uploadDate: '2024-01-14T15:20:00Z',
      status: 'completed',
      overallScore: 89.2,
      riskLevel: 'low',
      fileSize: '1.8 MB'
    },
    {
      id: '3',
      name: 'Board_Resolution_Jan2024.pdf', 
      uploadDate: '2024-01-13T09:45:00Z',
      status: 'processing',
      overallScore: 0,
      riskLevel: 'unknown',
      fileSize: '890 KB'
    }
  ]

  // Mock data for notifications
  const mockNotifications = [
    {
      id: '1',
      title: 'Document Analysis Complete',
      message: 'Contract_Draft_v3.pdf analysis finished with 67.7% compliance score',
      type: 'success',
      timestamp: '2024-01-15T10:35:00Z',
      read: false,
      actionRequired: false
    },
    {
      id: '2',
      title: 'High Risk Clause Detected',
      message: 'Board_Resolution_Jan2024.pdf contains clauses that require immediate attention',
      type: 'warning',
      timestamp: '2024-01-14T16:20:00Z',
      read: false,
      actionRequired: true
    },
    {
      id: '3',
      title: 'Monthly Report Ready',
      message: 'Your January 2024 compliance report has been generated and is ready for download',
      type: 'info',
      timestamp: '2024-01-14T09:15:00Z',
      read: true,
      actionRequired: false
    },
    {
      id: '4',
      title: 'New SEBI Regulation Update',
      message: 'SEBI has updated disclosure requirements for listed entities. Review your documents.',
      type: 'alert',
      timestamp: '2024-01-13T14:45:00Z',
      read: true,
      actionRequired: true
    },
    {
      id: '5',
      title: 'System Maintenance Scheduled',
      message: 'The compliance system will be down for maintenance on January 20, 2024 from 2:00 AM to 4:00 AM',
      type: 'info',
      timestamp: '2024-01-12T18:00:00Z',
      read: true,
      actionRequired: false
    }
  ]

  // Mock data for timeline
  const mockTimelineEvents = [
    {
      id: '1',
      title: 'Document Uploaded',
      description: 'Contract_Draft_v3.pdf uploaded for compliance analysis',
      timestamp: '2024-01-15T10:30:00Z',
      type: 'upload',
      status: 'completed',
      user: 'John Doe'
    },
    {
      id: '2',
      title: 'Analysis Started',
      description: 'AI-powered compliance analysis initiated using Claude AI',
      timestamp: '2024-01-15T10:31:00Z',
      type: 'analysis',
      status: 'completed',
      user: 'System'
    },
    {
      id: '3',
      title: 'Risk Assessment Completed',
      description: 'Document scored 67.7% compliance with medium risk level',
      timestamp: '2024-01-15T10:35:00Z',
      type: 'assessment',
      status: 'completed',
      user: 'System'
    },
    {
      id: '4',
      title: 'Report Generated',
      description: 'Detailed compliance report generated and saved to dashboard',
      timestamp: '2024-01-15T10:36:00Z',
      type: 'report',
      status: 'completed',
      user: 'System'
    },
    {
      id: '5',
      title: 'Notification Sent',
      description: 'Compliance team notified about high-risk clauses',
      timestamp: '2024-01-15T10:37:00Z',
      type: 'notification',
      status: 'completed',
      user: 'System'
    },
    {
      id: '6',
      title: 'Document Processing',
      description: 'Board_Resolution_Jan2024.pdf currently being analyzed',
      timestamp: '2024-01-13T09:45:00Z',
      type: 'processing',
      status: 'in_progress',
      user: 'Jane Smith'
    }
  ]

  // Mock data for reports
  const mockReports = [
    {
      id: '1',
      title: 'Monthly Compliance Report - January 2024',
      generatedDate: '2024-01-31T18:00:00Z',
      type: 'Monthly Summary',
      documentsIncluded: 15,
      averageScore: 78.5
    },
    {
      id: '2',
      title: 'Risk Assessment Report - Q1 2024',
      generatedDate: '2024-01-25T14:30:00Z', 
      type: 'Risk Analysis',
      documentsIncluded: 8,
      averageScore: 82.1
    },
    {
      id: '3',
      title: 'Regulatory Changes Impact Analysis',
      generatedDate: '2024-01-20T11:15:00Z',
      type: 'Impact Analysis',
      documentsIncluded: 12,
      averageScore: 75.3
    }
  ]

  // Initialize dashboard stats state
  const initialStats = {
    totalDocuments: 5,
    processedToday: 2,
    totalClauses: 65,
    compliantClauses: 44,
    nonCompliantClauses: 21,
    highRiskClauses: 8
  }

  // State declarations
  const [, setUploadedFiles] = useState<File[]>([])
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [documents, setDocuments] = useState(mockDocuments)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [timelineEvents, setTimelineEvents] = useState(mockTimelineEvents)
  const [reports, setReports] = useState(mockReports)
  const [dashboardStats, setDashboardStats] = useState(initialStats)

  // Convert dashboard stats to display format
  const getDisplayStats = (stats: typeof initialStats) => [
    {
      title: 'Total Clauses',
      value: stats.totalClauses.toString(),
      change: `${stats.processedToday} processed today`,
      trend: '+18.5%',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Compliant',
      value: stats.compliantClauses.toString(),
      change: `${((stats.compliantClauses / stats.totalClauses) * 100).toFixed(1)}% compliance rate`,
      trend: '+5.2%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Non-Compliant',
      value: stats.nonCompliantClauses.toString(),
      change: 'Requires attention',
      trend: '-2.1%',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-100',
    },
    {
      title: 'High Risk',
      value: stats.highRiskClauses.toString(),
      change: 'Immediate review needed',
      trend: '-1.5%',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
    },
  ]

  // Transform backend API results to expected dashboard analysis format
  const transformBackendResultsToAnalysis = (backendResults: any, document: any) => {
    const complianceResults = backendResults.compliance_results || []
    const clauses = backendResults.clauses || []
    
    // Calculate overall score based on compliance results
    const compliantCount = complianceResults.filter((r: any) => r.is_compliant).length
    const overallScore = complianceResults.length > 0 
      ? Math.round((compliantCount / complianceResults.length) * 100) 
      : 85

    // Determine risk level
    const highRiskCount = complianceResults.filter((r: any) => r.risk_assessment?.severity === 'High').length
    const mediumRiskCount = complianceResults.filter((r: any) => r.risk_assessment?.severity === 'Medium').length
    
    let riskLevel = 'low'
    if (highRiskCount > 0) riskLevel = 'high'
    else if (mediumRiskCount > 0) riskLevel = 'medium'

    // Group compliance areas
    const complianceAreas = {
      disclosureRequirements: {
        score: Math.max(50, overallScore - 5 + Math.random() * 10),
        issues: overallScore < 70 ? ['Missing mandatory disclosure statements'] : [],
        recommendations: ['Review SEBI disclosure guidelines']
      },
      boardGovernance: {
        score: Math.max(50, overallScore - 3 + Math.random() * 8),
        issues: overallScore < 80 ? ['Board composition needs review'] : [],
        recommendations: ['Ensure independent director requirements are met']
      },
      financialReporting: {
        score: Math.max(50, overallScore + Math.random() * 5),
        issues: overallScore < 75 ? ['Financial data presentation needs improvement'] : [],
        recommendations: ['Follow prescribed financial reporting formats']
      }
    }

    // Generate key findings
    const keyFindings = [
      `Document demonstrates ${riskLevel} risk profile`,
      `Overall compliance score of ${overallScore}%`,
      overallScore >= 80 ? 'Strong regulatory compliance' : 
      overallScore >= 60 ? 'Moderate compliance with improvement areas' : 
      'Significant compliance gaps identified',
      backendResults.summary || 'Analysis completed successfully'
    ]

    // Transform clause analysis
    const clauseAnalysis = complianceResults.map((result: any, index: number) => {
      const clause = clauses.find((c: any) => c.id === result.clause_id) || clauses[index]
      return {
        clauseNumber: `Section ${index + 1}`,
        content: clause?.text_en || clause?.text || `Clause ${index + 1}`,
        complianceStatus: result.is_compliant ? 'Compliant' : 'Non-Compliant',
        riskLevel: result.risk_assessment?.severity?.toLowerCase() || 'medium',
        recommendations: [
          result.explanation || 'Review compliance requirements',
          result.risk_assessment?.mitigation || 'Consult legal advisor'
        ]
      }
    })

    // Generate action items
    const actionItems = [
      'Review and address high-risk clauses immediately',
      'Schedule legal consultation for compliance gaps',
      'Update document templates based on findings',
      'Implement quarterly compliance review process'
    ]

    return {
      documentId: document.id,
      documentName: document.name,
      analysisDate: new Date().toISOString(),
      overallScore: overallScore,
      riskLevel: riskLevel,
      detailedAnalysis: {
        complianceAreas,
        keyFindings,
        clauseAnalysis
      },
      actionItems
    }
  }

  const handleFileSelect = (files: File[]) => {
    console.log('Selected files:', files)
    setUploadedFiles(files)
    // File processing will be handled by the FileUpload component with real API calls
  }

  const handleUploadComplete = (results?: any) => {
    console.log('Analysis completed, navigating to Analysis tab')
    if (results) {
      console.log('Enhanced analysis results received:', results)
      
      // Check if this is from our real-time analysis service (has enhanced structure)
      const isEnhancedResult = results.complianceAreas || results.clauseAnalysis
      
      let newDocument, analysisData
      
      if (isEnhancedResult) {
        // Handle enhanced real-time analysis results
        newDocument = {
          id: results.id || Date.now().toString(),
          name: results.fileName,
          uploadDate: results.uploadedAt,
          status: 'Completed',
          overallScore: results.overallScore,
          riskLevel: results.riskLevel,
          fileSize: results.fileSize,
          type: 'Legal Agreement',
          complianceScore: results.overallScore,
          clauses: results.totalClauses,
          summary: results.summary,
          results: results
        }
        
        // Create enhanced analysis data
        analysisData = {
          documentId: newDocument.id,
          documentName: newDocument.name,
          analysisDate: results.processedAt,
          overallScore: results.overallScore,
          riskLevel: results.riskLevel,
          detailedAnalysis: {
            complianceAreas: results.complianceAreas,
            keyFindings: results.keyFindings,
            clauseAnalysis: results.clauseAnalysis.map((clause: any) => ({
              clauseNumber: clause.section,
              content: clause.content,
              complianceStatus: clause.complianceStatus,
              riskLevel: clause.riskLevel,
              recommendations: clause.recommendations
            }))
          },
          actionItems: results.actionItems
        }
        
        // Update stats with enhanced data
        setDashboardStats(prev => ({
          ...prev,
          totalDocuments: prev.totalDocuments + 1,
          processedToday: prev.processedToday + 1,
          totalClauses: prev.totalClauses + results.totalClauses,
          compliantClauses: prev.compliantClauses + results.compliantClauses,
          nonCompliantClauses: prev.nonCompliantClauses + results.nonCompliantClauses,
          highRiskClauses: prev.highRiskClauses + results.highRiskClauses
        }))
        
      } else {
        // Handle legacy format (fallback)
        const complianceResults = results.compliance_results || []
        const compliantCount = complianceResults.filter((r: any) => r.is_compliant).length
        const overallScore = complianceResults.length > 0 
          ? Math.round((compliantCount / complianceResults.length) * 100) 
          : 85
        const highRiskCount = complianceResults.filter((r: any) => r.risk_assessment?.severity === 'High').length
        const nonCompliantCount = complianceResults.filter((r: any) => !r.is_compliant).length

        newDocument = {
          id: Date.now().toString(),
          name: results.fileName || `Document-${Date.now()}`,
          uploadDate: new Date().toISOString(),
          status: 'Processed',
          overallScore: overallScore,
          riskLevel: highRiskCount > 0 ? 'high' : 'low',
          fileSize: '2.5 MB',
          type: 'Legal Agreement',
          complianceScore: overallScore,
          clauses: complianceResults.length,
          summary: results.summary || '',
          results: results
        }

        analysisData = transformBackendResultsToAnalysis(results, newDocument)
        
        setDashboardStats(prev => ({
          ...prev,
          totalDocuments: prev.totalDocuments + 1,
          processedToday: prev.processedToday + 1,
          totalClauses: prev.totalClauses + complianceResults.length,
          compliantClauses: prev.compliantClauses + compliantCount,
          nonCompliantClauses: prev.nonCompliantClauses + nonCompliantCount,
          highRiskClauses: prev.highRiskClauses + highRiskCount
        }))
      }
      
      // Add to documents list
      setDocuments(prev => [newDocument as any, ...prev])
      
      // Add notification with enhanced message
      const newNotification = {
        id: Date.now().toString(),
        type: newDocument.overallScore >= 80 ? 'success' : newDocument.overallScore >= 60 ? 'info' : 'warning',
        title: 'FastAPI Analysis Complete',
        message: `${newDocument.name} analyzed - Score: ${newDocument.overallScore}% (${newDocument.riskLevel.toUpperCase()} risk)`,
        timestamp: new Date().toLocaleTimeString(),
        read: false,
        actionRequired: newDocument.overallScore < 70,
        action: 'View Analysis',
        actionUrl: `/dashboard/analysis/${newDocument.id}`
      }
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)])
      
      // Add enhanced timeline event
      const newTimelineEvent = {
        id: Date.now().toString(),
        type: 'analysis',
        title: 'FastAPI Analysis Completed',
        description: `Real-time analysis of ${newDocument.name} completed with ${isEnhancedResult ? results.totalClauses : 'multiple'} clauses processed`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'completed',
        user: 'FastAPI Backend'
      }
      setTimelineEvents(prev => [newTimelineEvent, ...prev.slice(0, 9)])
      
      // Generate comprehensive report
      const newReport = {
        id: Date.now().toString(),
        title: `FastAPI Compliance Analysis - ${newDocument.name}`,
        generatedDate: new Date().toISOString(),
        type: 'Real-time Analysis Report',
        documentsIncluded: 1,
        averageScore: newDocument.overallScore,
        date: new Date().toISOString().split('T')[0],
        status: 'Generated',
        summary: `FastAPI backend analysis: ${newDocument.overallScore}% compliance score, ${newDocument.riskLevel} risk level`,
        data: results
      }
      setReports(prev => [newReport as any, ...prev.slice(0, 9)])
      
      // Set analysis results and selected document
      setAnalysisResults(analysisData)
      setSelectedDocument(newDocument)
      
      // Store enhanced results for analysis page
      localStorage.setItem(`analysis_${newDocument.id}`, JSON.stringify({
        ...results,
        documentName: newDocument.name,
        uploadedAt: newDocument.uploadDate,
        analyzedAt: new Date().toISOString(),
        id: newDocument.id
      }))
    }
    setActiveTab('analysis')
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'info':
      default:
        return <Bell className="h-5 w-5 text-blue-600" />
    }
  }

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <Upload className="h-4 w-4 text-blue-600" />
      case 'analysis':
        return <Activity className="h-4 w-4 text-purple-600" />
      case 'assessment':
        return <BarChart3 className="h-4 w-4 text-green-600" />
      case 'report':
        return <FileText className="h-4 w-4 text-orange-600" />
      case 'notification':
        return <Bell className="h-4 w-4 text-cyan-600" />
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    console.log(`Marking notification ${notificationId} as read`)
  }

  const handleNotificationAction = (notificationId: string) => {
    console.log(`Taking action on notification ${notificationId}`)
  }

  const updateDashboardData = (analysisResult: any, documentId: string) => {
    const currentTime = new Date().toISOString()
    
    // Update document status
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              status: 'completed',
              overallScore: analysisResult.overallScore,
              riskLevel: analysisResult.riskLevel,
              lastAnalyzed: currentTime
            }
          : doc
      )
    )

    // Add new notification
    const newNotification = {
      id: Date.now().toString(),
      title: 'Document Analysis Complete',
      message: `${analysisResult.documentName} analysis finished with ${analysisResult.overallScore}% compliance score`,
      type: analysisResult.overallScore >= 80 ? 'success' : analysisResult.overallScore >= 60 ? 'info' : 'warning',
      timestamp: currentTime,
      read: false,
      actionRequired: analysisResult.overallScore < 70
    }

    setNotifications(prev => [newNotification, ...prev])

    // Add timeline events
    const analysisTimelineEvents = [
      {
        id: `analysis-start-${Date.now()}`,
        title: 'Analysis Started',
        description: `AI-powered compliance analysis initiated for ${analysisResult.documentName}`,
        timestamp: new Date(Date.now() - 2000).toISOString(),
        type: 'analysis',
        status: 'completed',
        user: 'System'
      },
      {
        id: `analysis-complete-${Date.now()}`,
        title: 'Analysis Complete',
        description: `Document analysis completed with ${analysisResult.overallScore}% compliance score`,
        timestamp: currentTime,
        type: 'assessment',
        status: 'completed',
        user: 'System'
      }
    ]

    setTimelineEvents(prev => [...analysisTimelineEvents, ...prev])

    // Create new report entry
    const newReport = {
      id: Date.now().toString(),
      title: `Analysis Report - ${analysisResult.documentName}`,
      generatedDate: currentTime,
      type: 'Document Analysis',
      documentsIncluded: 1,
      averageScore: analysisResult.overallScore,
      analysisResult: analysisResult
    }

    setReports(prev => [newReport, ...prev])

    // Update dashboard stats
    const updatedDocs = documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, overallScore: analysisResult.overallScore, riskLevel: analysisResult.riskLevel }
        : doc
    )

    const totalClauses = updatedDocs.length * 8 // Assuming ~8 clauses per document
    const avgScore = updatedDocs.reduce((acc, doc) => acc + doc.overallScore, 0) / updatedDocs.length
    const compliantClauses = Math.round((avgScore / 100) * totalClauses)
    const nonCompliantClauses = totalClauses - compliantClauses
    const highRiskClauses = updatedDocs.filter(doc => doc.overallScore < 50).length * 3


    setDashboardStats(prev => ({
      ...prev,
      totalClauses: totalClauses,
      compliantClauses: compliantClauses,
      nonCompliantClauses: nonCompliantClauses,
      highRiskClauses: highRiskClauses
    }))
  }

  const handleDownloadDocument = (docId: string, fileName: string) => {
    console.log(`Downloading document: ${fileName}`)
    
    // Create a mock file content for download
    const mockContent = `Mock document content for ${fileName}\nDocument ID: ${docId}\nGenerated on: ${new Date().toISOString()}`
    const blob = new Blob([mockContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    
    window.URL.revokeObjectURL(url)
  }

  const handleDownloadReport = (reportId: string, reportTitle: string) => {
    console.log(`Downloading report: ${reportTitle}`)
    
    const report = reports.find(r => r.id === reportId)
    if (!report) return
    
    // If the report has real data, use it; otherwise use summary
    const reportData = (report as any).data || { summary: (report as any).summary }
    
    if (reportData.compliance_results) {
      // Generate detailed compliance report
      let content = `SEBI COMPLIANCE ANALYSIS REPORT\n`
      content += `========================================\n\n`
      content += `Report: ${reportTitle}\n`
      content += `Generated: ${(report as any).date}\n`
      content += `Status: ${(report as any).status}\n\n`
      
      content += `SUMMARY\n`
      content += `-------\n`
      content += `${reportData.summary}\n\n`
      
      if (reportData.timelines) {
        content += `TIMELINES\n`
        content += `---------\n`
        Object.entries(reportData.timelines).forEach(([key, timeline]: [string, any]) => {
          content += `${key}: ${timeline.start} - ${timeline.end}\n`
          content += `Description: ${timeline.description}\n\n`
        })
      }
      
      content += `COMPLIANCE RESULTS\n`
      content += `------------------\n`
      reportData.compliance_results.forEach((result: any, index: number) => {
        content += `Clause ${index + 1}:\n`
        content += `  Compliant: ${result.is_compliant ? 'Yes' : 'No'}\n`
        content += `  Confidence: ${(result.confidence_score * 100).toFixed(1)}%\n`
        content += `  Risk Level: ${result.risk_assessment?.severity || 'Unknown'}\n`
        content += `  Explanation: ${result.explanation || 'No explanation provided'}\n\n`
      })
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportTitle.replace(/\s+/g, '_')}_${Date.now()}.txt`
      a.click()
      
      window.URL.revokeObjectURL(url)
    } else {
      // Simple text report
      const content = `${reportTitle}\n\nSummary: ${(report as any).summary}\nGenerated: ${(report as any).date}\nStatus: ${(report as any).status}`
      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportTitle.replace(/\s+/g, '_')}_${Date.now()}.txt`
      a.click()
      
      window.URL.revokeObjectURL(url)
    }
  }


  const handleGenerateReport = async (reportType: 'monthly' | 'risk' | 'compliance' | 'executive') => {
    setIsGeneratingReport(true)
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const currentDate = new Date()
      const overallScore = documents.reduce((acc, doc) => acc + doc.overallScore, 0) / documents.length || 0
      const highRiskDocs = documents.filter(doc => doc.riskLevel === 'high' || doc.overallScore < 50)
      const mediumRiskDocs = documents.filter(doc => doc.riskLevel === 'medium' && doc.overallScore >= 50 && doc.overallScore < 75)
      const lowRiskDocs = documents.filter(doc => doc.riskLevel === 'low' || doc.overallScore >= 75)

      let reportData: any = {
        type: reportType,
        generatedDate: currentDate.toISOString(),
        documentsAnalyzed: documents.length,
        overallScore: parseFloat(overallScore.toFixed(1)),
        generatedBy: 'SEBI Compliance System',
        version: '1.0'
      }

      switch (reportType) {
        case 'monthly':
          reportData = {
            ...reportData,
            title: `Monthly Compliance Report - ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
            reportPeriod: {
              startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
              endDate: currentDate.toISOString()
            },
            summary: `This monthly report provides a comprehensive overview of compliance activities for ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. ${documents.length} documents were analyzed with an average compliance score of ${overallScore.toFixed(1)}%.`,
            keyMetrics: {
              totalDocumentsProcessed: documents.length,
              averageComplianceScore: parseFloat(overallScore.toFixed(1)),
              highRiskDocuments: highRiskDocs.length,
              mediumRiskDocuments: mediumRiskDocs.length,
              lowRiskDocuments: lowRiskDocs.length,
              complianceRate: parseFloat(((lowRiskDocs.length / documents.length) * 100).toFixed(1))
            },
            trendAnalysis: {
              scoreImprovement: '+5.2%',
              riskReduction: '-15%',
              processingEfficiency: '+22%'
            },
            recommendations: [
              'Continue monitoring high-risk documents identified this month',
              'Implement automated alerts for compliance score drops',
              'Schedule quarterly training for legal document standards',
              'Review and update document templates based on common issues'
            ]
          }
          break

        case 'risk':
          reportData = {
            ...reportData,
            title: `Risk Assessment Report - ${currentDate.toLocaleDateString()}`,
            summary: `This risk assessment report identifies and categorizes compliance risks across ${documents.length} analyzed documents. Focus areas include high-risk clauses requiring immediate attention.`,
            riskBreakdown: {
              highRisk: {
                count: highRiskDocs.length,
                percentage: parseFloat(((highRiskDocs.length / documents.length) * 100).toFixed(1)),
                documents: highRiskDocs.map(doc => ({
                  name: doc.name,
                  score: doc.overallScore,
                  primaryRisks: ['Disclosure gaps', 'Regulatory non-compliance', 'Missing mandatory clauses']
                }))
              },
              mediumRisk: {
                count: mediumRiskDocs.length,
                percentage: parseFloat(((mediumRiskDocs.length / documents.length) * 100).toFixed(1)),
                documents: mediumRiskDocs.map(doc => ({
                  name: doc.name,
                  score: doc.overallScore,
                  primaryRisks: ['Minor compliance issues', 'Formatting inconsistencies']
                }))
              },
              lowRisk: {
                count: lowRiskDocs.length,
                percentage: parseFloat(((lowRiskDocs.length / documents.length) * 100).toFixed(1))
              }
            },
            criticalFindings: [
              'Board resolution documents show inconsistent disclosure patterns',
              'Contract clauses lack standardized SEBI compliance language',
              'Several documents missing mandatory regulatory statements'
            ],
            mitigationStrategies: [
              'Implement mandatory compliance checklist for all documents',
              'Create standardized clause library for common document types',
              'Establish review process for high-risk document categories',
              'Provide specialized training for document preparation teams'
            ]
          }
          break

        case 'compliance':
          reportData = {
            ...reportData,
            title: `Compliance Trends Analysis - ${currentDate.toLocaleDateString()}`,
            summary: `This report analyzes compliance trends and patterns over time, providing insights into organizational compliance maturity and areas of improvement.`,
            trendAnalysis: {
              overallTrend: 'Improving',
              scoreProgression: [
                { period: '3 months ago', score: 72.3 },
                { period: '2 months ago', score: 75.8 },
                { period: '1 month ago', score: 78.1 },
                { period: 'Current', score: overallScore }
              ],
              improvementRate: '+8.5%',
              consistencyScore: 85.2
            },
            complianceAreas: {
              disclosureRequirements: { score: 82.1, trend: 'up', change: '+3.2%' },
              boardGovernance: { score: 78.5, trend: 'up', change: '+1.8%' },
              financialReporting: { score: 85.3, trend: 'stable', change: '+0.5%' },
              relatedPartyTransactions: { score: 71.2, trend: 'up', change: '+5.1%' },
              shareholderRights: { score: 88.7, trend: 'stable', change: '-0.2%' }
            },
            benchmarking: {
              industryAverage: 74.5,
              performanceVsIndustry: parseFloat((overallScore - 74.5).toFixed(1)),
              ranking: 'Above Average'
            },
            actionItems: [
              'Focus improvement efforts on related party transaction documentation',
              'Maintain strong performance in shareholder rights compliance',
              'Establish continuous monitoring system for trend tracking',
              'Benchmark against peer organizations quarterly'
            ]
          }
          break

        case 'executive':
          reportData = {
            ...reportData,
            title: `Executive Compliance Summary - ${currentDate.toLocaleDateString()}`,
            summary: `Executive summary of compliance status across all business units and document types. This report provides strategic insights for senior management decision-making.`,
            executiveSummary: {
              overallStatus: overallScore >= 80 ? 'Strong' : overallScore >= 70 ? 'Satisfactory' : 'Needs Attention',
              keyAchievements: [
                `Maintained ${overallScore.toFixed(1)}% average compliance score`,
                `Successfully processed ${documents.length} documents this period`,
                'Implemented automated compliance monitoring system',
                'Reduced high-risk document count by 15%'
              ],
              majorConcerns: highRiskDocs.length > 0 ? [
                `${highRiskDocs.length} documents classified as high-risk`,
                'Potential regulatory scrutiny in disclosure areas',
                'Need for enhanced document review processes'
              ] : ['No major concerns identified'],
              strategicRecommendations: [
                'Invest in advanced compliance technology solutions',
                'Establish dedicated compliance review board',
                'Implement quarterly compliance training programs',
                'Develop proactive regulatory change management process'
              ]
            },
            financialImpact: {
              potentialSavings: '$250,000',
              riskMitigation: '$500,000',
              complianceCosts: '$75,000',
              netBenefit: '$675,000'
            },
            nextSteps: [
              'Schedule board presentation of compliance status',
              'Allocate resources for high-priority remediation',
              'Establish quarterly compliance review cycle',
              'Update compliance policies and procedures'
            ]
          }
          break
      }
      
      // Download the generated report
      const content = JSON.stringify(reportData, null, 2)
      const blob = new Blob([content], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportType}_report_${currentDate.toISOString().split('T')[0]}.json`
      a.click()
      
      window.URL.revokeObjectURL(url)
      
      console.log(`✅ Successfully generated ${reportType} report`)
    } catch (error) {
      console.error('Report generation failed:', error)
      alert('Report generation failed. Please try again.')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const handleViewDocument = async (docId: string) => {
    console.log(`Analyzing document with ID: ${docId}`)
    const document = documents.find(doc => doc.id === docId)
    
    if (!document) {
      console.error('Document not found:', docId)
      return
    }

    setSelectedDocument(document)
    setActiveTab('analysis')
    
    // Check if we already have analysis results from upload
    const storedResults = localStorage.getItem(`analysis_${docId}`)
    
    if (storedResults && (document as any).results) {
      try {
        const analysisData = JSON.parse(storedResults)
        const transformedAnalysis = transformBackendResultsToAnalysis(analysisData, document)
        setAnalysisResults(transformedAnalysis)
        return
      } catch (error) {
        console.error('Error loading stored analysis:', error)
      }
    }
    
    // If no stored results, show loading and generate analysis
    setAnalysisResults({ loading: true })
    
    try {
      // Simulate analysis process for mock documents or documents without results
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate mock analysis for documents that don't have backend results
      const mockAnalysis = {
        documentId: docId,
        documentName: document.name,
        analysisDate: new Date().toISOString(),
        overallScore: document.overallScore || 75,
        riskLevel: document.riskLevel || 'medium',
        detailedAnalysis: {
          complianceAreas: {
            disclosureRequirements: {
              score: Math.max(50, (document.overallScore || 75) - 10 + Math.random() * 20),
              issues: (document.overallScore || 75) < 70 ? ['Missing mandatory disclosure statements'] : [],
              recommendations: ['Review SEBI disclosure guidelines']
            },
            boardGovernance: {
              score: Math.max(50, (document.overallScore || 75) - 5 + Math.random() * 15),
              issues: (document.overallScore || 75) < 80 ? ['Board composition needs review'] : [],
              recommendations: ['Ensure independent director requirements are met']
            },
            financialReporting: {
              score: Math.max(50, (document.overallScore || 75) + Math.random() * 10),
              issues: (document.overallScore || 75) < 75 ? ['Financial data presentation needs improvement'] : [],
              recommendations: ['Follow prescribed financial reporting formats']
            }
          },
          keyFindings: [
            `Document demonstrates ${document.riskLevel || 'medium'} risk profile`,
            `Overall compliance score of ${document.overallScore || 75}%`,
            (document.overallScore || 75) >= 80 ? 'Strong regulatory compliance' : 
            (document.overallScore || 75) >= 60 ? 'Moderate compliance with improvement areas' : 
            'Significant compliance gaps identified',
            'Legal review recommended for high-risk clauses'
          ],
          clauseAnalysis: [
            {
              clauseNumber: 'Section 1.2',
              content: 'Board composition and independence requirements',
              complianceStatus: (document.overallScore || 75) >= 70 ? 'Compliant' : 'Non-Compliant',
              riskLevel: document.riskLevel || 'medium',
              recommendations: ['Verify independent director qualifications', 'Update board charter if needed']
            },
            {
              clauseNumber: 'Section 2.1', 
              content: 'Financial disclosure requirements',
              complianceStatus: (document.overallScore || 75) >= 80 ? 'Compliant' : 'Partially Compliant',
              riskLevel: (document.overallScore || 75) >= 80 ? 'low' : 'medium',
              recommendations: ['Enhance quarterly reporting', 'Include segment-wise revenue details']
            },
            {
              clauseNumber: 'Section 3.3',
              content: 'Related party transaction disclosures',
              complianceStatus: (document.overallScore || 75) >= 60 ? 'Compliant' : 'Non-Compliant',
              riskLevel: (document.overallScore || 75) >= 60 ? 'medium' : 'high',
              recommendations: ['Detail all material related party transactions', 'Provide board approval evidence']
            }
          ]
        },
        actionItems: [
          'Review and address high-risk clauses immediately',
          'Schedule legal consultation for compliance gaps', 
          'Update document templates based on findings',
          'Implement quarterly compliance review process'
        ]
      }
      
      setAnalysisResults(mockAnalysis)
      
      // Update dashboard data
      updateDashboardData(mockAnalysis, docId)
    } catch (error) {
      console.error('Analysis failed:', error)
      setAnalysisResults({ error: 'Analysis failed. Please try again.' })
    }
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
                <div className="flex items-center gap-2">
                  <BackendStatus />
                  <FastAPIStatus />
                </div>
              </div>
              <p className="text-muted-foreground">
                Monitor and analyze document compliance with SEBI regulations
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <ExportButton 
                data={getExportData()}
                fileName="sebi_compliance_export"
                variant="outline"
                size="sm"
              />
              <Button 
                onClick={() => handleGenerateReport('compliance')}
                disabled={isGeneratingReport}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isGeneratingReport ? 'Generating...' : 'New Report'}
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="space-y-8">
              {/* Quick Stats */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {getDisplayStats(dashboardStats).map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    >
                      <Card className="relative overflow-hidden transition-all hover:shadow-lg border border-gray-200 dark:border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </CardTitle>
                          <div className={`p-2 rounded-full ${stat.iconBg}`}>
                            <Icon className={`h-4 w-4 ${stat.color}`} />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-baseline justify-between">
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <Badge 
                              variant={stat.trend.startsWith('+') ? 'default' : 'secondary'} 
                              className="text-xs"
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {stat.trend}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                        </CardContent>
                        <div className={`absolute inset-x-0 bottom-0 h-1 ${stat.bgColor.replace('50', '200')}`} />
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* File Upload Section */}
                <motion.div 
                  className="lg:col-span-2 space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload Documents
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Upload PDF documents for SEBI compliance verification
                      </p>
                    </CardHeader>
                    <CardContent>
                      <FileUpload
                        maxFiles={5}
                        maxSize={10 * 1024 * 1024}
                        acceptedTypes={['.pdf']}
                        onFileSelect={handleFileSelect}
                        onUploadComplete={handleUploadComplete}
                        language="en"
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Sidebar */}
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <LLMProviderSelector 
                    selectedProvider="gemini"
                    onProviderChange={(provider) => {
                      console.log('Selected provider:', provider)
                    }}
                  />
                </motion.div>
              </div>

              {/* Charts Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Compliance Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<ChartLoading />}>
                      <ComplianceChart data={complianceData} riskData={riskData} />
                    </Suspense>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Documents Tab Content */}
            <TabsContent value="documents" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{documents.length}</p>
                    <p className="text-sm text-muted-foreground">Total Documents</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {documents.filter(d => d.status === 'completed').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {documents.filter(d => d.status === 'processing').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Processing</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">
                      {(documents.filter(d => d.status === 'completed').reduce((acc, doc) => acc + doc.overallScore, 0) / documents.filter(d => d.status === 'completed').length || 0).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Recent Documents
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('overview')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Upload New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <h3 className="font-semibold">{doc.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{doc.fileSize}</span>
                              <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                              {doc.status === 'completed' && (
                                <span>Score: {doc.overallScore}%</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.status === 'completed' ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              Processing
                            </Badge>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDocument(doc.id)}
                            title="Analyse Document"
                          >
                            <Activity className="h-4 w-4 mr-2" />
                            Analyse
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadDocument(doc.id, doc.name)}
                            title="Download Document"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigator.share ? navigator.share({ title: doc.name, url: window.location.href }) : console.log('Share not supported')}
                            title="Share Document"
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analysis Tab Content */}
            <TabsContent value="analysis" className="space-y-6">
              {!selectedDocument && !analysisResults ? (
                // Default Analysis View
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Document Analysis</h3>
                  <p className="text-muted-foreground mb-6">
                    Select a document from the Documents section to view detailed compliance analysis
                  </p>
                  <Button onClick={() => setActiveTab('documents')} variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Go to Documents
                  </Button>
                </div>
              ) : analysisResults?.loading ? (
                // Loading State
                <div className="text-center py-12">
                  <RefreshCw className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
                  <h3 className="text-xl font-semibold mb-2">Analyzing Document</h3>
                  <p className="text-muted-foreground">
                    AI-powered compliance analysis in progress for "{selectedDocument?.name}"
                  </p>
                </div>
              ) : analysisResults?.error ? (
                // Error State
                <div className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
                  <p className="text-muted-foreground mb-6">{analysisResults.error}</p>
                  <Button onClick={() => setActiveTab('documents')} variant="outline">
                    Back to Documents
                  </Button>
                </div>
              ) : (
                // Analysis Results
                <>
                  {/* Document Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">Document Analysis</h2>
                      <p className="text-muted-foreground">
                        Detailed compliance analysis for {analysisResults?.documentName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setActiveTab('documents')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Back to Documents
                      </Button>
                      <ExportButton 
                        data={getExportData()}
                        fileName={`analysis_${analysisResults?.documentName || 'document'}`}
                        variant="outline"
                        size="default"
                      />
                    </div>
                  </div>

                  {/* Analysis Overview Cards */}
                  <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className={`text-3xl font-bold ${
                          analysisResults?.overallScore >= 80 ? 'text-green-600' :
                          analysisResults?.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {analysisResults?.overallScore}%
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Badge 
                          variant={
                            analysisResults?.riskLevel === 'low' ? 'default' :
                            analysisResults?.riskLevel === 'medium' ? 'secondary' : 'destructive'
                          }
                          className="text-sm"
                        >
                          {analysisResults?.riskLevel?.toUpperCase()} RISK
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">Risk Level</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-2xl font-bold">
                          {analysisResults?.detailedAnalysis?.clauseAnalysis?.length || 0}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Clauses Analyzed</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {analysisResults?.actionItems?.length || 0}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Action Items</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Compliance Areas Analysis */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Compliance Areas Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        {Object.entries(analysisResults?.detailedAnalysis?.complianceAreas || {}).map(([area, data]: [string, any]) => (
                          <div key={area} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold capitalize">{area.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <span className={`text-lg font-bold ${
                                data.score >= 80 ? 'text-green-600' :
                                data.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {data.score?.toFixed(1)}%
                              </span>
                            </div>
                            {data.issues?.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-red-600 mb-1">Issues:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {data.issues.map((issue: string, idx: number) => (
                                    <li key={idx}>• {issue}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium mb-1">Recommendations:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {data.recommendations?.map((rec: string, idx: number) => (
                                  <li key={idx}>• {rec}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Findings */}
                  <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Key Findings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysisResults?.detailedAnalysis?.keyFindings?.map((finding: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{finding}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Action Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysisResults?.actionItems?.map((action: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">
                                {typeof action === 'string' ? action : action?.title || action?.description || 'Action item'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Clause Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Clause Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysisResults?.detailedAnalysis?.clauseAnalysis?.map((clause: any, idx: number) => (
                          <motion.div
                            key={idx}
                            className="border rounded-lg p-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">{clause.clauseNumber}</span>
                                <Badge 
                                  variant={clause.complianceStatus === 'Compliant' ? 'default' : 'destructive'}
                                  className="text-xs"
                                >
                                  {clause.complianceStatus}
                                </Badge>
                                <Badge 
                                  variant={
                                    clause.riskLevel === 'Low' ? 'outline' :
                                    clause.riskLevel === 'Medium' ? 'secondary' : 'destructive'
                                  }
                                  className="text-xs"
                                >
                                  {clause.riskLevel} Risk
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{clause.content}</p>
                            <div>
                              <p className="text-sm font-medium mb-2">Recommendations:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {clause.recommendations?.map((rec: string, recIdx: number) => (
                                  <li key={recIdx}>• {rec}</li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Reports Tab Content */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{reports.length}</p>
                    <p className="text-sm text-muted-foreground">Total Reports</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {reports.filter(r => r.type === 'Monthly Summary').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Monthly</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {reports.filter(r => r.type === 'Risk Analysis').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Risk Analysis</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">
                      {reports.length > 0 
                        ? (reports.reduce((acc, report) => acc + (report.averageScore || 85), 0) / reports.length).toFixed(1) 
                        : '0'}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Generated Reports
                        </CardTitle>
                        <Button 
                          onClick={() => handleGenerateReport('monthly')}
                          disabled={isGeneratingReport}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reports.map((report, index) => (
                          <motion.div
                            key={report.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                <BarChart3 className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{report.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{new Date(report.generatedDate).toLocaleDateString()}</span>
                                  <span>{report.documentsIncluded} documents</span>
                                  <span>Score: {report.averageScore}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{report.type}</Badge>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => console.log(`Viewing report: ${report.title}`)}
                                title="View Report"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadReport(report.id, report.title)}
                                title="Download Report"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigator.share ? navigator.share({ title: report.title, url: window.location.href }) : console.log('Share not supported')}
                                title="Share Report"
                              >
                                <Share className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => handleGenerateReport('monthly')}
                        disabled={isGeneratingReport}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Monthly Report
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => handleGenerateReport('risk')}
                        disabled={isGeneratingReport}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Risk Assessment
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => handleGenerateReport('compliance')}
                        disabled={isGeneratingReport}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Compliance Trends
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => handleGenerateReport('executive')}
                        disabled={isGeneratingReport}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Executive Summary
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Scheduled Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly Summary</span>
                          <span className="text-muted-foreground">1st of month</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quarterly Review</span>
                          <span className="text-muted-foreground">End of quarter</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk Assessment</span>
                          <span className="text-muted-foreground">Weekly</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab Content */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {notifications.filter(n => !n.read).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Unread</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {notifications.filter(n => n.actionRequired).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Action Required</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {notifications.filter(n => n.type === 'info').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Informational</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">
                      {notifications.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Recent Notifications
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Mark all as read')}
                      >
                        Mark All Read
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Clear all notifications')}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                          !notification.read ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10' : ''
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex-shrink-0 pt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className={`font-semibold ${!notification.read ? 'text-blue-900 dark:text-blue-100' : ''}`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </span>
                                {notification.actionRequired && (
                                  <Badge variant="secondary" className="text-xs">
                                    Action Required
                                  </Badge>
                                )}
                                {!notification.read && (
                                  <Badge variant="default" className="text-xs bg-blue-600">
                                    New
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {notification.actionRequired && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleNotificationAction(notification.id)}
                                >
                                  Take Action
                                </Button>
                              )}
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markNotificationAsRead(notification.id)}
                                  title="Mark as read"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timeline Tab Content */}
            <TabsContent value="timeline" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {timelineEvents.filter(e => e.type === 'upload').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Uploads</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {timelineEvents.filter(e => e.type === 'analysis').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Analyses</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {timelineEvents.filter(e => e.status === 'completed').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {timelineEvents.filter(e => e.status === 'in_progress').length}
                    </p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Activity Timeline
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Filter timeline')}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <ExportButton 
                        data={getExportData()}
                        fileName="timeline_export"
                        variant="outline"
                        size="sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                    <div className="space-y-6">
                      {timelineEvents.map((event, index) => (
                        <motion.div
                          key={event.id}
                          className="relative flex items-start gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 ${
                            event.status === 'completed' 
                              ? 'bg-green-100 dark:bg-green-900/30' 
                              : event.status === 'in_progress'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            {getTimelineIcon(event.type)}
                          </div>
                          <div className="flex-1 min-w-0 pb-6">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{event.title}</h4>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={event.status === 'completed' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {event.status === 'in_progress' ? (
                                    <>
                                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                      In Progress
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Completed
                                    </>
                                  )}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(event.timestamp).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-muted-foreground">
                                By: {event.user}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  )
}