import { Module } from '@nestjs/common';

export const CronExpression = {
  EVERY_DAY_AT_3AM: '0 3 * * *',
};

export function Cron(): MethodDecorator {
  return () => undefined;
}

@Module({})
export class ScheduleModule {
  static forRoot() {
    return { module: ScheduleModule };
  }
}
