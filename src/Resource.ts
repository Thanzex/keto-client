import { Keto } from "./Client";

export class Resource {
    client: Keto.Client;
    constructor(parent: Keto.Client) {
        this.client = parent;
    }
}
