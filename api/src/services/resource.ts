import * as models from '@/models';

import multer from '@koa/multer';

import Service from './Service';

class Resource extends Service {
  private resourceModel: typeof models.Resource;

  public constructor(deps: { models?: typeof models }) {
    super();
    if (!deps.models || !deps.models.Resource) {
      throw new Error(
        'No models injected on auth service constructor',
      );
    }
    this.resourceModel = deps.models.Resource;
  }

  public create = async (files: multer.File[]) => {
    if (!files || !files.length) return [];
    const data = await Promise.all(
      files.map(async (file) => {
        const resource = {
          filename: file.filename,
          originalname: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          extension: file.originalname.split('.').pop(),
          meta: {},
        };
        return this.resourceModel.create(resource);
      }),
    );
    return data;
  };
}

export default Resource;