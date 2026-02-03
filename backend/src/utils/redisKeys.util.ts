export const RedisKeys = {
    getTodosKey: (limit: number, offset: number) => `${limit}:${offset}`
}