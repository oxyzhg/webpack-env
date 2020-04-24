import { pick } from 'lodash-es';
import './style.scss';

const obj = {
  name: 'moggo',
  tag: 'v1.10',
  file: 'file1.ext',
};

const ret = pick(obj, ['name', 'tag']);

console.log(ret);

document.body.innerHTML = ret;
