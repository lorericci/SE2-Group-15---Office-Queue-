import { Service } from "./service";

export class Queue {
    private _service: Service
    private _queueArray: number[]

    constructor(service: Service) {
        this._service = service
        this._queueArray = [] as number[]
    }

    public get service(): Service { return this._service }
    public get length(): number { return this._queueArray.length }

    public enqueue(ticketId: number) {
        if (ticketId < 1) throw new Error('ticket id must be positive')
        this._queueArray.push(ticketId)
    }

    public nextCustomer(): number | undefined {
        return this._queueArray.shift()
    }
}