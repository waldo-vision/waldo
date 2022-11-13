import {
  createResultHandler,
  createApiResponse,
  EndpointsFactory,
  z,
} from 'express-zod-api';
import mime from 'mime';
import * as fs from 'fs';
export const fileStreamingEndpointsFactory = new EndpointsFactory({
  resultHandler: createResultHandler({
    getPositiveResponse: () => createApiResponse(z.file().binary(), 'video/*'),
    getNegativeResponse: () =>
      createApiResponse(
        z.object({ message: z.string() }),
        mime.getType('txt') || 'text/plain',
      ),
    handler: ({ response, error, output }) => {
      console.log(output);
      if (error) {
        response.status(422).send(error.message);
        return;
      }
      if ('uuid' in output) {
        if (fs.existsSync(output.uuid + '.mp4')) {
          fs.createReadStream(output.uuid + '.mp4').pipe(
            response.type(output.uuid),
          );
        } else {
          response.status(400).json({
            message:
              'An error occured locating the file: ' + output.uuid + '.mp4',
          });
        }
      } else {
        response
          .status(400)
          .json({ message: 'No uuid was found in the output directory.' });
      }
    },
  }),
});
