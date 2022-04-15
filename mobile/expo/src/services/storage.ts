class Storage<T extends string> {
  constructor(
    private readonly prefix: string,
    private readonly keys: Record<T, null>,
  ) {}

  get(key: T): string | null {
    return localStorage.getItem(this.prefix.concat(key));
  }

  set(key: T, value: string): void {
    localStorage.setItem(this.prefix.concat(key), value);
  }

  clear(key: T) {
    localStorage.removeItem(this.prefix.concat(key));
  }

  clearAll() {
    for (const key in this.keys) {
      this.clear(key);
    }
  }
}

const storage = new Storage('@social-media:', {
  token: null,
});

export default storage;
