import './style.scss';
import Mypromise from './promise';

const promise1 = new Mypromise(resolve => {
  setTimeout(() => {
    resolve('settimeout:1000');
  }, 1000);
});

promise1.then(res => {
  console.log(res);
});
