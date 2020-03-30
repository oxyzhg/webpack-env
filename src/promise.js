const isFunction = veriable => typeof veriable === 'function';
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Mypromise {
  constructor(executor) {
    if (!isFunction(executor)) {
      throw new Error('Mypromise must accept a function as parameter');
    }

    this._status = PENDING;
    this._value = undefined;
    this._fulfilledQueues = [];
    this._rejectedQueues = [];

    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }

  _resolve(val) {
    if (this._status !== PENDING) return;

    const run = () => {
      this._status = FULFILLED;
      this._value = val;

      let cb;
      while ((cb = this._fulfilledQueues.shift())) {
        cb(val);
      }
    };

    setTimeout(run, 0);
  }

  _reject(err) {
    if (this._status !== PENDING) return;

    const run = () => {
      this._status = REJECTED;
      this._value = err;

      let cb;
      while ((cb = this._rejectedQueues.shift())) {
        cb(err);
      }
    };

    setTimeout(run, 0);
  }

  then(onFulfilled, OnRejected) {
    const { _status, _value } = this;

    return new Mypromise((onFulfilledNext, OnRejectedNext) => {
      const fulfilled = value => {
        try {
          if (!isFunction(onFulfilled)) {
            onFulfilledNext(value);
          } else {
            const res = onFulfilled(value);

            if (res instanceof Mypromise) {
              res.then(onFulfilledNext, OnRejectedNext);
            } else {
              onFulfilledNext(res);
            }
          }
        } catch (error) {
          OnRejectedNext(error);
        }
      };

      const rejected = error => {
        try {
          if (!isFunction(OnRejected)) {
            OnRejected(error);
          } else {
            const res = OnRejected(error);

            if (res instanceof Mypromise) {
              res.then(onFulfilledNext, OnRejectedNext);
            } else {
              OnRejectedNext(error);
            }
          }
        } catch (err) {
          OnRejectedNext(err);
        }
      };

      switch (_status) {
        case PENDING:
          this._fulfilledQueues.push(onFulfilled);
          this._rejectedQueues.push(OnRejected);
          break;
        case FULFILLED:
          fulfilled(_value);
          break;
        case REJECTED:
          rejected(_value);
          break;
        default:
          return;
      }
    });
  }

  catch(OnRejected) {
    return this.then(undefined, OnRejected);
  }

  static resolve(value) {
    if (value instanceof Mypromise) {
      return value;
    }
    return new Mypromise(resolve => resolve(value));
  }

  static reject(value) {
    if (value instanceof Mypromise) {
      return value;
    }
    return new Mypromise((resolve, reject) => reject(value));
  }

  static all(list) {
    return new Mypromise((resolve, reject) => {
      let value = [];
      let count = 0;

      for (let [i, p] of list.entries()) {
        this.resolve(p).then(
          res => {
            value[i] = res;
            count++;

            if (this.list === count) {
              resolve(value);
            }
          },
          err => {
            reject(err);
          }
        );
      }
    });
  }

  static race(list) {
    return new Mypromise((resolve, reject) => {
      for (let p of list) {
        this.resolve(p).then(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
      }
    });
  }
}

export default Mypromise;
