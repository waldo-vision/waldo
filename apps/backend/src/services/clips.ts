import path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { spawn } from 'child_process';

import { Footage } from '../models/footage.interface';

const newClipIds: Array<string> = [];

function getDirectories(source: string) {
  return fs
    .readdirSync(source)
    .map(file => path.join(source, file))
    .filter(path => fs.statSync(path).isDirectory());
}

async function storeClips(id: string) {
  if (process.env.FS_LOCATION && !fs.existsSync(process.env.FS_LOCATION)) {
    await fs.mkdirSync(process.env.FS_LOCATION);
  }

  const clipDirs = await getDirectories('clips');
  for (const clipDir of clipDirs) {
    const uuid = uuidv4();
    const footageDir = `${process.env.FS_LOCATION}/${id}`;
    const clipLocation = `${footageDir}/${uuid}`;

    newClipIds.push(uuid);

    if (!fs.existsSync(footageDir)) {
      fs.mkdirSync(footageDir);
    }

    await fs.mkdirSync(clipLocation);
    await fse.copy(clipDir, clipLocation);
  }
}

export function parseClips(uuid: string, video: string): void {
  if (!fs.existsSync('clips')) {
    fs.mkdirSync('clips');
  }

  const pyPro = spawn('python3', ['autoClip.py', 'test-new.mp4', 'clips', '1']);

  pyPro.on('exit', async () => {
    const clipDirs = await getDirectories('clips');

    if (clipDirs.length > 0) {
      await storeClips(uuid);

      fs.rmSync('clips', { recursive: true, force: true });
      fs.rmSync(video, { force: true });

      const filter = { uuid: uuid };
      await Footage.findOneAndUpdate(filter, {
        parsed: true,
        csgoFootage: true,
        analyzed: false,
        clips: newClipIds,
      });
    } else {
      const filter = { uuid: uuid };
      await Footage.findOneAndUpdate(filter, {
        parsed: true,
        analyzed: false,
        csgoFootage: false,
      });
    }
  });
}
