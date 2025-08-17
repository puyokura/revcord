export class RevcordError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RevoltError";
    }
}
