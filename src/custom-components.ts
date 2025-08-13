export interface ComponentConfig {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  previewType: string
  usageCode: string
  sourceCode: string
}

export interface ComponentsData {
  components: ComponentConfig[]
}
