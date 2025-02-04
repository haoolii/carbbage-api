import MessageResponse from './messageResponse.type';

export default interface ErrorResponse extends MessageResponse {
  stack?: string;
}