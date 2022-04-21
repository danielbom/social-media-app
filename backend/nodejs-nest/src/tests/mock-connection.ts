import { IMockRepository, MockRepository } from 'src/tests/mock-repository';

export class MockConnection {
  public options = {
    type: 'mock',
  };
  public repositories: Record<string, IMockRepository<any>> = {};

  getRepository(cls: any) {
    const id = this._getRepositoryIdentifier(cls);
    this.repositories[id] = this.repositories[id] || MockRepository.create();
    return this.repositories[id];
  }

  private _getRepositoryIdentifier(cls: any): string {
    if (cls !== null && cls !== undefined) {
      if (typeof cls === 'string') {
        return cls;
      } else if (typeof cls === 'object') {
        if (cls.name) {
          return cls.name;
        }
      } else if (typeof cls === 'function') {
        return cls.name;
      }
    }
    this._invalidRepositoryMetadata(cls);
  }

  private _invalidRepositoryMetadata(cls: any) {
    throw Error('Invalid meta repository data: ' + cls);
  }
}
