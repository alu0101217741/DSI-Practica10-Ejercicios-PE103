import * as net from 'net';

/**
 * El programa se debe ejecutar de la siguiente forma: node dist/client.js mensaje_que_se_quiere_enviar
 */
if (process.argv.length < 3) {
  console.log('The message must include at least one word');
} else {
  /**
   * El cliente se conecta al puerto 60300 del servidor.
   */
  const client = net.connect({port: 60300});

  /**
   * Se procesa el mensaje que se introduce por línea de comandos.
   */
  const text = process.argv.splice(2).join(' ');

  const message = {
    type: 'message',
    text: text,
  };

  /**
   * Se envía el mensaje al servidor.
   */
  client.write(JSON.stringify(message), (err) => {
    if (err) {
      console.log(`An error occurred sending the message to the server: ${err.message}`);
    } else {
      client.end();
    }
  });

  /**
   * Se reciben los fragmentos de la respuesta del servidor.
   */
  let response = '';
  client.on('data', (responseChunk) => {
    response += responseChunk;
  });

  /**
   * Cuando el servidor ha terminado el envío, se procesa la respuesta completa.
   */
  client.on('end', () => {
    const jsonResponse = JSON.parse(response);
    if (jsonResponse.type == 'success') {
      console.log('The message was successfully written to the server');
    } else if (jsonResponse.type == 'err') {
      console.log('An error has occurred on the server:' + jsonResponse.description);
    }
  });

  /**
   * En caso de que sucede un error en la conexión se gestiona adecuadamente.
   */
  client.on('error', (err) => {
    console.log(`An error occurred while establishing the connection: ${err.message}`);
  });
}
