export const sources = ['Observed', 'Told to us', 'AI-suggested'] as const
export const modes = ['Human', 'AI-assisted', 'Automation candidate'] as const
export const statuses = ['In discovery', 'Mapping', 'In review', 'Complete'] as const
export const evidenceTypes = ['Note', 'Interview answer', 'Document', 'Photo'] as const
export const planFields = ['findings', 'suggestions', 'priorities', 'requirements', 'questions'] as const
export const setupFields = ['name', 'goal', 'start', 'end', 'people', 'tools', 'exceptions'] as const

export type Source = (typeof sources)[number]
export type Mode = (typeof modes)[number]
export type Status = (typeof statuses)[number]
export type EvidenceType = (typeof evidenceTypes)[number]
export type Session = { role: 'facilitator' | 'reviewer'; name: string; clientId?: string }
export interface Client {
  id: string
  name: string
  contact: string
  reviewer: string
}
export interface Owned {
  id: string
  clientId: string
  studyId: string
}
export interface Evidence extends Owned {
  title: string
  kind: EvidenceType
  person: string
  date: string
  text: string
  fileName?: string
  mime?: string
  bytes?: string
}
export interface Step extends Owned {
  name: string
  description: string
  source: Source
  evidenceIds: string[]
  uncertain: boolean
  branchFrom: string
  condition: string
  mode: Mode
  why: string
}
export interface ProcessVersion extends Owned {
  kind: 'current' | 'proposed'
  revision: number
  basedOn: string | null
  steps: Step[]
  questions: string
}
export interface Comment extends Owned {
  reviewer: string
  text: string
  date: string
  version: number
}
export interface Approval extends Owned {
  reviewer: string
  decision: 'Approved'
  date: string
  version: number
}
export type PlanText = Record<(typeof planFields)[number], string>
export interface Plan extends Owned, PlanText {
  version: number
  comments: Comment[]
  approval: Approval | null
}
export type Setup = Record<(typeof setupFields)[number], string> & { status: Status }
export interface Study extends Owned, Setup {
  evidence: Evidence[]
  current: ProcessVersion
  proposed: ProcessVersion | null
  plans: Plan[]
}
export interface ClientData {
  client: Client
  studies: Study[]
  revision: number
}
export interface Summary {
  id: string
  clientId: string
  name: string
  goal: string
  status: Status
  steps: string[]
  branch: string
}
export interface Workspace {
  session: Session
  clients: Pick<Client, 'id' | 'name'>[]
  studies: Summary[]
}
export interface StudyView {
  clientName: string
  study: Study
  revision: number
}
export const planLabels: Record<(typeof planFields)[number], string> = {
  findings: 'What we found',
  suggestions: 'What we suggest',
  priorities: 'What to fix first',
  requirements: 'What it would need',
  questions: 'Open questions',
}
export const setupLabels: Record<(typeof setupFields)[number], string> = {
  name: 'Process name',
  goal: 'Goal',
  start: 'Start point',
  end: 'End point',
  people: 'People involved',
  tools: 'Tools used',
  exceptions: 'Known exceptions',
}
