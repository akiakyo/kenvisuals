import type { ReactNode } from 'react'
import { Icon } from './Icons'

/** A docked After Effects-style panel: tab header with a menu glyph, dark body. */
export default function Panel({ title, tabs, actions, className = '', children }: {
  title: string
  tabs?: string[]
  actions?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`panel ${className}`}>
      <div className="panel-head">
        <span className="panel-tab active">{title}<Icon name="menu" size={12} /></span>
        {tabs?.map((t) => <span key={t} className="panel-tab">{t}</span>)}
        {actions && <div className="panel-actions">{actions}</div>}
      </div>
      <div className="panel-body">{children}</div>
    </div>
  )
}
