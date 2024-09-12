import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
    constructor(specificMessage) {
        super(404, "Not Found", specificMessage)
    }
}

export class UnAuthorized extends CustomError {
    constructor(specificMessage) {
        super(405, "UnAuthorized", specificMessage)
    }
}

export class ValidationError extends CustomError {
    constructor(specificMessage) {
        super(500, "Bad Request", specificMessage)
    }
}

export class BadCredentialsException extends CustomError {
    constructor(specificMessage) {
        super(500, "Not a valid credentials to login", specificMessage)
    }
}

export class AxiosError extends CustomError {
    constructor(specificMessage) {
        super(500, "Axios Error", specificMessage)
    }
}


export class UserError extends CustomError {
    constructor(specificMessage) {
        super(500, "Axios Error", specificMessage)
    }
}