import { randomUUID } from 'node:crypto'
import type { ClientData, Evidence, Plan, ProcessVersion, Setup, Step, Study } from '../model.ts'

export const newId = () => randomUUID()
export function blankStudy(clientId: string, setup: Setup): Study {
  const id = newId()
  const owner = { clientId, studyId: id }
  const current: ProcessVersion = {
    ...owner,
    id: newId(),
    kind: 'current',
    revision: 1,
    basedOn: null,
    steps: [],
    questions: '',
  }
  const plan: Plan = {
    ...owner,
    id: newId(),
    version: 1,
    findings: '',
    suggestions: '',
    priorities: '',
    requirements: '',
    questions: '',
    comments: [],
    approval: null,
  }
  return { ...setup, ...owner, id, current, proposed: null, evidence: [], plans: [plan] }
}

export function copyMap(map: ProcessVersion): ProcessVersion {
  const ids = new Map(map.steps.map((step) => [step.id, newId()]))
  return {
    ...map,
    id: newId(),
    kind: 'proposed',
    revision: 1,
    basedOn: map.id + '@' + map.revision,
    steps: map.steps.map((step) => ({
      ...structuredClone(step),
      id: ids.get(step.id)!,
      branchFrom: ids.get(step.branchFrom) ?? '',
      mode: 'Human',
      why: 'Keep the current human handoff.',
    })),
  }
}

export function fixtures(): ClientData[] {
  return [true, false].map((paint) => {
    const client = {
      // Stable client IDs let an explicit Trellis seed be safely retried.
      id: paint ? '7ebc14fb-090d-411f-b4bd-22726fa3b1bb' : 'fe61190f-84ba-4786-a551-f6a692b2004d',
      name: paint ? 'Alder & Pine Painting' : 'Juniper Room Salon',
      contact: paint ? 'Mara Ellis' : 'Ellis Reed',
      reviewer: paint ? 'Mara Ellis' : 'Ellis Reed',
    }
    const study = blankStudy(
      client.id,
      paint
        ? {
            name: 'From inquiry to site visit',
            goal: 'Follow a quote request from the first message to a confirmed visit.',
            start: 'A homeowner asks for a quote.',
            end: 'A site visit is on the calendar.',
            people: 'Owner, estimator',
            tools: 'Text messages, shared calendar',
            exceptions: 'The request has no site photos.',
            status: 'Mapping',
          }
        : {
            name: 'Changing an appointment',
            goal: 'Follow a booking change from the first call to an updated appointment.',
            start: 'A guest asks to move a booking.',
            end: 'The guest confirms a new time.',
            people: 'Receptionist, stylist',
            tools: 'Phone, booking calendar',
            exceptions: 'The original stylist has no opening.',
            status: 'In review',
          },
    )
    const owner = { clientId: client.id, studyId: study.id }
    const evidence = (title: string, text: string, kind: Evidence['kind']): Evidence => ({
      ...owner,
      id: newId(),
      title,
      text,
      kind,
      person: client.contact,
      date: '2026-11-18',
    })
    const note = evidence(
      paint ? 'First-contact walkthrough' : 'A change at the front desk',
      paint
        ? 'Mara reads the homeowner’s message and checks whether it includes an address and photos.'
        : 'Ellis looks up the original appointment while the guest is on the phone.',
      'Note',
    )
    const answer = evidence(
      paint ? 'When photos are missing' : 'When the stylist is booked',
      paint
        ? '“I text back for photos before I offer a time.”'
        : '“We ask whether another stylist would work before changing the appointment.”',
      'Interview answer',
    )
    const doc = evidence(
      paint ? 'Site visit checklist' : 'Booking change checklist',
      paint
        ? 'Record the address. Review the photos. Agree a visit time.'
        : 'Find the original booking. Check alternatives. Confirm the chosen slot.',
      'Document',
    )
    Object.assign(doc, {
      fileName: 'fictional-checklist.txt',
      mime: 'text/plain',
      bytes: Buffer.from(doc.text).toString('base64'),
    })
    study.evidence = [note, answer, doc]
    const step = (
      name: string,
      description: string,
      source: Step['source'],
      evidenceIds: string[],
    ): Step => ({
      ...owner,
      id: newId(),
      name,
      description,
      source,
      evidenceIds,
      uncertain: !evidenceIds.length,
      branchFrom: '',
      condition: '',
      mode: 'Human',
      why: '',
    })
    const first = step(paint ? 'Receive request' : 'Find booking', note.text, 'Observed', [note.id])
    const check = step(paint ? 'Review details' : 'Check availability', doc.text, 'Told to us', [doc.id])
    const last = step(
      paint ? 'Book site visit' : 'Confirm new time',
      paint ? 'Agree a time and add it to the calendar.' : 'Read the new appointment back to the guest.',
      'Told to us',
      [],
    )
    const branch = step(paint ? 'Request site photos' : 'Offer another stylist', answer.text, 'Told to us', [
      answer.id,
    ])
    branch.branchFrom = check.id
    branch.condition = paint ? 'Photos missing' : 'Stylist unavailable'
    study.current.steps = [first, check, branch, last]
    study.current.questions = paint
      ? 'Who follows up when photos never arrive?'
      : 'Who confirms a change requested after closing?'
    study.proposed = copyMap(study.current)
    Object.assign(study.proposed.steps[1], {
      mode: 'AI-assisted',
      why: 'A draft checklist could help staff spot missing details. Staff would verify it.',
    })
    Object.assign(study.plans[0], {
      findings: paint
        ? 'Requests arrive by text with uneven detail. The owner fills the gaps before booking a visit.'
        : 'Availability is checked twice when a guest needs a different stylist.',
      suggestions: paint
        ? 'Use a short checklist during the first exchange.'
        : 'Offer the guest two suitable alternatives during the first call.',
      priorities: paint
        ? 'Agree which details are needed before a visit.'
        : 'Agree when a stylist change needs confirmation.',
      requirements: paint
        ? 'A shared checklist and an owner for follow-up.'
        : 'A shared view of openings and a short confirmation script.',
      questions: study.current.questions,
    })
    return { client, studies: [study], revision: 1 }
  })
}
