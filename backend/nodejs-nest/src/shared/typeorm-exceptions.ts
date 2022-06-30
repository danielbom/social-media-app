import { QueryFailedError } from 'typeorm';

type TypeormExceptionsT<T> = {
  TableDoesNotExists: {
    mysql: T;
    postgres: T;
  };
  ViolatesForeignKeyConstraint: {
    mysql: T;
    postgres: T;
  };
};

export const TypeormErrorCodes: DeepPartial<TypeormExceptionsT<number>> = {
  ViolatesForeignKeyConstraint: {
    postgres: 23503,
  },
};

type ExceptionHandler<T> = TypeormExceptionsT<
  (exception: QueryFailedError) => T
>;

export const TypeormExceptionsMatch: ExceptionHandler<RegExpMatchArray | null> =
  {
    TableDoesNotExists: {
      mysql(exception) {
        return exception.message.match(
          /Table '(?<table>[\d\w]+)' doesn't exist/,
        );
      },
      postgres(exception) {
        return exception.message.match(
          /relation "(?<table>[\d\w]+)" does not exist/,
        );
      },
    },
    ViolatesForeignKeyConstraint: {
      mysql(exception) {
        return exception.message.match(
          /Cannot delete or update a parent row: a foreign key constraint fails \(([^.]+\.)?`(?<fTable>[\d\w]+)`, CONSTRAINT `[^`]+` FOREIGN KEY \([^)]+\) REFERENCES `(?<table>[\d\w]+)` \([^)]+\)\)/,
        );
      },
      postgres(exception) {
        return exception.message.match(
          /update or delete on table "(?<table>[\d\w]+)" violates foreign key constraint "([\d\w]+)" on table "(?<fTable>[\d\w]+)"/,
        );
      },
    },
  };

export const TypeormExceptions: ExceptionHandler<boolean> = Object.fromEntries(
  Object.entries(TypeormExceptionsMatch).map(([exceptionName, values]) => {
    const predicates = Object.fromEntries(
      Object.entries(values).map(([database, matcher]) => {
        const code = (TypeormErrorCodes as any)?.[exceptionName]?.[database];
        if (code)
          return [database, (exception: any) => exception.code === code];
        return [database, (exception: any) => !!matcher(exception)];
      }),
    );
    return [exceptionName, predicates];
  }),
) as any;
