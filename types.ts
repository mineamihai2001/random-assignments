export interface Participant {
  id: string;
  name: string;
  values: Array<Value>;
}

export interface Value{
    name: string,
    weight: number,
}
