// Real-time Analysis Processing Service
// Manages document upload, processing, and analysis flow with FastAPI backend

import { FastAPIService, FastAPIDataTransformer, FastAPIResponse } from './fastapi-client'
import { ErrorHandler } from './error-handler'

// Types for real-time analysis
export interface AnalysisSession {
  id: string
  fileName: string
  fileSize: number
  startTime: Date
  status: 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error'
  progress: number
  currentStage: string
  error?: string
  result?: ProcessedDocument
}

export interface ProcessedDocument {
  id: string
  fileName: string
  fileSize: string
  uploadedAt: string
  processedAt: string
  
  // Analysis metrics
  summary: string
  overallScore: number
  riskLevel: 'low' | 'medium' | 'high'
  totalClauses: number
  compliantClauses: number
  nonCompliantClauses: number
  highRiskClauses: number
  
  // Detailed data
  timelines: Record<string, any>
  clauses: any[]
  complianceResults: any[]
  
  // Analysis breakdown
  complianceAreas: Record<string, ComplianceArea>
  keyFindings: string[]
  actionItems: string[]
  clauseAnalysis: ClauseAnalysis[]
}

export interface ComplianceArea {
  score: number
  issues: string[]
  recommendations: string[]
  status: 'compliant' | 'partially_compliant' | 'non_compliant'
}

export interface ClauseAnalysis {
  id: string
  section: string
  content: string
  complianceStatus: 'Compliant' | 'Partially Compliant' | 'Non-Compliant'
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number
  recommendations: string[]
  matchedRules: any[]
}

// Analysis stages for progress tracking
const ANALYSIS_STAGES = {
  UPLOADING: { name: 'Uploading document...', progress: 10 },
  EXTRACTING: { name: 'Extracting text content...', progress: 25 },
  SUMMARIZING: { name: 'Generating document summary...', progress: 45 },
  ANALYZING: { name: 'Analyzing clauses for compliance...', progress: 70 },
  FINALIZING: { name: 'Finalizing analysis results...', progress: 90 },
  COMPLETED: { name: 'Analysis completed!', progress: 100 }
}

export class RealTimeAnalysisService {
  private static sessions: Map<string, AnalysisSession> = new Map()
  private static listeners: Map<string, ((session: AnalysisSession) => void)[]> = new Map()

  /**
   * Start a new analysis session
   */
  static startAnalysis(file: File, language: string = 'en'): string {
    const sessionId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const session: AnalysisSession = {
      id: sessionId,
      fileName: file.name,
      fileSize: file.size,
      startTime: new Date(),
      status: 'uploading',
      progress: 0,
      currentStage: ANALYSIS_STAGES.UPLOADING.name
    }

    this.sessions.set(sessionId, session)
    this.listeners.set(sessionId, [])

    // Start processing asynchronously
    this.processDocument(sessionId, file, language).catch(error => {
      console.error('Analysis processing failed:', error)
      this.updateSession(sessionId, {
        status: 'error',
        error: error.message,
        currentStage: 'Processing failed'
      })
    })

    return sessionId
  }

  /**
   * Subscribe to analysis updates
   */
  static subscribe(sessionId: string, callback: (session: AnalysisSession) => void): () => void {
    const listeners = this.listeners.get(sessionId) || []
    listeners.push(callback)
    this.listeners.set(sessionId, listeners)

    // Return unsubscribe function
    return () => {
      const currentListeners = this.listeners.get(sessionId) || []
      const index = currentListeners.indexOf(callback)
      if (index > -1) {
        currentListeners.splice(index, 1)
        this.listeners.set(sessionId, currentListeners)
      }
    }
  }

  /**
   * Get session status
   */
  static getSession(sessionId: string): AnalysisSession | undefined {
    return this.sessions.get(sessionId)
  }

  /**
   * Process document through FastAPI backend
   */
  private static async processDocument(sessionId: string, file: File, language: string) {
    try {
      // Update progress during upload
      const progressCallback = (progress: { loaded: number; total: number; percentage: number }) => {
        this.updateSession(sessionId, {
          status: 'uploading',
          progress: Math.min(ANALYSIS_STAGES.UPLOADING.progress + (progress.percentage * 0.15), 25),
          currentStage: `${ANALYSIS_STAGES.UPLOADING.name} ${progress.percentage}%`
        })
      }

      // Update to extracting stage
      this.updateSession(sessionId, {
        status: 'processing',
        progress: ANALYSIS_STAGES.EXTRACTING.progress,
        currentStage: ANALYSIS_STAGES.EXTRACTING.name
      })

      let backendResponse
      let usingMockData = false
      
      try {
        // Check backend availability first
        const isBackendAvailable = await FastAPIService.checkBackendAvailability()
        if (!isBackendAvailable) {
          console.warn('⚠️ FastAPI backend not available, using enhanced mock data')
          throw new Error('Backend not available')
        }

        // Attempt to call FastAPI backend
        backendResponse = await FastAPIService.uploadDocument(
          { file, lang: language },
          progressCallback
        )
        console.log('✅ Real FastAPI backend response received')
      } catch (fastAPIError) {
        console.warn('⚠️ FastAPI backend call failed, using enhanced mock data:', fastAPIError)
        usingMockData = true
        
        // Use enhanced mock data that matches FastAPI structure
        backendResponse = {
          summary: `This is a comprehensive analysis of ${file.name}. The document contains various legal clauses that have been analyzed for SEBI compliance. Key areas covered include disclosure requirements, board governance, financial reporting standards, and risk management protocols.`,
          timelines: {
            effective_date: {
              start: '2024-01-01',
              end: '2024-12-31',
              description: 'Document effective period'
            },
            review_period: {
              start: '2024-06-01',
              end: '2024-06-30',
              description: 'Quarterly review period'
            }
          },
          clauses: Array.from({ length: 8 }, (_, i) => ({
            id: `clause_${i + 1}`,
            text: `Clause ${i + 1}: This clause addresses compliance requirements for ${['disclosure', 'governance', 'reporting', 'risk management'][i % 4]} as per SEBI regulations.`,
            text_en: `Clause ${i + 1}: This clause addresses compliance requirements for ${['disclosure', 'governance', 'reporting', 'risk management'][i % 4]} as per SEBI regulations.`
          })),
          compliance_results: Array.from({ length: 8 }, (_, i) => ({
            clause_id: `clause_${i + 1}`,
            is_compliant: Math.random() > 0.3, // 70% compliant
            confidence_score: 0.8 + Math.random() * 0.2,
            matched_rules: [{
              rule_text: `SEBI LODR Regulation ${i + 1}.${i + 1}`,
              score: 0.85,
              metadata: {},
              is_relevant: true,
              reason: 'High relevance match'
            }],
            risk_assessment: {
              severity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
              category: ['Legal', 'Financial', 'Operational'][Math.floor(Math.random() * 3)],
              score: Math.random(),
              impact: 'Moderate impact on compliance',
              mitigation: 'Review and update clause as needed'
            },
            explanation: `This clause ${Math.random() > 0.3 ? 'meets' : 'does not meet'} the required SEBI standards for compliance.`
          }))
        }
      }

      // Update to analyzing stage
      this.updateSession(sessionId, {
        status: 'analyzing',
        progress: ANALYSIS_STAGES.ANALYZING.progress,
        currentStage: ANALYSIS_STAGES.ANALYZING.name
      })

      // Transform and enrich data
      const processedDocument = await this.enrichAnalysisData(backendResponse as FastAPIResponse, file)
      
      // Add note if using mock data
      if (usingMockData) {
        processedDocument.summary = `[MOCK DATA] ${processedDocument.summary}\n\nNote: FastAPI backend not available. This is enhanced mock data for development. To use real analysis, please start the FastAPI server at http://127.0.0.1:8000`
      }

      // Update to finalizing stage
      this.updateSession(sessionId, {
        status: 'analyzing',
        progress: ANALYSIS_STAGES.FINALIZING.progress,
        currentStage: ANALYSIS_STAGES.FINALIZING.name
      })

      // Complete analysis
      this.updateSession(sessionId, {
        status: 'completed',
        progress: ANALYSIS_STAGES.COMPLETED.progress,
        currentStage: ANALYSIS_STAGES.COMPLETED.name,
        result: processedDocument
      })

    } catch (error) {
      // Use enhanced error handling
      const appError = ErrorHandler.handleAnalysisError(error, { 
        sessionId, 
        fileName: file.name,
        language 
      })
      throw new Error(ErrorHandler.getUserMessage(appError))
    }
  }

  /**
   * Enrich backend data with additional analysis
   */
  private static async enrichAnalysisData(backendData: FastAPIResponse, file: File): Promise<ProcessedDocument> {
    const baseData = FastAPIDataTransformer.transformToFrontend(backendData, file.name)
    
    // Generate compliance areas analysis
    const complianceAreas = this.generateComplianceAreas(baseData.complianceResults)
    
    // Generate key findings
    const keyFindings = this.generateKeyFindings(baseData)
    
    // Generate action items
    const actionItems = this.generateActionItems(baseData.complianceResults)
    
    // Format clause analysis
    const clauseAnalysis = this.formatClauseAnalysis(baseData.complianceResults, baseData.clauses)

    return {
      id: `doc_${Date.now()}`,
      fileName: file.name,
      fileSize: this.formatFileSize(file.size),
      uploadedAt: baseData.uploadedAt,
      processedAt: baseData.processedAt,
      
      // Basic metrics
      summary: baseData.summary,
      overallScore: baseData.overallScore,
      riskLevel: baseData.riskLevel as 'low' | 'medium' | 'high',
      totalClauses: baseData.totalClauses,
      compliantClauses: baseData.compliantCount,
      nonCompliantClauses: baseData.nonCompliantCount,
      highRiskClauses: baseData.highRiskCount,
      
      // Raw data
      timelines: baseData.timelines,
      clauses: baseData.clauses,
      complianceResults: baseData.complianceResults,
      
      // Enhanced analysis
      complianceAreas,
      keyFindings,
      actionItems,
      clauseAnalysis
    }
  }

  /**
   * Generate compliance areas breakdown
   */
  private static generateComplianceAreas(complianceResults: any[]): Record<string, ComplianceArea> {
    const areas: Record<string, ComplianceArea> = {
      disclosureRequirements: { score: 0, issues: [], recommendations: [], status: 'compliant' },
      boardGovernance: { score: 0, issues: [], recommendations: [], status: 'compliant' },
      financialReporting: { score: 0, issues: [], recommendations: [], status: 'compliant' },
      riskManagement: { score: 0, issues: [], recommendations: [], status: 'compliant' }
    }

    // Analyze each compliance result and categorize
    complianceResults.forEach(result => {
      const category = this.categorizeClause(result)
      const area = areas[category as keyof typeof areas]
      
      if (area) {
        area.score += result.isCompliant ? 1 : 0
        
        if (!result.isCompliant) {
          area.issues.push(result.explanation || 'Non-compliant clause detected')
          area.recommendations.push(result.mitigation || 'Review and update clause')
          area.status = 'non_compliant'
        }
      }
    })

    // Calculate percentages and finalize status
    Object.keys(areas).forEach(key => {
      const area = areas[key]
      if (area) {
        const totalForArea = Math.ceil(complianceResults.length / 4) // Distribute evenly
        area.score = totalForArea > 0 ? Math.round((area.score / totalForArea) * 100) : 100
        
        if (area.score >= 80) area.status = 'compliant'
        else if (area.score >= 60) area.status = 'partially_compliant'
        else area.status = 'non_compliant'
      }
    })

    return areas
  }

  /**
   * Categorize clause into compliance area
   */
  private static categorizeClause(result: any): string {
    const text = (result.clauseText || '').toLowerCase()
    
    if (text.includes('disclosure') || text.includes('report')) return 'disclosureRequirements'
    if (text.includes('board') || text.includes('director')) return 'boardGovernance' 
    if (text.includes('financial') || text.includes('audit')) return 'financialReporting'
    return 'riskManagement'
  }

  /**
   * Generate key findings from analysis
   */
  private static generateKeyFindings(data: any): string[] {
    const findings = []
    
    findings.push(`Document contains ${data.totalClauses} clauses requiring compliance review`)
    findings.push(`Overall compliance score: ${data.overallScore}% (${this.getScoreDescription(data.overallScore)})`)
    
    if (data.highRiskCount > 0) {
      findings.push(`${data.highRiskCount} high-risk clauses identified requiring immediate attention`)
    }
    
    if (data.riskLevel === 'high') {
      findings.push('Document classified as HIGH RISK - legal review recommended')
    } else if (data.riskLevel === 'medium') {
      findings.push('Document has MEDIUM RISK profile - some compliance improvements needed')
    } else {
      findings.push('Document has LOW RISK profile - generally compliant')
    }
    
    findings.push(`Processing completed in real-time using AI-powered compliance analysis`)
    
    return findings
  }

  /**
   * Generate action items based on compliance results
   */
  private static generateActionItems(complianceResults: any[]): string[] {
    const items = []
    const nonCompliantCount = complianceResults.filter(r => !r.isCompliant).length
    const highRiskCount = complianceResults.filter(r => r.riskLevel === 'high').length
    
    if (highRiskCount > 0) {
      items.push(`Immediate review required for ${highRiskCount} high-risk clause${highRiskCount > 1 ? 's' : ''}`)
    }
    
    if (nonCompliantCount > 0) {
      items.push(`Update ${nonCompliantCount} non-compliant clause${nonCompliantCount > 1 ? 's' : ''} to meet SEBI requirements`)
    }
    
    items.push('Schedule legal consultation for comprehensive compliance review')
    items.push('Implement compliance monitoring system for ongoing assessment')
    items.push('Document all changes and maintain audit trail')
    
    return items
  }

  /**
   * Format clause analysis for display
   */
  private static formatClauseAnalysis(complianceResults: any[], clauses: any[]): ClauseAnalysis[] {
    return complianceResults.map((result, index) => ({
      id: result.id || `clause_${index + 1}`,
      section: `Section ${index + 1}`,
      content: result.clauseText || `Clause ${index + 1} content`,
      complianceStatus: result.isCompliant ? 'Compliant' : 'Non-Compliant',
      riskLevel: result.riskLevel || 'medium',
      confidence: result.confidence || 85,
      recommendations: [
        result.explanation || 'Review clause for compliance',
        result.mitigation || 'Consult legal advisor for guidance'
      ],
      matchedRules: result.matchedRules || []
    }))
  }

  /**
   * Update session and notify listeners
   */
  private static updateSession(sessionId: string, updates: Partial<AnalysisSession>) {
    const session = this.sessions.get(sessionId)
    if (!session) return

    const updatedSession = { ...session, ...updates }
    this.sessions.set(sessionId, updatedSession)

    // Notify all listeners
    const listeners = this.listeners.get(sessionId) || []
    listeners.forEach(callback => callback(updatedSession))
  }

  /**
   * Utility functions
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  private static getScoreDescription(score: number): string {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 70) return 'Satisfactory'
    if (score >= 60) return 'Needs Improvement'
    return 'Poor'
  }

  /**
   * Cleanup completed sessions
   */
  static cleanup(maxAge: number = 3600000) { // 1 hour
    const now = Date.now()
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.startTime.getTime() > maxAge) {
        this.sessions.delete(sessionId)
        this.listeners.delete(sessionId)
      }
    }
  }
}

export default RealTimeAnalysisService