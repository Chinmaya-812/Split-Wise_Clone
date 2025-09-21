class ApiErrorResponse extends Error {
  constructor(statusCode, message = 'Something WentWrong') {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}
export { ApiErrorResponse };
