// lib/realtime-analysis.ts
import { FastAPIService } from './fastapi-services';
import { ErrorHandler } from './error-handler';

// Analysis session status types
type AnalysisStatus = 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error';

// Analysis stages configuration
const ANALYSIS_STAGES = {
  UPLOADING: { name: 'Uploading document', progress: 10 },
  EXTRACTING: { name: 'Extracting text content', progress: 25 },
  ANALYZING: { name: 'Analyzing compliance', progress: 70 },
  FINALIZING: { name: 'Finalizing results', progress: 90 },
  COMPLETED: { name: 'Analysis complete', progress: 100 }
};

// Analysis session interface
interface AnalysisSession {
  id: string;
  fileName: string;
  fileSize: number;
  startTime: Date;
  status: AnalysisStatus;
  progress: number;
  currentStage: string;
  result?: ProcessedDocument;
  error?: string;
}

// Processed document interface
interface ProcessedDocument {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  processedAt: string;
  summary: string;
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  totalClauses: number;
  compliantClauses: number;
  nonCompliantClauses: number;
  highRiskClauses: number;
  timelines: Record<string, any>;
  clauses: any[];
  complianceResults: any[];
  complianceAreas: any[];
  keyFindings: any[];
  actionItems: any[];
  clauseAnalysis: any[];
}

// FastAPI response type
type FastAPIResponse = {
  summary: string;
  timelines: Record<string, any>;
  clauses: any[];
  compliance_results: any;
  compliance_score?: number;
  risk_level?: string;
  uploaded_at?: string;
  processed_at?: string;
};

export class RealTimeAnalysisService {
  private static sessions: Map<string, AnalysisSession> = new Map();
  private static listeners: Map<string, ((session: AnalysisSession) => void)[]> = new Map();

  static startAnalysis(file: File, language: string = 'en'): string {
    const sessionId = `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    const session: AnalysisSession = {
      id: sessionId,
      fileName: file.name,
      fileSize: file.size,
      startTime: new Date(),
      status: 'uploading',
      progress: 0,
      currentStage: ANALYSIS_STAGES.UPLOADING.name,
    };

    this.sessions.set(sessionId, session);
    this.listeners.set(sessionId, []);

    // Start processing asynchronously
    this.processDocument(sessionId, file, language).catch((error) => {
      console.error('Analysis processing failed:', error); // Likely line ~90
      this.updateSession(sessionId, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        currentStage: 'Processing failed',
        progress: 100,
      });
    });

    return sessionId;
  }

  static subscribe(sessionId: string, callback: (session: AnalysisSession) => void): () => void {
    const listeners = this.listeners.get(sessionId) || [];
    listeners.push(callback);
    this.listeners.set(sessionId, listeners);

    // Send initial state
    const session = this.sessions.get(sessionId);
    if (session) callback(session);

    // Return unsubscribe function
    return () => {
      const currentListeners = this.listeners.get(sessionId) || [];
      const index = currentListeners.indexOf(callback);
      if (index > -1) {
        currentListeners.splice(index, 1);
        this.listeners.set(sessionId, currentListeners);
      }
    };
  }

  static getSession(sessionId: string): AnalysisSession | undefined {
    return this.sessions.get(sessionId);
  }

  private static async processDocument(sessionId: string, file: File, language: string) {
    try {
      // Update progress during upload
      const progressCallback = (percentage: number) => {
        this.updateSession(sessionId, {
          status: 'uploading',
          progress: Math.min(ANALYSIS_STAGES.UPLOADING.progress + percentage * 0.15, 25),
          currentStage: `${ANALYSIS_STAGES.UPLOADING.name} ${Math.round(percentage)}%`,
        });
      };

      // Update to extracting stage
      this.updateSession(sessionId, {
        status: 'processing',
        progress: ANALYSIS_STAGES.EXTRACTING.progress,
        currentStage: ANALYSIS_STAGES.EXTRACTING.name,
      });

      let backendResponse: any;
      let usingMockData = false;

      try {
        // Check backend availability
        const healthCheck = await FastAPIService.healthCheck();
        if (healthCheck.status !== 'healthy') {
          throw new Error('Backend not available');
        }

        // Upload document
        backendResponse = await FastAPIService.uploadDocument(file, language, progressCallback);
        console.log('✅ Real FastAPI backend response received');
      } catch (fastAPIError) {
        console.warn('⚠ FastAPI backend call failed, using mock data:', fastAPIError);
        usingMockData = true;

        // Mock data matching FastAPI structure
        backendResponse = {
          summary: `Analysis of ${file.name} for SEBI compliance.`,
          compliance_score: 85,
          risk_level: 'medium',
          clauses: Array.from({ length: 8 }, (_, i) => ({
            id: `clause_${i + 1}`,
            text: `Clause ${i + 1}: Compliance requirement for ${['disclosure', 'governance', 'reporting', 'risk management'][i % 4]}.`,
            text_en: `Clause ${i + 1}: Compliance requirement for ${['disclosure', 'governance', 'reporting', 'risk management'][i % 4]}.`,
          })),
          compliance_results: Array.from({ length: 8 }, (_, i) => ({
            clause_id: `clause_${i + 1}`,
            is_compliant: Math.random() > 0.3,
            confidence_score: 0.8 + Math.random() * 0.2,
            matched_rules: [{
              rule_text: `SEBI LODR Regulation ${i + 1}.${i + 1}`,
              score: 0.85,
              metadata: {},
              is_relevant: true,
              reason: 'High relevance match',
            }],
            risk_assessment: {
              severity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
              category: ['Legal', 'Financial', 'Operational'][Math.floor(Math.random() * 3)],
              score: Math.random(),
              impact: 'Moderate impact on compliance',
              mitigation: 'Review and update clause as needed',
            },
            explanation: `This clause ${Math.random() > 0.3 ? 'meets' : 'does not meet'} SEBI standards.`,
          })),
          uploaded_at: new Date().toISOString(),
          processed_at: new Date().toISOString(),
        };
      }

      // Update to analyzing stage
      this.updateSession(sessionId, {
        status: 'analyzing',
        progress: ANALYSIS_STAGES.ANALYZING.progress,
        currentStage: ANALYSIS_STAGES.ANALYZING.name,
      });

      // Transform and enrich data
      const processedDocument = await this.enrichAnalysisData(backendResponse, file);

      // Add mock data note
      if (usingMockData) {
        processedDocument.summary = `[MOCK DATA] ${processedDocument.summary}\n\nNote: FastAPI backend not available. Start the FastAPI server at http://127.0.0.1:8000 for real analysis.`;
      }

      // Update to finalizing stage
      this.updateSession(sessionId, {
        status: 'analyzing',
        progress: ANALYSIS_STAGES.FINALIZING.progress,
        currentStage: ANALYSIS_STAGES.FINALIZING.name,
      });

      // Complete analysis
      this.updateSession(sessionId, {
        status: 'completed',
        progress: ANALYSIS_STAGES.COMPLETED.progress,
        currentStage: ANALYSIS_STAGES.COMPLETED.name,
        result: processedDocument,
      });
    } catch (error) {
      const appError = ErrorHandler.handleAnalysisError(error, {
        sessionId,
        fileName: file.name,
        language,
      });
      this.updateSession(sessionId, {
        status: 'error',
        error: ErrorHandler.getUserMessage(appError),
        currentStage: 'Processing failed',
        progress: 100,
      });
      throw error; // Re-throw for FileUpload.tsx to handle
    }
  }

  private static async enrichAnalysisData(backendData: FastAPIResponse, file: File): Promise<ProcessedDocument> {
    // Transform backend data to frontend format
    const clauses = Array.isArray(backendData.clauses) ? backendData.clauses : [];
    const complianceResults = Array.isArray(backendData.compliance_results) 
      ? backendData.compliance_results 
      : (backendData.compliance_results ? [backendData.compliance_results] : []);
    
    // Calculate compliance metrics
    const totalClauses = clauses.length;
    const compliantCount = complianceResults.filter((r: any) => r.is_compliant).length;
    const nonCompliantCount = totalClauses - compliantCount;
    const highRiskCount = complianceResults.filter((r: any) => r.risk_assessment?.severity === 'High').length;
    
    // Calculate overall score
    const overallScore = totalClauses > 0 ? Math.round((compliantCount / totalClauses) * 100) : 0;
    const riskLevel = overallScore >= 80 ? 'low' : overallScore >= 60 ? 'medium' : 'high';
    
    const complianceAreas = this.generateComplianceAreas(complianceResults);
    const keyFindings = this.generateKeyFindings({ 
      summary: backendData.summary,
      overallScore,
      riskLevel,
      totalClauses,
      compliantCount,
      nonCompliantCount,
      highRiskCount
    });
    const actionItems = this.generateActionItems(complianceResults);
    const clauseAnalysis = this.formatClauseAnalysis(complianceResults, clauses);

    return {
      id: `doc_${Date.now()}`,
      fileName: file.name,
      fileSize: this.formatFileSize(file.size),
      uploadedAt: backendData.uploaded_at || new Date().toISOString(),
      processedAt: backendData.processed_at || new Date().toISOString(),
      summary: backendData.summary || '',
      overallScore,
      riskLevel,
      totalClauses,
      compliantClauses: compliantCount,
      nonCompliantClauses: nonCompliantCount,
      highRiskClauses: highRiskCount,
      timelines: backendData.timelines || {},
      clauses,
      complianceResults,
      complianceAreas,
      keyFindings,
      actionItems,
      clauseAnalysis,
    };
  }

  private static generateComplianceAreas(complianceResults: any[]): any[] {
    const areas = new Map<string, any>();
    
    complianceResults.forEach((result: any) => {
      const category = result.risk_assessment?.category || 'General';
      const existing = areas.get(category) || {
        area: category,
        total: 0,
        compliant: 0,
        nonCompliant: 0,
        score: 0
      };
      
      existing.total++;
      if (result.is_compliant) {
        existing.compliant++;
      } else {
        existing.nonCompliant++;
      }
      existing.score = Math.round((existing.compliant / existing.total) * 100);
      
      areas.set(category, existing);
    });
    
    return Array.from(areas.values());
  }
  
  private static generateKeyFindings(data: any): any[] {
    const findings: any[] = [];
    
    if (data.overallScore >= 80) {
      findings.push({
        type: 'success',
        title: 'High Compliance Score',
        description: `Document achieves ${data.overallScore}% compliance with SEBI regulations.`,
        priority: 'low'
      });
    } else if (data.overallScore >= 60) {
      findings.push({
        type: 'warning',
        title: 'Moderate Compliance Score',
        description: `Document achieves ${data.overallScore}% compliance. Some improvements needed.`,
        priority: 'medium'
      });
    } else {
      findings.push({
        type: 'error',
        title: 'Low Compliance Score',
        description: `Document achieves only ${data.overallScore}% compliance. Significant improvements required.`,
        priority: 'high'
      });
    }
    
    if (data.highRiskCount > 0) {
      findings.push({
        type: 'error',
        title: 'High-Risk Clauses Detected',
        description: `${data.highRiskCount} clause(s) identified as high-risk and require immediate attention.`,
        priority: 'high'
      });
    }
    
    return findings;
  }
  
  private static generateActionItems(complianceResults: any[]): any[] {
    const actionItems: any[] = [];
    
    complianceResults.forEach((result: any, index: number) => {
      if (!result.is_compliant) {
        actionItems.push({
          id: `action_${index + 1}`,
          title: `Review Clause ${result.clause_id || index + 1}`,
          description: result.explanation || 'This clause requires compliance review.',
          priority: result.risk_assessment?.severity === 'High' ? 'high' : 
                   result.risk_assessment?.severity === 'Medium' ? 'medium' : 'low',
          status: 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        });
      }
    });
    
    return actionItems;
  }
  
  private static formatClauseAnalysis(complianceResults: any[], clauses: any[]): any[] {
    return complianceResults.map((result: any, index: number) => {
      const clause = clauses[index] || {};
      
      return {
        id: result.clause_id || `clause_${index + 1}`,
        text: clause.text_en || clause.text || 'Clause text not available',
        isCompliant: result.is_compliant,
        confidenceScore: result.confidence_score || 0,
        riskLevel: result.risk_assessment?.severity || 'Unknown',
        category: result.risk_assessment?.category || 'General',
        explanation: result.explanation || 'No explanation provided',
        matchedRules: result.matched_rules || [],
        recommendations: result.risk_assessment?.mitigation ? [result.risk_assessment.mitigation] : []
      };
    });
  }

  private static updateSession(sessionId: string, updates: Partial<AnalysisSession>) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const updatedSession = { ...session, ...updates };
    this.sessions.set(sessionId, updatedSession);

    const listeners = this.listeners.get(sessionId) || [];
    listeners.forEach((callback) => callback(updatedSession));
  }

  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }


  static cleanup(maxAge: number = 3600000) {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.startTime.getTime() > maxAge) {
        this.sessions.delete(sessionId);
        this.listeners.delete(sessionId);
      }
    }
  }
}