export class Service {
    name: string
    //TODO: find a typed package to handle durations
    expectedDuration: number // expressed in seconds

    constructor(name: string, expectedDuration: number) {
        this.name = name
        this.expectedDuration = expectedDuration
    }
}