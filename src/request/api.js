
import f from './ajax'

/**
 * 电影搜索
 */
export const search = params => f.get('/v2/movie/search', params)


