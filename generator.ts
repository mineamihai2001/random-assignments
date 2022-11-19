import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { parse } from "https://deno.land/std@0.164.0/path/win32.ts";
import { Participant, Value } from "./types.ts";

export default class Generator {
  private source: string;
  private participants: Array<string>;
  private result: Array<Participant>;

  constructor(source: string, participants: Array<string>) {
    this.source = "./" + source;
    this.participants = participants;
    this.result = new Array<Participant>();
  }

  static validateSource(source: string): boolean {
    return existsSync(source);
  }

  async run(): Promise<Array<Participant>> {
    const data = await this.read();

    const totalValPerPart = Math.floor(data.length / this.participants.length);

    this.participants.forEach((name: string, index: number) => {
      const current: Participant = {
        id: index.toString(),
        name: name,
        values: new Array<Value>(),
      };

      for (let i = 0; i < totalValPerPart; ++i) {
        const rand = Math.floor(Math.random() * data.length);

        const val: Value = {
          name: data[rand],
          weight: 0,
        };

        current.values.push(val);
        data.splice(rand, 1);
      }
      this.result.push(current);
    });

    return this.result;
  }

  async read(): Promise<Array<string>> {
    return await (await Deno.readTextFile(this.source)).replaceAll("\r", "")
      .split("\n");
  }

  async parseValues(): Promise<Array<Value>> {
    const data = await this.read();
    const parsed = new Array<Value>();
    data.forEach((elem) => {
      const arr = elem.split(" ");
      const value: Value = {
        name: arr[0],
        weight: typeof arr[1] !== "undefined" ? parseInt(arr[1]) : 0,
      };
      parsed.push(value);
    });
    return parsed;
  }

  print(): void {
    this.result.forEach((participant) => {
      console.log(`${participant.name} => `, participant.values);
    });
    console.log("All done 👌");
  }
}
