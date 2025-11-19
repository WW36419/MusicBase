import pg from 'pg'
const { Pool } = pg
 

class Database {
    private pool: any

    constructor(db_info: any) {
        this.pool = new Pool(db_info)
    }

    public async queryWithParams(text: string, params: any) {
        const start = Date.now()
        const res = await this.pool.query(text, params)
        const duration = Date.now() - start
        console.log('executed query', { text, duration, rows: res.rowCount })
        return res
    }

    public async query(text: string) {
        const start = Date.now()
        const res = await this.pool.query(text)
        const duration = Date.now() - start
        console.log('executed query', { text, duration, rows: res.rowCount })
        return res
    }

    public async getClient() {
        return this.pool.connect()
    }
} export default Database