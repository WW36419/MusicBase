import Database from '../database'
import {config} from '../../config'
import bcrypt from 'bcrypt'

class PasswordService {
    private db: Database
    constructor() {
        this.db = new Database(config.db_info)
    }

    public async createOrUpdate(data: any) {
        console.log(JSON.stringify(data))
        const checkQuery = "SELECT * FROM userbase.passwords WHERE user_id = $1"
        const checkResult = await this.db.queryWithParams(checkQuery, [data.user_id])

        if (checkResult.rowCount === 0) {
            const query = "INSERT INTO userbase.passwords VALUES ($1, $2)"
            return this.db.queryWithParams(query, [data.user_id, data.password])
        } else {
            const query = "UPDATE userbase.profiles SET password = $2 WHERE user_id = $1"
            return this.db.queryWithParams(query, [data.user_id, data.password])
        }
    }
 
    public async authorize(userId: string, password: string) {
        try {
            const query = "SELECT * FROM userbase.passwords WHERE user_id = $1"
            const data = await this.db.queryWithParams(query, [userId])
            return await bcrypt.compare(password, data.rows[0].password);
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
 
    }
 
    async hashPassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('hash', hashedPassword)
        return hashedPassword;
    }
} export default PasswordService