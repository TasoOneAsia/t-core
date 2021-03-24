interface CommandArg {
  name: string;
  help: string;
}

interface Command {
  command: string;
  commandArgs?: CommandArg[];
  restricted?: boolean;
}

export const Command = ({ command, commandArgs, restricted }: Command) => {
  return function (target: unknown, key: string): void {
    if (!Reflect.hasMetadata('commands', target)) {
      Reflect.defineMetadata('commands', [], target);
    }

    const commands: any[] = Reflect.getMetadata('commands', target);

    commands.push({
      command,
      restricted,
      key,
    });

    Reflect.defineMetadata('commands', commands, target);
  };
};

export const CommandListener = function () {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);

        if (!Reflect.hasMetadata('commands', this)) {
          Reflect.defineMetadata('commands', [], this);
        }

        const events: any[] = Reflect.getMetadata('commands', this);

        for (const { key, restricted, command } of events) {
          RegisterCommand(
            command,
            (...args: any[]) => {
              this[key](...args);
            },
            restricted
          );
        }
      }
    };
  };
};
