import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';

const server = new EventEmitter();
const client = new EventEmitter();

describe('Client-Server tests', () => {
  it('Client test', (done) => {
    client.emit('data', {'type': 'message', 'text': 'Message from client'}, () => {
      client.emit('end');
    });
    let response = '';
    client.on('data', (chunk) => {
      response += chunk;
    });
    client.on('end', () => {
      const jsonResponse = JSON.parse(response);
      expect(jsonResponse).to.be.eql({'type': 'message', 'text': 'Message from server'});
    });
    done();
  });

  it('Server test', (done) => {
    let message = '';
    server.on('data', (chunk) => {
      message += chunk;
    });
    server.on('end', () => {
      const jsonMessage = JSON.parse(message);
      expect(jsonMessage.text).to.be.equal({'type': 'message', 'text': 'Message from client'});
    });
    server.emit('data', {'type': 'message', 'text': 'Message from server'}, () => {
      server.emit('end');
    });
    done();
  });
});
