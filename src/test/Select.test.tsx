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

function SearchableFruits({
  multiple,
  ...props
}: { multiple?: boolean } & Record<string, unknown>) {
  const content = (
    <>
      <SelectTrigger>
        <SelectValue placeholder="选择水果" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">苹果</SelectItem>
        <SelectItem value="pear">梨</SelectItem>
        <SelectItem value="banana">香蕉</SelectItem>
      </SelectContent>
    </>
  )

  if (multiple) {
    return (
      <Select searchable multiple {...props}>
        {content}
      </Select>
    )
  }

  return (
    <Select searchable {...props}>
      {content}
    </Select>
  )
}

describe('Select searchable', () => {
  it('渲染 combobox 而不是展开按钮', () => {
    render(<SearchableFruits />)
    expect(screen.getByRole('combobox')).toBeTruthy()
    expect(screen.queryByRole('button', { expanded: false })).toBeNull()
  })

  it('输入过滤选项，不匹配项从无障碍树消失', () => {
    const onSearch = vi.fn()
    render(<SearchableFruits onSearch={onSearch} />)
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: '苹' } })
    expect(onSearch).toHaveBeenCalledWith('苹')
    expect(screen.getByRole('option', { name: '苹果' })).toBeTruthy()
    expect(screen.queryByRole('option', { name: '梨' })).toBeNull()
    expect(screen.queryByRole('option', { name: '香蕉' })).toBeNull()
  })

  it('无匹配时显示空态', () => {
    render(<SearchableFruits />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } })
    expect(screen.getByText('无匹配项')).toBeTruthy()
    expect(screen.queryByRole('option')).toBeNull()
  })

  it('关面板后清空搜索词', () => {
    render(<SearchableFruits />)
    const input = screen.getByRole('combobox') as HTMLInputElement
    fireEvent.change(input, { target: { value: '苹' } })
    expect(input.value).toBe('苹')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(input.value).toBe('')
    expect(screen.getByRole('option', { name: '梨', hidden: true })).toBeTruthy()
  })

  it('filter={false} 时输入不隐藏选项', () => {
    render(<SearchableFruits filter={false} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '苹' } })
    expect(screen.getByRole('option', { name: '苹果' })).toBeTruthy()
    expect(screen.getByRole('option', { name: '梨' })).toBeTruthy()
    expect(screen.getByRole('option', { name: '香蕉' })).toBeTruthy()
  })

  it('label 可作为搜索文本', () => {
    render(
      <Select searchable>
        <SelectTrigger>
          <SelectValue placeholder="选择" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple" label="苹果">
            <span>图标</span>
          </SelectItem>
          <SelectItem value="pear" label="梨">
            <span>其它</span>
          </SelectItem>
        </SelectContent>
      </Select>,
    )
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '苹' } })
    expect(screen.getByRole('option', { name: '图标' })).toBeTruthy()
    expect(screen.queryByRole('option', { name: '其它' })).toBeNull()
  })

  it('多选时点选不关面板并清空搜索词，焦点回到输入框', () => {
    const onValueChange = vi.fn()
    render(
      <SearchableFruits
        multiple
        defaultValue={['apple']}
        onValueChange={onValueChange}
      />,
    )
    const input = screen.getByRole('combobox') as HTMLInputElement
    fireEvent.change(input, { target: { value: '梨' } })
    fireEvent.click(screen.getByRole('option', { name: '梨' }))
    expect(onValueChange).toHaveBeenCalledWith(['apple', 'pear'])
    expect(input.value).toBe('')
    expect(input).toBe(document.activeElement)
    expect(screen.getByRole('option', { name: '香蕉' })).toBeTruthy()
  })

  it('多选且搜索词为空时 Backspace 删除最后一个 Tag', () => {
    const onValueChange = vi.fn()
    render(
      <SearchableFruits
        multiple
        defaultValue={['apple', 'pear']}
        onValueChange={onValueChange}
      />,
    )
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace' })
    expect(onValueChange).toHaveBeenCalledWith(['apple'])
  })

  it('输入法组合过程中仍把拼音写入输入框', () => {
    render(<SearchableFruits />)
    const input = screen.getByRole('combobox') as HTMLInputElement
    fireEvent.compositionStart(input)
    fireEvent.change(input, { target: { value: 'p' } })
    expect(input.value).toBe('p')
    fireEvent.change(input, { target: { value: '苹' } })
    fireEvent.compositionEnd(input)
    expect(input.value).toBe('苹')
  })
})
