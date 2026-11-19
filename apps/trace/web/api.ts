import type { StudyView } from '../model.ts'

const access = new URLSearchParams(location.hash.slice(1)).get('access')
if (access) {
  sessionStorage.setItem('trace-session', access)
  history.replaceState(null, '', location.pathname + location.search)
}
async function request(path: string, body?: unknown) {
  const response = await fetch(path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      Authorization: 'Bearer ' + (sessionStorage.getItem('trace-session') ?? ''),
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'omit',
  })
  if (!response.ok) throw new Error((await response.json()).error ?? 'Unable to open this item.')
  return response
}
export async function api<T>(path: string, body?: unknown): Promise<T> {
  return (await request(path, body)).json()
}
export async function download(path: string, name: string) {
  const link = document.createElement('a')
  const url = URL.createObjectURL(await (await request(path)).blob())
  link.href = url
  link.download = name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export const endpoint = (client: string, study: string) => '/api/clients/' + client + '/studies/' + study
export type Save = (action: string, fields: object) => Promise<boolean>
export type ScreenProps = { view: StudyView; staff: boolean; save: Save }
