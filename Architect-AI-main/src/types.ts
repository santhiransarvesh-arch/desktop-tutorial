export interface ColumnInfo {
  name: string;
  type: string;
  isPk: boolean;
  isFk: boolean;
  refTable?: string;
  nullable: boolean;
  desc: string;
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
  validationRules: string[];
  securityRules: string[];
}

export interface SpringBootCode {
  filename: string;
  filepath: string;
  code: string;
  language: string;
  description: string;
}

export interface AngularCode {
  filename: string;
  filepath: string;
  code: string;
  language: string;
  description: string;
}

export interface RoadmapPhase {
  name: string;
  duration: string;
  tasks: string[];
  milestones: string[];
}

export interface CostItem {
  service: string;
  category: 'infrastructure' | 'development' | 'maintenance';
  monthlyCost: number;
  annualCost: number;
  description: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: string;
  details: string;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
}

export interface CloudNode {
  id: string;
  service: string; // e.g. "EC2", "RDS", "S3", "CloudFront", "API Gateway"
  label: string;
  desc: string;
}

export interface CloudEdge {
  from: string;
  to: string;
}

export interface ProjectHistoryItem {
  id: string;
  projectName: string;
  createdAt: string;
  description: string;
  targetUsers: string;
  scale: string;
  budget: string;
  preference: string;
}

export interface ArchitecturePayload {
  projectName: string;
  description: string;
  category: string;
  targetUsers: string;
  scale: string;
  budget: string;
  preference: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  
  // Arch
  monolith: {
    description: string;
    diagramNodes: ArchitectureNode[];
    diagramEdges: ArchitectureEdge[];
  };
  microservices: {
    description: string;
    diagramNodes: ArchitectureNode[];
    diagramEdges: ArchitectureEdge[];
  };
  eventDriven: {
    description: string;
    diagramNodes: ArchitectureNode[];
    diagramEdges: ArchitectureEdge[];
  };

  // ER Diagram
  mermaidEr: string;
  tables: TableInfo[];

  // Database Designer
  mysqlSchema: string;
  indexesDesc: string;

  // API Designer
  apis: ApiEndpoint[];
  openApiYaml: string;

  // Frontend Angular structure
  angularStructure: {
    folders: string[];
    files: { path: string; desc: string }[];
    samples: AngularCode[];
  };

  // Backend Spring boot structure
  springbootStructure: {
    folders: string[];
    files: { path: string; desc: string }[];
    samples: SpringBootCode[];
  };

  // Cloud designer
  cloudArchitecture: {
    awsNodes: CloudNode[];
    awsEdges: CloudEdge[];
    recommendations: string[];
  };

  // Security analyzer
  security: {
    authentication: string;
    authorization: string;
    risks: string[];
    owasp: string[];
    protection: string[];
  };

  // DevOps
  devops: {
    dockerfileBackend: string;
    dockerfileFrontend: string;
    kubernetesManifest: string;
    githubActions: string;
    monitoringSetup: string;
  };

  // Roadmap & Team
  roadmap: {
    phases: RoadmapPhase[];
    timelineEstimation: string;
    teamEstimation: string[];
    teamSize: number;
  };

  // Cost
  cost: {
    breakdown: CostItem[];
    monthlyTotal: number;
    annualTotal: number;
  };

  // Documentation
  documentation: {
    srs: string;
    technicalDesign: string;
    apiDoc: string;
    databaseDoc: string;
    deploymentGuide: string;
  };
}
