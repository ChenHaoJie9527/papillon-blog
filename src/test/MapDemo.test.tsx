import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BasicMapDemo, LookupMapDemo, SetAllMapDemo } from '../components/MapDemo'

describe('MapDemo', () => {
  it('基础 Demo 可以添加、覆盖、删除和重置', () => {
    render(<BasicMapDemo />)

    fireEvent.change(screen.getByLabelText('Key'), { target: { value: 'user-1' } })
    fireEvent.change(screen.getByLabelText('Value'), { target: { value: '陈浩杰' } })
    fireEvent.click(screen.getByRole('button', { name: '添加 / 更新' }))

    expect(screen.getByText('user-1')).toBeTruthy()
    expect(screen.getByText('陈浩杰')).toBeTruthy()
    expect(screen.getByText('1')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Key'), { target: { value: 'user-1' } })
    fireEvent.change(screen.getByLabelText('Value'), { target: { value: '更新后' } })
    fireEvent.click(screen.getByRole('button', { name: '添加 / 更新' }))

    expect(screen.queryByText('陈浩杰')).toBeNull()
    expect(screen.getByText('更新后')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '删除' }))
    expect(screen.getByText('当前 Map 为空')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Key'), { target: { value: 'a' } })
    fireEvent.change(screen.getByLabelText('Value'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: '添加 / 更新' }))
    fireEvent.click(screen.getByRole('button', { name: '重置' }))

    expect(screen.getByText('当前 Map 为空')).toBeTruthy()
  })

  it('setAll Demo 会整体替换条目', () => {
    render(<SetAllMapDemo />)

    expect(screen.getByText('apple')).toBeTruthy()
    expect(screen.getByText('苹果')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '换成动物' }))

    expect(screen.queryByText('apple')).toBeNull()
    expect(screen.getByText('cat')).toBeTruthy()
    expect(screen.getByText('猫')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '清空' }))
    expect(screen.getByText('当前 Map 为空')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '换成水果' }))
    expect(screen.getByText('pear')).toBeTruthy()
  })

  it('查找表 Demo 能按 key 读出 label', () => {
    render(<LookupMapDemo />)

    const input = screen.getByLabelText('用 value 查 label')
    expect(screen.getByText(/map\.get\("apple"\)/)).toBeTruthy()

    fireEvent.change(input, { target: { value: 'pear' } })
    expect(screen.getByText(/map\.get\("pear"\)/)).toBeTruthy()

    fireEvent.change(input, { target: { value: 'missing' } })
    expect(screen.getByText('undefined')).toBeTruthy()
  })
})
