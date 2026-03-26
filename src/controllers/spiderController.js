const { success } = require('../utils/response');
const { query } = require('../config/db');

const MAX_BATCH_SIZE = 100;

function normalizeString(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

function normalizeItem(item = {}) {
  return {
    title: normalizeString(item.title),
    imageUrl: normalizeString(item.imageUrl),
    sourceUrl: normalizeString(item.sourceUrl),
    pageType: normalizeString(item.pageType),
  };
}

function getItemsFromBody(body = {}) {
  if (Array.isArray(body.items)) {
    return body.items;
  }

  if (body && typeof body === 'object') {
    return [body];
  }

  return [];
}

function validateItems(items) {
  if (!items.length) {
    throw { status: 400, message: '请求体不能为空' };
  }

  if (items.length > MAX_BATCH_SIZE) {
    throw { status: 400, message: `单次最多提交 ${MAX_BATCH_SIZE} 条数据` };
  }

  return items.map((rawItem, index) => {
    const item = normalizeItem(rawItem);

    if (!item.title) {
      throw { status: 400, message: `第 ${index + 1} 条数据缺少 title` };
    }

    if (!item.imageUrl) {
      throw { status: 400, message: `第 ${index + 1} 条数据缺少 imageUrl` };
    }

    if (!isValidUrl(item.imageUrl)) {
      throw { status: 400, message: `第 ${index + 1} 条数据的 imageUrl 非法` };
    }

    if (item.sourceUrl && !isValidUrl(item.sourceUrl)) {
      throw { status: 400, message: `第 ${index + 1} 条数据的 sourceUrl 非法` };
    }

    return item;
  });
}

async function createSpiderAssets(req, res, next) {
  try {
    const items = validateItems(getItemsFromBody(req.body));
    const sql = `
      INSERT INTO official_site_assets (title, image_url, source_url, page_type)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        page_type = VALUES(page_type),
        updated_at = CURRENT_TIMESTAMP
    `;

    for (const item of items) {
      await query(sql, [
        item.title,
        item.imageUrl,
        item.sourceUrl || null,
        item.pageType || null,
      ]);
    }

    return res.status(201).json(
      success(
        {
          count: items.length,
          items,
        },
        '采集数据写入成功'
      )
    );
  } catch (error) {
    return next(error);
  }
}

async function getSpiderAssets(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const rows = await query(
      `
        SELECT id, title, image_url AS imageUrl, source_url AS sourceUrl, page_type AS pageType,
               created_at AS createdAt, updated_at AS updatedAt
        FROM official_site_assets
        ORDER BY id DESC
        LIMIT ?
      `,
      [limit]
    );

    return res.json(success(rows));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createSpiderAssets,
  getSpiderAssets,
};
