"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      {...props}
      styles={{
        root: { fontFamily: 'inherit' },
        months: { display: 'flex', gap: '1rem' },
        month: { minWidth: '240px' },
        caption: { 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '0 0.5rem',
          marginBottom: '1rem'
        },
        caption_label: { 
          fontSize: '0.875rem', 
          fontWeight: '500',
          color: '#374151'
        },
        nav: { 
          display: 'flex', 
          gap: '0.25rem' 
        },
        nav_button: {
          width: '1.75rem',
          height: '1.75rem',
          borderRadius: '0.375rem',
          border: '1px solid #d1d5db',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: '0.7',
          fontSize: '0.75rem'
        },
        nav_button_previous: { position: 'absolute', left: '0.25rem' },
        nav_button_next: { position: 'absolute', right: '0.25rem' },
        table: { 
          width: '100%', 
          borderCollapse: 'collapse',
          marginTop: '0.5rem'
        },
        head_row: { display: 'flex' },
        head_cell: { 
          width: '2.25rem', 
          height: '2.25rem',
          fontSize: '0.75rem',
          fontWeight: '400',
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        row: { 
          display: 'flex', 
          width: '100%',
          marginTop: '0.125rem'
        },
        cell: { 
          width: '2.25rem', 
          height: '2.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        },
        day: {
          width: '2.25rem',
          height: '2.25rem',
          fontSize: '0.875rem',
          borderRadius: '0.375rem',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease'
        },
        day_today: {
          backgroundColor: '#f3f4f6',
          fontWeight: '600',
          color: '#111827'
        },
        day_selected: {
          backgroundColor: '#2563eb',
          color: 'white'
        },
        day_outside: {
          color: '#9ca3af',
          opacity: '0.5'
        },
        day_disabled: {
          color: '#d1d5db',
          cursor: 'not-allowed'
        }
      }}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 