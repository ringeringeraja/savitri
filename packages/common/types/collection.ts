export const COLLECTION_FIELD_TYPES = <const>[
  'boolean',
  'checkbox',
  'collection',
  'datetime',
  'integer',
  'number',
  'object',
  'password',
  'radio',
  'select',
  'text',
  'textbox',
]

export const COLLECTION_PRESETS = <const>[
  'alwaysOwned',
  'crud',
  'duplicate',
  'owned',
  'removeAll',
  'toggleActive',
  'view',
]

export const ARRAY_TYPES = <const>[
  'checkbox',
  'radio'
]

export type CollectionFieldType = typeof COLLECTION_FIELD_TYPES[number]
export type CollectionPreset = typeof COLLECTION_PRESETS[number]

export type CollectionField = Readonly<{
  label: string
  type?: CollectionFieldType
  collection?: string
  mask?: string

  expand?: boolean
  includeHours?: boolean
  readOnly?: boolean

  values?: Record<string, string> & {
    __query: {
      collection: string
      index: Array<string>|string
      limit?: number
    }
  }
}>

export type CollectionAction = Readonly<{
  name: string
  unicon?: string
  ask?: boolean
}>

export type CollectionActions = Record<string, CollectionAction>

export type CollectionDescription = {
  collection: string
  alias?: string

  // modifiers
  strict?: boolean // all fields are required
  alwaysAttribute?: boolean
  route?: boolean

  // takes an array of something
  presets?: Array<CollectionPreset>
  table?: Array<string>
  form?: Array<string>
  filters?: Array<string>

  // actions
  actions?: CollectionActions
  individualActions?: CollectionActions

  searchable?: {
    indexes: Array<string>
    actions?: Record<string, CollectionAction>
  }

  fields: Record<string, CollectionField>
}

export type MaybeCollectionDescription = Omit<CollectionDescription, 'fields' | 'presets'> & {
  presets?: Array<string>
  fields?: Record<string, any>
}

