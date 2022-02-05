# Tester

## Use Api Request Library
```javascript
import { request } from '../helpers/api'

request('https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4', 'list', { method: 'get', queries: { limit: 1 } })
  .then(result => console.log(result)).catch(err => console.log(err))
request('https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab41', 'list', { method: 'get', queries: { limit: 10 } })
  .then(result => console.log(result)).catch(err => console.log(err))
request('https://stein.efisherygj.com/v1/storages/5e1edf521073e315924ceab41', 'list', { method: 'get', queries: { limit: 10 } })
  .then(result => console.log(result)).catch(err => console.log(err))
```

## User File Library
```javascript
import { read, write } from '../../src/helpers/files'

write('test.db', 'hello world new')
console.log(read('test.db'))
```
