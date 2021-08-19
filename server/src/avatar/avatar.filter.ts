import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class AvatarFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
