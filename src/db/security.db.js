import Security from '../models/security.model';

export default class SecurityDb {
  constructor(db) {
    this.security = Security(db);
  }

  getSecurity() {
    return this.security.findOne()
      .then(
        sec => sec,
        err => {
          console.log(err);
        }
      );
  }
}
