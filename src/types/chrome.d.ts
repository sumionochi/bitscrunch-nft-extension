declare namespace chrome {
  export namespace runtime {
    export function sendMessage<T = any>(
      message: any,
      callback?: (response: T) => void
    ): void;
  }
}