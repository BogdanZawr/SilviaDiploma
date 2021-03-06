import _ from 'lodash';

import userWrite from '../model/write/user';
import fictionModel from '../model/write/fiction';
import validator from '../component/validator';

class FictionValidate {
  async create(body = {}, user) {
    const errorList = validator.validate(body, {
      name: {
        type: 'string',
        empty: false,
      },
      description: {
        type: 'string',
        empty: false,
      },
      genre: {
        type: 'array',
        items: {
          type: 'string',
          empty: false,
          enum: [
            'Антиутопия',
            'Детектив',
            'Драма',
            'Исторические',
            'Мистика',
            'Психилогия',
            'Романтика',
            'Стихи',
            'Ужасы',
            'Фантастика',
            'Фентези',
            'Экшн',
            'Приключения',
            'Комедия',
            'Статья',
            'Другое',
          ],
        },
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    const userObj = await userWrite.findById(user._id);

    if (!userObj) {
      throw 'User not found';
    }

    const data = {
      name: body.name,
      userId: userObj._id,
      description: body.description,
      status: 'inProgress',
      genre: body.genre,
    };

    return data;
  }

  async update(body = {}, user) {
    const errorList = validator.validate(body, {
      _id: {
        type: 'mongoId',
        empty: false,
      },
      name: {
        type: 'string',
        empty: false,
      },
      description: {
        type: 'string',
        empty: false,
      },
      status: {
        type: 'string',
        empty: false,
        enum: [
          'stopped',
          'inProgress',
          'completed',
        ],
      },
      genre: {
        type: 'array',
        items: {
          type: 'string',
          empty: false,
          enum: [
            'Антиутопия',
            'Детектив',
            'Драма',
            'Исторические',
            'Мистика',
            'Психилогия',
            'Романтика',
            'Стихи',
            'Ужасы',
            'Фантастика',
            'Фентези',
            'Экшн',
            'Приключения',
            'Комедия',
            'Статья',
            'Другое',
          ],
        },
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    const fiction = await fictionModel.findById(body._id);

    if (fiction.userId !== user._id) {
      throw 'Access denied';
    }

    return _.pick(body, ['_id', 'name', 'description', 'status', 'genre']);
  }

  async delete(body = {}, user) {
    const errorList = validator.validate(body, {
      _id: {
        type: 'mongoId',
        empty: false,
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    const fiction = await fictionModel.findById(body._id);

    if (fiction.userId !== user._id) {
      throw 'Access denied';
    }

    return _.pick(body, ['_id']);
  }

  async list(body = {}) {
    const data = {};

    const sortFieldsList = [
      'name',
    ];

    if (body.sort) {
      try {
        data.sort = JSON.parse(body.sort);
      } catch (e) {
        throw 'Invaild field sort';
      }

      _.keys(data.sort).forEach((key) => {
        if (!~_.indexOf(sortFieldsList, key)) {
          throw `${key} cannot be used in sort`;
        }

        if (!~_.indexOf(['asc', 'desc'], data.sort[key])) {
          const error = {
            field: key,
            value: data.sort[key],
          };
          throw `Invalid value: ${error.value}; of the field: ${error.field} in sort`;
        }
      });
    }

    if (!_.isUndefined(body.limit)) {
      const limit = Number(body.limit);

      if (_.isInteger(limit)) {
        data.limit = limit;
      } else {
        throw 'Invaild field limit';
      }
    }

    if (!_.isUndefined(body.pageNumber)) {
      const pageNumber = Number(body.pageNumber);

      if (_.isInteger(pageNumber)) {
        data.pageNumber = pageNumber;
      } else {
        throw 'Invaild field pageNumber';
      }
    }

    if (!_.isUndefined(body.search)) {
      if (typeof body.search === 'string') {
        data.search = body.search;
      } else {
        throw 'Invaild field limit';
      }
    }

    return data;
  }
}

export default new FictionValidate();
