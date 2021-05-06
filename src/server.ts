import * as net from 'net';
import * as fs from 'fs';

/**
 * Tipo de dato que indica el tipo de respuesta enviada desde el servidor al cliente.
 */
type ResponseType = {
  type: string;
  description?: string;
}

/**
 * Servidor que se encuentra escuchando en el puerto 60300.
 */
const server = net.createServer({allowHalfOpen: true}, (connection) => {
  console.log('A client has connected');

  /**
   * Se reciben los fragmentos de mensajes del cliente.
   */
  let message = '';
  connection.on('data', (chunkMessage) => {
    message += chunkMessage;
  });

  /**
   * Cuando el cliente ha terminado el envio, se procesa el mensaje completo.
   */
  connection.on('end', () => {
    console.log('The client has finished sending the message');

    const jsonMessage = JSON.parse(message);

    fs.appendFile('databaseMessages.txt', jsonMessage.text + '\n', (err) => {
      let response: ResponseType;
      if (err) {
        console.log('An error has occurred writing the message in the file');
        response = {
          type: 'err',
          description: 'wrong writing to file',
        };
      } else {
        console.log('The message has been written correctly in the file');
        response = {
          type: 'success',
        };
      }
      connection.write(JSON.stringify(response), (err) => {
        if (err) {
          console.log(`The response could not be sent to the client: ${err.message}`);
        } else {
          connection.end();
        }
      });
    });
  });

  /**
   * En caso de que sucede un error en la conexión se gestiona adecuadamente.
   */
  connection.on('error', (err) => {
    if (err) {
      console.log(`An error occurred while establishing the connection: ${err.message}`);
    }
  });

  /**
   * Cuando se cierra la conexión se muestra un mensaje en el servidor.
   */
  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
});

/**
 * El servidor se encuentra escuchando en el puerto 60300.
 */
server.listen(60300, () => {
  console.log('Waiting for clients to connect...');
});
