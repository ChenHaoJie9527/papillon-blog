import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/Select'

describe('Select', () => {
  it('挂载带选项的 Select 不应陷入无限更新', () => {
    expect(() =>
      render(
        <Select defaultValue="apple">
          <SelectTrigger>
            <SelectValue placeholder="选择水果" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">苹果</SelectItem>
            <SelectItem value="pear">梨</SelectItem>
          </SelectContent>
        </Select>,
      ),
    ).not.toThrow()

    expect(screen.getByRole('button', { expanded: false })).toBeTruthy()
    expect(screen.getAllByText('苹果').length).toBeGreaterThan(0)
  })

  it('className 的圆角不被 inline style 覆盖', () => {
    render(
      <Select defaultValue="apple">
        <SelectTrigger className="rounded-2xl">
          <SelectValue placeholder="选择水果" />
        </SelectTrigger>
        <SelectContent className="rounded-none">
          <SelectItem value="apple">苹果</SelectItem>
        </SelectContent>
      </Select>,
    )

    const trigger = screen.getByRole('button', { expanded: false })
    expect(trigger.className).toContain('rounded-2xl')
    expect(trigger.style.borderTopLeftRadius).toBe('')
    expect(trigger.style.borderBottomRightRadius).toBe('')

    const list = screen.getByRole('listbox', { hidden: true })
    expect(list.className).toContain('rounded-none')
    expect(list.style.borderTopLeftRadius).toBe('')
    expect(list.style.borderBottomRightRadius).toBe('')
  })

  it('multiple 时点选切换且不关面板', () => {
    const onValueChange = vi.fn()
    render(
      <Select multiple defaultValue={['apple']} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="选择水果" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">苹果</SelectItem>
          <SelectItem value="pear">梨</SelectItem>
        </SelectContent>
      </Select>,
    )
    fireEvent.click(screen.getByRole('button', { expanded: false }))
    fireEvent.click(screen.getByRole('option', { name: '梨' }))
    expect(onValueChange).toHaveBeenCalledWith(['apple', 'pear'])
    const trigger = screen.getByRole('button', { expanded: true })
    expect(trigger).toBeTruthy()
    expect(within(trigger).getByText('苹果')).toBeTruthy()
    expect(within(trigger).getByText('梨')).toBeTruthy()
    expect(trigger.querySelectorAll('[data-slot="select-tag"]')).toHaveLength(2)
    expect(within(trigger).queryByText('苹果、梨')).toBeNull()
    fireEvent.click(screen.getByRole('option', { name: '苹果' }))
    expect(onValueChange).toHaveBeenLastCalledWith(['pear'])
  })

  it('单选时点选仍关闭且回调是 string', () => {
    const onValueChange = vi.fn()
    render(
      <Select defaultValue="apple" onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="选择水果" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">苹果</SelectItem>
          <SelectItem value="pear">梨</SelectItem>
        </SelectContent>
      </Select>,
    )
    fireEvent.click(screen.getByRole('button', { expanded: false }))
    fireEvent.click(screen.getByRole('option', { name: '梨' }))
    expect(onValueChange).toHaveBeenCalledWith('pear')
    const trigger = screen.getByRole('button', { expanded: false })
    expect(trigger).toBeTruthy()
    expect(within(trigger).getByText('梨')).toBeTruthy()
    expect(trigger.querySelector('[data-slot="select-tag"]')).toBeNull()
  })
})
