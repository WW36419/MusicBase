import jwt from 'jsonwebtoken';
import Database from '../database';
import {config} from '../../config';

class TokenService {
    private db: Database

    constructor() {
        this.db = new Database(config.db_info)
    }

    public async create(user: any) {
        const userData = {
           userId: user.user_id,
           name: user.user_name,
           email: user.email,
           isAdmin: user.is_admin
        };

        const value = jwt.sign(
           userData,
           config.JwtSecret,
           {expiresIn: '3h'}
        );

        try {
            const query = "INSERT INTO userbase.tokens (user_id, token_type, token_value, create_date) VALUES($1, 'authorization', $2, $3)";
            const values = [user.user_id, value, new Date().getTime()]
            
            const result = await this.db.queryWithParams(query, values);
            if (result) {return result;}

        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }
 
    public async getToken(user_id: string) {
        const query = "SELECT token_value FROM userbase.tokens WHERE user_id = $1"
        const result = await this.db.queryWithParams(query, [user_id])
        return {token: result.rows[0].token_value};
    }
 
    public async remove(userId: string) {
        try {
            const query = "DELETE FROM userbase.tokens WHERE user_id = $1"
            const result = await this.db.queryWithParams(query, [userId]);

            if (result.rowCount === 0) {
                throw new Error('Wystąpił błąd podczas usuwania danych');
            }
            return result;
        } catch (error) {
            console.error('Error while removing token:', error);
            throw new Error('Error while removing token');
        }
    }
 }
 
 export default TokenService;