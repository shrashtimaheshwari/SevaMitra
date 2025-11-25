import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function CustomDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select',
  id,
  className = ''
}) {
  const controlRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0, preferUp: false })
  const [highlight, setHighlight] = useState(-1)

  const normalized = options.map(opt => (typeof opt === 'string' ? { value: opt, label: opt } : opt))

  function computePosition() {
    if (!controlRef.current) return
    const rect = controlRef.current.getBoundingClientRect()
    const width = Math.max(200, rect.width)
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const preferUp = spaceBelow < 220 && spaceAbove > spaceBelow
    const top = preferUp ? rect.top - 6 : rect.bottom + 6
    const left = rect.left
    setMenuPos({ top, left, width, preferUp })
  }

  useEffect(() => {
    function onDocClick(e) {
      if (!controlRef.current) return
      if (!controlRef.current.contains(e.target)) setIsOpen(false)
    }
    function onResize() {
      if (isOpen) computePosition()
    }
    document.addEventListener('mousedown', onDocClick, { capture: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      document.removeEventListener('mousedown', onDocClick, { capture: true })
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setHighlight(normalized.findIndex(o => o.value === value))
      requestAnimationFrame(() => computePosition())
    }
  }, [isOpen])

  function toggleOpen() {
    setIsOpen(prev => !prev)
  }

  function handleSelect(val) {
    if (typeof onChange === 'function') onChange(val)
    setIsOpen(false)
    controlRef.current?.focus()
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) return setIsOpen(true)
      setHighlight(i => Math.min(i + 1, normalized.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!isOpen) return setIsOpen(true)
      if (highlight >= 0) handleSelect(normalized[highlight].value)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const selectedLabel = (normalized.find(o => o.value === value) || {}).label

  const menu = (
    <div
      role="listbox"
      aria-activedescendant={highlight >= 0 ? `dd-item-${highlight}` : undefined}
      style={{
        position: 'fixed',
        top: `${menuPos.top}px`,
        left: `${menuPos.left}px`,
        width: `${menuPos.width}px`,
        zIndex: 99999,
        pointerEvents: 'auto'
      }}
    >
      <div
        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-[50vh] overflow-auto`}
        style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}
      >
        {normalized.map((opt, i) => (
          <button
            id={`dd-item-${i}`}
            key={opt.value}
            role="option"
            aria-selected={opt.value === value}
            onPointerDown={(e) => { e.preventDefault(); handleSelect(opt.value) }}
            onClick={() => {  handleSelect(opt.value) }}
            onMouseEnter={() => setHighlight(i)}
            className={
              `w-full text-left px-4 py-3 focus:outline-none transition-colors ` +
              (i === highlight
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100')
            }
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <div
        id={id}
        ref={controlRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={`relative z-50 ${className}`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={toggleOpen}
          className="w-full flex items-center justify-between px-3 py-2 rounded border bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        >
          <span className={`${selectedLabel ? '' : 'text-gray-500 dark:text-gray-300'}`}>
            {selectedLabel || placeholder}
          </span>
          <svg className="w-4 h-4 ml-2 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {isOpen && createPortal(menu, document.body)}
    </>
  )
}
