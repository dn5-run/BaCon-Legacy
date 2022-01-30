export interface BaseStore<DataType> {
    readonly data: DataType[]
    list(): DataType[]
    get(id: string): DataType | undefined
    add(data: DataType): void
    delete(id: string): void
}
