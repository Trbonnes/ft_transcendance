import { Module } from '@nestjs/common';
import { FooService } from './foo.service';

@Module({
  providers: [FooService]
})
export class FooModule {}
