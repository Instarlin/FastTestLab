import React, { useCallback, useEffect, useRef, useState } from 'react'
import { type Editor } from '@tiptap/core'
import { type Command, type Group } from './groups'
import { icons } from 'lucide-react'
import { cn } from '~/lib/utils'
import { memo } from 'react'

export type IconProps = {
  name: keyof typeof icons
  className?: string
  strokeWidth?: number
}

export const Icon = memo(({ name, className, strokeWidth }: IconProps) => {
  const IconComponent = icons[name]

  if (!IconComponent) {
    return null
  }

  return <IconComponent className={cn('w-4 h-4', className)} strokeWidth={strokeWidth || 2.5} />
})

Icon.displayName = 'Icon'

interface MenuListProps {
  editor: Editor
  items: Group[]
  command: (command: Command) => void
}

export const MenuList = React.forwardRef((props: MenuListProps, ref) => {
  const scrollContainer = useRef<HTMLDivElement>(null)
  const activeItem = useRef<HTMLButtonElement>(null)
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)

  useEffect(() => {
    setSelectedGroupIndex(0)
    setSelectedCommandIndex(0)
  }, [props.items])

  const selectItem = useCallback(
    (groupIndex: number, commandIndex: number) => {
      const command = props.items[groupIndex].commands[commandIndex]
      props.command(command)
    },
    [props],
  )

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
      if (event.key === 'ArrowDown') {
        if (!props.items.length) {
          return false
        }

        const commands = props.items[selectedGroupIndex].commands

        let newCommandIndex = selectedCommandIndex + 1
        let newGroupIndex = selectedGroupIndex

        if (commands.length - 1 < newCommandIndex) {
          newCommandIndex = 0
          newGroupIndex = selectedGroupIndex + 1
        }

        if (props.items.length - 1 < newGroupIndex) {
          newGroupIndex = 0
        }

        setSelectedCommandIndex(newCommandIndex)
        setSelectedGroupIndex(newGroupIndex)

        return true
      }

      if (event.key === 'ArrowUp') {
        if (!props.items.length) {
          return false
        }

        let newCommandIndex = selectedCommandIndex - 1
        let newGroupIndex = selectedGroupIndex

        if (newCommandIndex < 0) {
          newGroupIndex = selectedGroupIndex - 1
          newCommandIndex = props.items[newGroupIndex]?.commands.length - 1 || 0
        }

        if (newGroupIndex < 0) {
          newGroupIndex = props.items.length - 1
          newCommandIndex = props.items[newGroupIndex].commands.length - 1
        }

        setSelectedCommandIndex(newCommandIndex)
        setSelectedGroupIndex(newGroupIndex)

        return true
      }

      if (event.key === 'Enter') {
        if (!props.items.length || selectedGroupIndex === -1 || selectedCommandIndex === -1) {
          return false
        }

        selectItem(selectedGroupIndex, selectedCommandIndex)

        return true
      }

      return false
    },
  }))

  useEffect(() => {
    if (activeItem.current && scrollContainer.current) {
      const offsetTop = activeItem.current.offsetTop
      const offsetHeight = activeItem.current.offsetHeight

      scrollContainer.current.scrollTop = offsetTop - offsetHeight
    }
  }, [selectedCommandIndex, selectedGroupIndex])

  const createCommandClickHandler = useCallback(
    (groupIndex: number, commandIndex: number) => {
      return () => {
        selectItem(groupIndex, commandIndex)
      }
    },
    [selectItem],
  )

  if (!props.items.length) {
    return null
  }

  return (
    <div
      ref={scrollContainer}
      className="flex max-h-80 flex-col overflow-y-auto overflow-x-hidden rounded border border-slate-200 bg-white p-2 shadow"
    >
      {props.items.map((group, groupIndex) => (
        <div key={group.name}>
          <div className="text-xs font-medium text-gray-500 w-full">{group.title}</div>
          {group.commands.map((command, commandIndex) => (
            <button
              key={`${command.label}`}
              ref={selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex ? activeItem : null}
              onClick={createCommandClickHandler(groupIndex, commandIndex)}
              className={cn("flex cursor-pointer items-center rounded-sm my-1 px-2 py-1 text-sm transition-colors w-full",
                selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex
                ? "bg-gray-200"
                : "hover:bg-gray-200"
              )}
            >
              <Icon name={command.iconName} className='h-4 w-4'/>
              <span className="ml-2">{command.label}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
    )
})

MenuList.displayName = 'MenuList'

export default MenuList